from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
import requests


# ============================================================
# APP SETUP
# ============================================================

app = Flask(__name__)
CORS(app)


# ============================================================
# DEFAULT HOME LOCATION
# ============================================================

DEFAULT_HOME_CITY = "Chennai"
DEFAULT_HOME_TIMEZONE = "Asia/Kolkata"


# ============================================================
# WEATHER CODE DESCRIPTION
# ============================================================

def get_weather_description(code):

    weather_codes = {

        0: "☀️ Clear sky",

        1: "🌤️ Mainly clear",
        2: "⛅ Partly cloudy",
        3: "☁️ Overcast",

        45: "🌫️ Fog",
        48: "🌫️ Depositing rime fog",

        51: "🌦️ Light drizzle",
        53: "🌦️ Moderate drizzle",
        55: "🌧️ Dense drizzle",

        56: "🌧️ Light freezing drizzle",
        57: "🌧️ Dense freezing drizzle",

        61: "🌧️ Slight rain",
        63: "🌧️ Moderate rain",
        65: "🌧️ Heavy rain",

        66: "🌧️ Light freezing rain",
        67: "🌧️ Heavy freezing rain",

        71: "🌨️ Slight snowfall",
        73: "🌨️ Moderate snowfall",
        75: "❄️ Heavy snowfall",

        77: "❄️ Snow grains",

        80: "🌦️ Slight rain showers",
        81: "🌧️ Moderate rain showers",
        82: "⛈️ Violent rain showers",

        85: "🌨️ Slight snow showers",
        86: "🌨️ Heavy snow showers",

        95: "⛈️ Thunderstorm",

        96: "⛈️ Thunderstorm with slight hail",
        99: "⛈️ Thunderstorm with heavy hail"
    }

    return weather_codes.get(code, "❓ Unknown weather")


# ============================================================
# AQI DESCRIPTION
# ============================================================

def get_aqi_description(aqi):

    if aqi is None:
        return "Unknown"

    if aqi <= 50:
        return "🟢 Good"

    elif aqi <= 100:
        return "🟡 Moderate"

    elif aqi <= 150:
        return "🟠 Unhealthy for sensitive groups"

    elif aqi <= 200:
        return "🔴 Unhealthy"

    elif aqi <= 300:
        return "🟣 Very unhealthy"

    else:
        return "🟤 Hazardous"


# ============================================================
# TIME DIFFERENCE FORMATTER
# ============================================================

def format_time_difference(destination_timezone, home_timezone):

    destination_now = datetime.now(ZoneInfo(destination_timezone))
    home_now = datetime.now(ZoneInfo(home_timezone))

    difference = destination_now.utcoffset() - home_now.utcoffset()

    total_seconds = int(difference.total_seconds())

    sign = "+" if total_seconds >= 0 else "-"

    total_seconds = abs(total_seconds)

    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60

    if minutes == 0:
        return f"{sign}{hours} hours"

    return f"{sign}{hours} hours {minutes} minutes"


# ============================================================
# CITY SEARCH USING OPEN-METEO GEOCODING
# ============================================================

def search_city(city_name):

    url = "https://geocoding-api.open-meteo.com/v1/search"

    params = {
        "name": city_name,
        "count": 1,
        "language": "en",
        "format": "json"
    }

    try:

        response = requests.get(
            url,
            params=params,
            timeout=10
        )

        response.raise_for_status()

        data = response.json()

        if "results" not in data or not data["results"]:
            return None

        location = data["results"][0]

        return {
            "city": location["name"],
            "country": location.get("country", "Unknown"),
            "country_code": location.get("country_code", ""),
            "timezone": location["timezone"],
            "latitude": location["latitude"],
            "longitude": location["longitude"]
        }

    except requests.RequestException:

        return None


# ============================================================
# GET WEATHER DATA
# ============================================================

def get_weather(latitude, longitude, timezone):

    url = "https://api.open-meteo.com/v1/forecast"

    params = {

        "latitude": latitude,
        "longitude": longitude,

        "current": ",".join([
            "temperature_2m",
            "relative_humidity_2m",
            "apparent_temperature",
            "precipitation",
            "rain",
            "weather_code",
            "wind_speed_10m",
            "uv_index",
            "is_day"
        ]),

        "daily": ",".join([
            "sunrise",
            "sunset",
            "daylight_duration"
        ]),

        "timezone": timezone,

        "forecast_days": 1
    }

    try:

        response = requests.get(
            url,
            params=params,
            timeout=10
        )

        response.raise_for_status()

        return response.json()

    except requests.RequestException:

        return None


# ============================================================
# GET 7 DAY FORECAST
# ============================================================

def get_forecast(latitude, longitude, timezone):

    url = "https://api.open-meteo.com/v1/forecast"

    params = {

        "latitude": latitude,
        "longitude": longitude,

        "daily": ",".join([
            "weather_code",
            "temperature_2m_max",
            "temperature_2m_min",
            "precipitation_probability_max",
            "rain_sum",
            "sunrise",
            "sunset",
            "uv_index_max",
            "daylight_duration"
        ]),

        "timezone": timezone,

        "forecast_days": 7
    }

    try:

        response = requests.get(
            url,
            params=params,
            timeout=10
        )

        response.raise_for_status()

        return response.json()

    except requests.RequestException:

        return None


# ============================================================
# GET AIR QUALITY
# ============================================================

def get_air_quality(latitude, longitude, timezone):

    url = "https://air-quality-api.open-meteo.com/v1/air-quality"

    params = {

        "latitude": latitude,
        "longitude": longitude,

        "current": ",".join([
            "us_aqi",
            "pm2_5",
            "pm10"
        ]),

        "timezone": timezone
    }

    try:

        response = requests.get(
            url,
            params=params,
            timeout=10
        )

        response.raise_for_status()

        return response.json()

    except requests.RequestException:

        return None


# ============================================================
# TRAVEL ADVICE
# ============================================================

def generate_travel_advice(weather, air_quality):

    advice = []

    if weather is not None:

        current = weather.get("current", {})

        temperature = current.get("temperature_2m")
        rain = current.get("rain", 0)
        uv = current.get("uv_index")

        weather_code = current.get("weather_code")

        # Temperature advice

        if temperature is not None:

            if temperature >= 35:

                advice.append(
                    "🥵 Very hot weather. Carry water and avoid long outdoor activities at midday."
                )

            elif temperature >= 30:

                advice.append(
                    "☀️ Warm weather. Stay hydrated and consider light clothing."
                )

            elif temperature <= 10:

                advice.append(
                    "🥶 Cold weather. Carry warm clothing."
                )

            elif temperature <= 18:

                advice.append(
                    "🧥 Cool weather. A light jacket may be useful."
                )

            else:

                advice.append(
                    "😊 Comfortable temperature for outdoor activities."
                )

        # Rain advice

        if rain is not None and rain > 0:

            advice.append(
                "☔ Rain is currently occurring. Carry an umbrella or rain jacket."
            )

        elif weather_code in [51, 53, 55, 61, 63, 65, 80, 81, 82]:

            advice.append(
                "🌧️ Rain is possible. Carry an umbrella."
            )

        # UV advice

        if uv is not None:

            if uv >= 8:

                advice.append(
                    "🧴 Very high UV. Use sunscreen, sunglasses and limit midday sun exposure."
                )

            elif uv >= 6:

                advice.append(
                    "🧴 High UV. Sunscreen is recommended."
                )

            elif uv >= 3:

                advice.append(
                    "😎 Moderate UV. Consider sunscreen for prolonged outdoor activities."
                )

    # Air quality advice

    if air_quality is not None:

        current_air = air_quality.get("current", {})

        aqi = current_air.get("us_aqi")

        if aqi is not None:

            if aqi > 150:

                advice.append(
                    "😷 Air quality is unhealthy. Consider limiting prolonged outdoor activity."
                )

            elif aqi > 100:

                advice.append(
                    "😷 Air quality may affect sensitive people."
                )

            elif aqi <= 50:

                advice.append(
                    "🌿 Air quality is good for outdoor activities."
                )

    return advice


# ============================================================
# HOME
# ============================================================

@app.route("/")
def home():

    return jsonify({
        "message": "🌍 Tourism Intelligence API is running!",
        "version": "2.0",
        "features": [
            "City search",
            "Destination time",
            "Time difference",
            "Current weather",
            "7-day forecast",
            "UV index",
            "Sunrise and sunset",
            "Air quality",
            "Travel advice"
        ]
    })


# ============================================================
# HELLO API
# ============================================================

@app.route("/api/hello")
def hello():

    return jsonify({
        "message": "Hello from Tourism API 👋"
    })


# ============================================================
# SEARCH CITY
# ============================================================

@app.route("/api/search/<city>")
def search_destination(city):

    destination = search_city(city)

    if destination is None:

        return jsonify({
            "error": "City not found",
            "city": city
        }), 404

    return jsonify(destination)


# ============================================================
# DESTINATION TIME
# ============================================================

@app.route("/api/time/<city>")
def destination_time(city):

    destination = search_city(city)

    if destination is None:

        return jsonify({
            "error": "City not found"
        }), 404

    # Frontend can optionally send:
    # ?from_timezone=Asia/Kolkata

    home_timezone = request.args.get(
        "from_timezone",
        DEFAULT_HOME_TIMEZONE
    )

    try:

        home_zone = ZoneInfo(home_timezone)

    except Exception:

        return jsonify({
            "error": "Invalid home timezone"
        }), 400

    try:

        destination_zone = ZoneInfo(
            destination["timezone"]
        )

    except Exception:

        return jsonify({
            "error": "Destination timezone unavailable"
        }), 500

    home_now = datetime.now(home_zone)

    destination_now = datetime.now(destination_zone)

    difference = format_time_difference(
        destination["timezone"],
        home_timezone
    )

    return jsonify({

        "home": {
            "city": DEFAULT_HOME_CITY,
            "timezone": home_timezone,
            "time": home_now.strftime(
                "%Y-%m-%d %H:%M:%S"
            )
        },

        "destination": {
            "city": destination["city"],
            "country": destination["country"],
            "timezone": destination["timezone"],
            "time": destination_now.strftime(
                "%Y-%m-%d %H:%M:%S"
            )
        },

        "difference": difference
    })


# ============================================================
# CURRENT WEATHER
# ============================================================

@app.route("/api/weather/<city>")
def current_weather(city):

    destination = search_city(city)

    if destination is None:

        return jsonify({
            "error": "City not found"
        }), 404

    weather = get_weather(
        destination["latitude"],
        destination["longitude"],
        destination["timezone"]
    )

    if weather is None:

        return jsonify({
            "error": "Unable to fetch weather data"
        }), 502

    current = weather["current"]

    daily = weather["daily"]

    weather_code = current.get(
        "weather_code"
    )

    return jsonify({

        "city": destination["city"],

        "country": destination["country"],

        "timezone": destination["timezone"],

        "weather": {

            "temperature": current.get(
                "temperature_2m"
            ),

            "feels_like": current.get(
                "apparent_temperature"
            ),

            "humidity": current.get(
                "relative_humidity_2m"
            ),

            "precipitation": current.get(
                "precipitation"
            ),

            "rain": current.get(
                "rain"
            ),

            "wind_speed": current.get(
                "wind_speed_10m"
            ),

            "uv_index": current.get(
                "uv_index"
            ),

            "weather_code": weather_code,

            "condition": get_weather_description(
                weather_code
            ),

            "is_day": current.get(
                "is_day"
            ),

            "sunrise": daily["sunrise"][0],

            "sunset": daily["sunset"][0],

            "daylight_duration_seconds":
                daily["daylight_duration"][0]
        }
    })


# ============================================================
# AIR QUALITY
# ============================================================

@app.route("/api/air-quality/<city>")
def air_quality(city):

    destination = search_city(city)

    if destination is None:

        return jsonify({
            "error": "City not found"
        }), 404

    data = get_air_quality(
        destination["latitude"],
        destination["longitude"],
        destination["timezone"]
    )

    if data is None:

        return jsonify({
            "error": "Unable to fetch air quality data"
        }), 502

    current = data.get(
        "current",
        {}
    )

    aqi = current.get(
        "us_aqi"
    )

    return jsonify({

        "city": destination["city"],

        "country": destination["country"],

        "air_quality": {

            "us_aqi": aqi,

            "aqi_status": get_aqi_description(
                aqi
            ),

            "pm2_5": current.get(
                "pm2_5"
            ),

            "pm10": current.get(
                "pm10"
            )
        }
    })


# ============================================================
# 7 DAY FORECAST
# ============================================================

@app.route("/api/forecast/<city>")
def forecast(city):

    destination = search_city(city)

    if destination is None:

        return jsonify({
            "error": "City not found"
        }), 404

    data = get_forecast(
        destination["latitude"],
        destination["longitude"],
        destination["timezone"]
    )

    if data is None:

        return jsonify({
            "error": "Unable to fetch forecast data"
        }), 502

    daily = data["daily"]

    forecast_list = []

    for i in range(
        len(daily["time"])
    ):

        weather_code = daily[
            "weather_code"
        ][i]

        forecast_list.append({

            "date": daily["time"][i],

            "max_temperature":
                daily["temperature_2m_max"][i],

            "min_temperature":
                daily["temperature_2m_min"][i],

            "rain":
                daily["rain_sum"][i],

            "rain_probability":
                daily[
                    "precipitation_probability_max"
                ][i],

            "uv_index":
                daily["uv_index_max"][i],

            "sunrise":
                daily["sunrise"][i],

            "sunset":
                daily["sunset"][i],

            "daylight_duration_seconds":
                daily[
                    "daylight_duration"
                ][i],

            "weather_code":
                weather_code,

            "condition":
                get_weather_description(
                    weather_code
                )
        })

    return jsonify({

        "city": destination["city"],

        "country": destination["country"],

        "timezone": destination["timezone"],

        "forecast": forecast_list
    })


# ============================================================
# ALL-IN-ONE DESTINATION API 🔥
# ============================================================

@app.route("/api/destination/<city>")
def destination(city):

    destination = search_city(city)

    if destination is None:

        return jsonify({
            "error": "City not found",
            "city": city
        }), 404

    # --------------------------------------------------------
    # HOME TIMEZONE
    # --------------------------------------------------------

    home_timezone = request.args.get(
        "from_timezone",
        DEFAULT_HOME_TIMEZONE
    )

    try:

        home_zone = ZoneInfo(
            home_timezone
        )

        destination_zone = ZoneInfo(
            destination["timezone"]
        )

    except Exception:

        return jsonify({
            "error": "Invalid timezone"
        }), 400

    # --------------------------------------------------------
    # TIME
    # --------------------------------------------------------

    home_now = datetime.now(
        home_zone
    )

    destination_now = datetime.now(
        destination_zone
    )

    difference = format_time_difference(
        destination["timezone"],
        home_timezone
    )

    # --------------------------------------------------------
    # WEATHER
    # --------------------------------------------------------

    weather_data = get_weather(
        destination["latitude"],
        destination["longitude"],
        destination["timezone"]
    )

    if weather_data is None:

        return jsonify({
            "error": "Unable to fetch weather"
        }), 502

    current = weather_data[
        "current"
    ]

    daily = weather_data[
        "daily"
    ]

    weather_code = current.get(
        "weather_code"
    )

    # --------------------------------------------------------
    # AIR QUALITY
    # --------------------------------------------------------

    air_data = get_air_quality(
        destination["latitude"],
        destination["longitude"],
        destination["timezone"]
    )

    air_quality_result = None

    if air_data is not None:

        air_current = air_data.get(
            "current",
            {}
        )

        aqi = air_current.get(
            "us_aqi"
        )

        air_quality_result = {

            "us_aqi": aqi,

            "aqi_status":
                get_aqi_description(aqi),

            "pm2_5":
                air_current.get("pm2_5"),

            "pm10":
                air_current.get("pm10")
        }

    # --------------------------------------------------------
    # TRAVEL ADVICE
    # --------------------------------------------------------

    travel_advice = generate_travel_advice(
        weather_data,
        air_data
    )

    # --------------------------------------------------------
    # FINAL RESPONSE
    # --------------------------------------------------------

    return jsonify({

        "destination": {

            "city":
                destination["city"],

            "country":
                destination["country"],

            "country_code":
                destination["country_code"],

            "timezone":
                destination["timezone"],

            "latitude":
                destination["latitude"],

            "longitude":
                destination["longitude"]
        },

        "time": {

            "home_city":
                DEFAULT_HOME_CITY,

            "home_timezone":
                home_timezone,

            "home_time":
                home_now.strftime(
                    "%Y-%m-%d %H:%M:%S"
                ),

            "destination_time":
                destination_now.strftime(
                    "%Y-%m-%d %H:%M:%S"
                ),

            "difference":
                difference
        },

        "weather": {

            "temperature":
                current.get(
                    "temperature_2m"
                ),

            "feels_like":
                current.get(
                    "apparent_temperature"
                ),

            "humidity":
                current.get(
                    "relative_humidity_2m"
                ),

            "precipitation":
                current.get(
                    "precipitation"
                ),

            "rain":
                current.get(
                    "rain"
                ),

            "wind_speed":
                current.get(
                    "wind_speed_10m"
                ),

            "uv_index":
                current.get(
                    "uv_index"
                ),

            "weather_code":
                weather_code,

            "condition":
                get_weather_description(
                    weather_code
                ),

            "is_day":
                current.get(
                    "is_day"
                ),

            "sunrise":
                daily["sunrise"][0],

            "sunset":
                daily["sunset"][0],

            "daylight_duration_seconds":
                daily[
                    "daylight_duration"
                ][0]
        },

        "air_quality":
            air_quality_result,

        "travel_advice":
            travel_advice
    })


# ============================================================
# RUN SERVER
# ============================================================

if __name__ == "__main__":

    app.run(
        debug=True,
        host="0.0.0.0",
        port=5000
    )