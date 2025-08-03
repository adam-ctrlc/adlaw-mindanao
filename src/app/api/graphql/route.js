import { ApolloServer } from "@apollo/server";
import { NextResponse } from "next/server";
import { gql } from "graphql-tag";

const typeDefs = gql`
  type Query {
    weather(date: String): [WeatherEntry]
  }

  type WeatherEntry {
    city: String!
    location: Location!
    current: CurrentWeather!
  }

  type Location {
    localtime: String!
  }

  type CurrentWeather {
    temp_c: Float!
    feelslike_c: Float!
    humidity: Int!
    cloud: Int!
    wind_kph: Float!
    wind_dir: String!
    uv: Float!
    vis_km: Float!
    pressure_mb: Float!
    last_updated: String!
    condition: WeatherCondition!
  }

  type WeatherCondition {
    text: String!
  }
`;

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

const resolvers = {
  Query: {
    weather: async (_, { date }, context) => {
      const { request } = context;
      const forwarded = request.headers.get("x-forwarded-for");
      const ip = forwarded
        ? forwarded.split(",")[0]
        : request.headers.get("x-real-ip") || "127.0.0.1";

      if (isRateLimited(ip)) {
        throw new Error("RATE_LIMITED");
      }

      const apiKey = process.env.WEATHER_API_KEY;
      const allowedCities =
        process.env.MINDANAO_CITIES?.split(",").map((c) => c.trim()) || [];

      if (!apiKey) {
        throw new Error("Weather API key not configured");
      }

      if (allowedCities.length === 0) {
        throw new Error("No cities configured");
      }

      try {
        const weatherPromises = allowedCities.map(async (city) => {
          try {
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

            if (date) {
              const requestedDay = data.forecast.forecastday.find(
                (day) => day.date === date
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
                };
              }
            }

            return {
              city,
              location: data.location,
              current: data.current,
            };
          } catch (error) {
            console.error(`Error fetching weather for ${city}:`, error);
            return null;
          }
        });

        const results = await Promise.all(weatherPromises);
        const validResults = results.filter((result) => result !== null);

        return validResults;
      } catch (error) {
        console.error("Error fetching weather data:", error);
        throw new Error("Failed to fetch weather data");
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export async function POST(request) {
  try {
    const body = await request.json();

    const response = await server.executeOperation(
      {
        query: body.query,
        variables: body.variables,
      },
      {
        contextValue: { request },
      }
    );

    if (response.body.kind === "single") {
      return NextResponse.json(response.body.singleResult);
    }

    return NextResponse.json(
      { errors: ["Invalid operation"] },
      { status: 400 }
    );
  } catch (error) {
    console.error("GraphQL error:", error);
    return NextResponse.json({ errors: [error.message] }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "GraphQL endpoint - use POST to send queries",
  });
}
