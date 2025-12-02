package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "log"
    "net/http"
    "time"

    amqp "github.com/rabbitmq/amqp091-go"
)

type WeatherPayload struct {
    Temperature float64 `json:"temperature"`
    Humidity    float64 `json:"humidity"`
    WindSpeed   float64 `json:"windSpeed"`
    Condition   string  `json:"condition"`
    Location    string  `json:"location"`
    Latitude    float64 `json:"latitude,omitempty"`
    Longitude   float64 `json:"longitude,omitempty"`
    Timestamp   string  `json:"timestamp"`
}

func failOnError(err error, msg string) {
    if err != nil {
        log.Fatalf("%s: %s", msg, err)
    }
}

func main() {
    rabbitmqURL := "amqp://guest:guest@rabbitmq:5672/"
    backendAPIURL := "http://backend:3001/weather/logs"

    var conn *amqp.Connection
    var err error

    for i := 0; i < 30; i++ {
        conn, err = amqp.Dial(rabbitmqURL)
        if err == nil {
            break
        }
        log.Printf("⏳ Retrying RabbitMQ connection (%d/30)...", i+1)
        time.Sleep(2 * time.Second)
    }
    failOnError(err, "Failed to connect to RabbitMQ")
    defer conn.Close()

    ch, err := conn.Channel()
    failOnError(err, "Failed to open a channel")
    defer ch.Close()

    q, err := ch.QueueDeclare(
        "weather_data",
        true,
        false,
        false,
        false,
        nil,
    )
    failOnError(err, "Failed to declare a queue")

    msgs, err := ch.Consume(
        q.Name,
        "",
        false,
        false,
        false,
        false,
        nil,
    )
    failOnError(err, "Failed to register a consumer")

    log.Println("🚀 Worker started. Waiting for weather data...")

    go func() {
        for d := range msgs {
            var weather WeatherPayload
            err := json.Unmarshal(d.Body, &weather)
            if err != nil {
                log.Printf("❌ Error parsing JSON: %s", err)
                d.Nack(false, false)
                continue
            }

            log.Printf("📥 Received: %.1f°C, %.0f%% humidity from %s",
                weather.Temperature, weather.Humidity, weather.Location)

            err = sendToBackendAPI(backendAPIURL, weather)
            if err != nil {
                log.Printf("❌ Failed to send to API: %v", err)
                d.Nack(false, true) 
                continue
            }

            d.Ack(false)
            log.Println("✅ Processed message and ACKed")
        }
    }()

    select {}
}

func sendToBackendAPI(apiURL string, weather WeatherPayload) error {
    jsonData, err := json.Marshal(weather)
    if err != nil {
        return fmt.Errorf("failed to marshal JSON: %w", err)
    }

    resp, err := http.Post(apiURL, "application/json", bytes.NewBuffer(jsonData))
    if err != nil {
        return fmt.Errorf("failed to POST to API: %w", err)
    }
    defer resp.Body.Close()

    body, err := io.ReadAll(resp.Body)
    if err != nil {
        return fmt.Errorf("failed to read response: %w", err)
    }

    if resp.StatusCode >= 400 {
        return fmt.Errorf("API error %d: %s", resp.StatusCode, string(body))
    }

    log.Printf("📤 Sent data to backend successfully: %s", string(body))
    return nil
}
