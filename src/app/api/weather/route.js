import { NextResponse } from "next/server";
import { config } from "@/config/index";

const rateLimitMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 100;

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  const limit = rateLimitMap.get(ip);

  if (now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (limit.count >= maxRequests) {
    return true;
  }

  limit.count++;
  return false;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0]
      : request.headers.get("x-real-ip") || "127.0.0.1";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "RATE_LIMITED", message: "Too many requests. Please wait." },
        { status: 429 }
      );
    }

    const { weatherApiKey, weatherApiBaseUrl, mindanaoCities } = config;

    const sortedCities = [...mindanaoCities].sort((a, b) => a.localeCompare(b));

    if (!weatherApiKey) {
      return NextResponse.json(
        { error: "CONFIG_ERROR", message: "Weather API key not configured" },
        { status: 500 }
      );
    }

    if (sortedCities.length === 0) {
      return NextResponse.json(
        { error: "CONFIG_ERROR", message: "No cities configured" },
        { status: 500 }
      );
    }

    const currentDate = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Manila",
    });

    const weatherPromises = sortedCities.map(async (city) => {
      try {
        const response = await fetch(
          `${weatherApiBaseUrl}/forecast.json?key=${weatherApiKey}&q=${encodeURIComponent(
            city
          )}&days=14&aqi=no&alerts=no`
        );

        if (!response.ok) {
          console.error(`Weather API error for ${city}: ${response.status}`);
          return null;
        }

        const data = await response.json();

        if (date) {
          const requestedDay = data.forecast.forecastday.find(
            (day) => day.date === date
          );

          if (requestedDay) {
            return {
              city,
              location: {
                localtime: data.location.localtime,
                lat: data.location.lat,
                lon: data.location.lon,
                region: data.location.region,
              },
              current: {
                temp_c: requestedDay.day.avgtemp_c,
                feelslike_c: requestedDay.day.avgtemp_c,
                humidity: requestedDay.day.avghumidity,
                cloud: requestedDay.day.daily_chance_of_rain,
                wind_kph: requestedDay.day.maxwind_kph,
                wind_dir: "Variable",
                uv: requestedDay.day.uv,
                vis_km: requestedDay.day.avgvis_km,
                pressure_mb: 1013,
                last_updated: requestedDay.date,
                condition: {
                  text: requestedDay.day.condition.text,
                },
              },
            };
          }
        }

        return {
          city,
          location: {
            localtime: data.location.localtime,
            lat: data.location.lat,
            lon: data.location.lon,
            region: data.location.region,
          },
          current: {
            temp_c: data.current.temp_c,
            feelslike_c: data.current.feelslike_c,
            humidity: data.current.humidity,
            cloud: data.current.cloud,
            wind_kph: data.current.wind_kph,
            wind_dir: data.current.wind_dir,
            uv: data.current.uv,
            vis_km: data.current.vis_km,
            pressure_mb: data.current.pressure_mb,
            last_updated: data.current.last_updated,
            condition: {
              text: data.current.condition.text,
            },
          },
        };
      } catch (error) {
        console.error(`Error fetching weather for ${city}:`, error.message);
        return null;
      }
    });

    const results = await Promise.all(weatherPromises);
    const validResults = results.filter((result) => result !== null);

    // Calculate climate statistics on the backend
    const climateStats = {
      avgTemp:
        validResults.length > 0
          ? validResults.reduce(
              (sum, entry) => sum + (entry.current?.temp_c || 0),
              0
            ) / validResults.length
          : 29,
      avgHumidity:
        validResults.length > 0
          ? Math.round(
              validResults.reduce(
                (sum, entry) => sum + (entry.current?.humidity || 0),
                0
              ) / validResults.length
            )
          : 75,
      avgWind:
        validResults.length > 0
          ? validResults.reduce(
              (sum, entry) => sum + (entry.current?.wind_kph || 0),
              0
            ) / validResults.length
          : 12,
      minTemp:
        validResults.length > 0
          ? Math.min(...validResults.map((entry) => entry.current?.temp_c || 0))
          : 27,
      maxTemp:
        validResults.length > 0
          ? Math.max(...validResults.map((entry) => entry.current?.temp_c || 0))
          : 32,
      cityCount: validResults.length,
    };

    return NextResponse.json({
      currentDate,
      weather: validResults,
      climateStats,
    });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}
