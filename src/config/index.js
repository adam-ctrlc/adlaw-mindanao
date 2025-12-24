export const config = {
  weatherApiKey: process.env.WEATHER_API_KEY,
  weatherApiBaseUrl: "https://api.weatherapi.com/v1",
  mindanaoCities: process.env.MINDANAO_CITIES?.split(",").map((c) => c.trim()) || [],
};
