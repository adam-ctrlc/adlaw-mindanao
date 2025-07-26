import { NextResponse } from "next/server";

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
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded
    ? forwarded.split(",")[0]
    : request.headers.get("x-real-ip") || "127.0.0.1";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        error: "Too many requests. Please try again later.",
        errorType: "RATE_LIMITED",
        message: "hinay_hinay_bai",
      },
      {
        status: 429,
        headers: {
          "Retry-After": "60",
        },
      }
    );
  }

  const { searchParams } = new URL(request.url);
  const selectedDate = searchParams.get("date");

  const apiKey = process.env.WEATHER_API_KEY;
  const allowedCities =
    process.env.MINDANAO_CITIES?.split(",").map((c) => c.trim()) || [];

  if (!apiKey) {
    return NextResponse.json(
      { error: "Weather API key not configured" },
      { status: 500 }
    );
  }

  if (allowedCities.length === 0) {
    return NextResponse.json(
      { error: "No cities configured" },
      { status: 500 }
    );
  }

  try {
    const weatherPromises = allowedCities.map(async (city) => {
      try {
        // Get forecast for 14 days
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(
            city
          )}&days=14&aqi=no&alerts=no`
        );

        if (!response.ok) {
          throw new Error(
            `Weather API responded with status: ${response.status}`
          );
        }

        const data = await response.json();

        // If a specific date is requested, filter to that date
        if (selectedDate) {
          const requestedDay = data.forecast.forecastday.find(
            (day) => day.date === selectedDate
          );

          if (requestedDay) {
            return {
              city,
              location: data.location,
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
                condition: requestedDay.day.condition,
              },
              forecast: data.forecast,
            };
          }
        }

        // Return current weather + full forecast
        return {
          city,
          location: data.location,
          current: data.current,
          forecast: data.forecast,
        };
      } catch (error) {
        console.error(`Error fetching weather for ${city}:`, error);
        return null;
      }
    });

    const results = await Promise.all(weatherPromises);
    const validResults = results.filter((result) => result !== null);

    return NextResponse.json(validResults);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}
