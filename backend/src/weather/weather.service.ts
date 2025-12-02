import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WeatherLog, WeatherLogDocument } from '../schemas/weather-log.schema';
import { Insight, InsightDocument } from '../schemas/insight.schema';
import * as XLSX from 'xlsx';

@Injectable()
export class WeatherService {
  constructor(
    @InjectModel(WeatherLog.name) private weatherModel: Model<WeatherLogDocument>,
    @InjectModel(Insight.name) private insightModel: Model<InsightDocument>,
  ) {}

  async createWeatherLog(data: Partial<WeatherLog>): Promise<WeatherLog> {
    const weatherLog = new this.weatherModel(data);
    await weatherLog.save();
    await this.generateInsights();
    
    return weatherLog;
  }

  async findAllWeatherLogs(): Promise<WeatherLog[]> {
    return this.weatherModel.find().sort({ createdAt: -1 }).limit(100).exec();
  }

  async generateInsights(): Promise<Insight[]> {
    const recentLogs = await this.weatherModel.find().sort({ createdAt: -1 }).limit(24).exec();
    
    if (recentLogs.length === 0) return [];

    const avgTemp = recentLogs.reduce((sum: number, log: WeatherLogDocument) => sum + log.temperature, 0) / recentLogs.length;
    const avgHumidity = recentLogs.reduce((sum: number, log: WeatherLogDocument) => sum + log.humidity, 0) / recentLogs.length;
    
    const insights: Insight[] = [];

    if (avgTemp > 30) {
      insights.push({
        type: 'Heat Alert',
        message: `Average temperature ${avgTemp.toFixed(1)}°C - Hot weather conditions`,
        severity: 'danger',
      });
    } else if (avgTemp < 15) {
      insights.push({
        type: 'Cold Alert',
        message: `Average temperature ${avgTemp.toFixed(1)}°C - Cold weather conditions`,
        severity: 'warning',
      });
    }

    if (avgHumidity > 80) {
      insights.push({
        type: 'High Humidity',
        message: `Average humidity ${avgHumidity.toFixed(1)}% - Humid conditions`,
        severity: 'warning',
      });
    }
    await this.insightModel.deleteMany({});
    await this.insightModel.insertMany(insights);
    
    return insights;
  }

  async getInsights(): Promise<Insight[]> {
    return this.insightModel.find().sort({ createdAt: -1 }).exec();
  }

  async exportData(format: 'csv' | 'xlsx'): Promise<string> {
    const logs = await this.findAllWeatherLogs();
    
    const worksheet = XLSX.utils.json_to_sheet(logs.map(log => ({
      Timestamp: log.createdAt,
      Temperature: `${log.temperature}°C`,
      Humidity: `${log.humidity}%`,
      'Wind Speed': `${log.windSpeed} km/h`,
      Condition: log.condition,
      Location: log.location,
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Weather Data');

    if (format === 'csv') {
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      return csv;
    }

    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    return excelBuffer.toString('base64');
  }
}
