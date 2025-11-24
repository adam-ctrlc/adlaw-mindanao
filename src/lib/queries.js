import { gql } from "@apollo/client";

export const GET_WEATHER_DATA = gql`
  query GetWeatherData($date: String) {
    currentDate
    weather(date: $date) {
      city
      location {
        localtime
      }
      current {
        temp_c
        feelslike_c
        humidity
        cloud
        wind_kph
        wind_dir
        uv
        vis_km
        pressure_mb
        last_updated
        condition {
          text
        }
      }
    }
  }
`;
