import requests
import pika
import json
import os
import schedule
import time
from dotenv import load_dotenv

load_dotenv()

RABBITMQ_URL = os.getenv("RABBITMQ_URL")
CITY_LAT = float(os.getenv("CITY_LAT"))
CITY_LON = float(os.getenv("CITY_LON"))
LOCATION = os.getenv("LOCATION")

interval_minutes = int(os.getenv("WEATHER_INTERVAL_MINUTES"))


def fetch_weather():
    """Fetch weather data from Open-Meteo API"""
    url = f"https://api.open-meteo.com/v1/forecast?latitude={CITY_LAT}&longitude={CITY_LON}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation_probability&timezone=America/Sao_Paulo"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()

        current = data["current_weather"]
        hourly = data["hourly"]

        latest_hour = len(hourly["time"]) - 1

        weather_data = {
            "temperature": round(current["temperature"], 1),
            "humidity": hourly["relative_humidity_2m"][latest_hour],
            "windSpeed": round(current["windspeed"], 1),
            "condition": (
                "Clear"
                if current["weathercode"] < 3
                else "Cloudy" if current["weathercode"] < 50 else "Rain"
            ),
            "location": LOCATION,
            "latitude": CITY_LAT,
            "longitude": CITY_LON,
            "timestamp": current["time"],
        }

        print(
            f"🌤️ Fetched weather: {weather_data['temperature']}°C, {weather_data['humidity']}% humidity"
        )
        send_to_queue(weather_data)
    except Exception as e:
        print(f"❌ Error fetching weather: {e}")


def send_to_queue(weather_data):
    try:
        connection = pika.BlockingConnection(pika.URLParameters(RABBITMQ_URL))
        channel = connection.channel()
        channel.queue_declare(queue="weather_data", durable=True)

        channel.basic_publish(
            exchange="",
            routing_key="weather_data",
            body=json.dumps(weather_data),
            properties=pika.BasicProperties(delivery_mode=2),
        )

        print("✅ Sent to RabbitMQ queue")
        connection.close()
    except Exception as e:
        print(f"❌ Error sending to queue: {e}")


def job():
    print("🚀 Starting weather collector job...")
    fetch_weather()


job()
schedule.every(interval_minutes).minutes.do(job)

print(f"⏰ Scheduled weather collection every {interval_minutes} minutes")
while True:
    schedule.run_pending()
    time.sleep(1)
