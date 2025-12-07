import { useState, useEffect, useContext } from "react";
import { UserContext } from "../App";
import {
  LogOut,
  Download,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  User,
} from "lucide-react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface WeatherData {
  _id: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  createdAt: string;
  location: string;
}

interface Insight {
  type: string;
  message: string;
  severity: "info" | "warning" | "danger";
}

export default function Dashboard() {
  const { user, setUser } = useContext(UserContext)!;
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [weatherRes, insightsRes] = await Promise.all([
        axios.get("http://localhost:3001/weather/logs", {
          headers: { Authorization: `Bearer ${user!.token}` },
        }),
        axios.get("http://localhost:3001/weather/insights", {
          headers: { Authorization: `Bearer ${user!.token}` },
        }),
      ]);

      const weatherFixedDates = weatherRes.data.map((item: WeatherData) => {
        const dateObj = new Date(item.createdAt);
        return {
          ...item,
          createdAt: isNaN(dateObj.getTime())
            ? ""
            : `${dateObj.toLocaleDateString(
                "pt-BR"
              )} - ${dateObj.toLocaleTimeString("pt-BR")}`,
        };
      });

      setWeatherData(weatherFixedDates);
      setInsights(insightsRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: "csv" | "xlsx") => {
    const link = document.createElement("a");
    link.href = `http://localhost:3001/weather/export.${format}?token=${
      user!.token
    }`;
    link.download = `weather-data-${format.toUpperCase()}-${
      new Date().toISOString().split("T")[0]
    }`;
    link.click();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading weather data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
              <Sun className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                GDASH Weather Dashboard
              </h1>
              <p className="text-sm text-gray-500">São Paulo, SP</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="/users"
              className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors text-sm font-medium"
            >
              <User className="w-4 h-4" />
              <span>Gerenciar Usuários</span>
            </a>

            <button
              onClick={() => handleExport("csv")}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              <span>CSV</span>
            </button>
            <button
              onClick={() => handleExport("xlsx")}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              <span>XLSX</span>
            </button>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {insights.map((insight, i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl border shadow-sm ${
                insight.severity === "danger"
                  ? "bg-red-50 border-red-200"
                  : insight.severity === "warning"
                  ? "bg-yellow-50 border-yellow-200"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  insight.severity === "danger"
                    ? "bg-red-100"
                    : insight.severity === "warning"
                    ? "bg-yellow-100"
                    : "bg-blue-100"
                }`}
              >
                {insight.severity === "danger" && (
                  <CloudRain className="w-6 h-6 text-red-600" />
                )}
                {insight.severity === "warning" && (
                  <Droplets className="w-6 h-6 text-yellow-600" />
                )}
                {insight.severity === "info" && (
                  <Sun className="w-6 h-6 text-blue-600" />
                )}
              </div>
              <h3 className="font-semibold text-lg mb-2 capitalize">
                {insight.type}
              </h3>
              <p className="text-gray-700">{insight.message}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center space-x-2">
              <Sun className="w-6 h-6 text-yellow-500" />
              <span>Latest Readings</span>
            </h2>
            <div className="space-y-6">
              {weatherData[0] && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {weatherData[0].temperature}°
                        </span>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-gray-900">
                          {weatherData[0].temperature}°C
                        </p>
                        <p className="text-gray-600 capitalize">
                          {weatherData[0].condition}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6 pt-6 border-t">
                    <div className="text-center">
                      <Wind className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">
                        {weatherData[0].windSpeed} km/h
                      </p>
                      <p className="text-sm text-gray-500">Wind Speed</p>
                    </div>
                    <div className="text-center">
                      <Droplets className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gray-900">
                        {weatherData[0].humidity}%
                      </p>
                      <p className="text-sm text-gray-500">Humidity</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-xl font-bold mb-6">Temperature Trend (24h)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weatherData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="createdAt"
                  tick={{ fontSize: 10 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis width={80} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-xl font-bold mb-2">Weather History</h2>
            <p className="text-gray-600">Last 24 readings from São Paulo, SP</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Condition
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Temp
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Humidity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wind
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {weatherData.map((data) => (
                  <tr key={data._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {data.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                        {data.condition}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {data.temperature}°C
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {data.humidity}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {data.windSpeed} km/h
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
