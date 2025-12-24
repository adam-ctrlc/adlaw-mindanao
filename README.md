# Atmosphere - Mindanao Weather

A modern, real-time weather application for Mindanao cities built with Next.js 15. Features a sleek dark theme with glass morphism effects, interactive weather radar, and comprehensive climate insights.

## Features

- **Real-time weather data** for multiple Mindanao cities (sorted A-Z)
- **Interactive weather radar** with layer selection (Rain, Wind, Clouds)
- **Climate overview** with aggregated regional statistics
- **Unit toggle** - Switch between Metric (°C, km/h) and Imperial (°F, mph) with a sleek toggle button in the header
- **Auto-cycling hero panel** showcasing different cities every 10 seconds
- **Live search** - Filter cities in real-time
- **Responsive design** - Optimized for all devices (mobile, tablet, desktop)
- **Rate limiting protection** - Prevents API abuse

## Tech Stack

- **Framework**: Next.js 15 (App Router with Turbopack)
- **Styling**: Tailwind CSS 4
- **Icons**: Material Symbols
- **Fonts**: Space Grotesk (Display), Noto Sans (Body)
- **API**: WeatherAPI.com
- **State Management**: React Context (UnitContext)

## Getting Started

### Prerequisites

- Node.js 18+
- WeatherAPI.com API key (free tier available)

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/adam-ctrlc/adlaw-mindanao.git
   cd adlaw-mindanao
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up environment variables

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your configuration:

   ```env
   WEATHER_API_KEY=your_weatherapi_key_here
   MINDANAO_CITIES=Butuan,Cagayan de Oro,Cotabato,Davao,General Santos,Zamboanga
   ```

4. Run the development server

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── weather/
│   │       └── route.js          # REST API endpoint
│   ├── globals.css               # Global styles & Tailwind theme
│   ├── layout.jsx                # Root layout with fonts
│   └── page.jsx                  # Main weather page
├── components/
│   ├── index.js                  # Barrel exports
│   ├── layout/
│   │   ├── index.js
│   │   └── Header.jsx            # Navigation header + unit toggle
│   ├── hero/
│   │   ├── index.js
│   │   ├── HeroWeatherPanel.jsx  # Featured city weather card
│   │   └── SearchBar.jsx         # City search input
│   └── weather/
│       ├── index.js
│       ├── WeatherCard.jsx       # Individual city weather card
│       ├── WeatherRadar.jsx      # Interactive radar map
│       └── ClimateOverview.jsx   # Regional climate stats
├── config/
│   └── index.js                  # App configuration
├── context/
│   └── UnitContext.jsx           # Unit system state (metric/imperial)
├── hooks/
│   └── useWeather.js             # Weather data fetching hook
└── lib/
    └── utils.js                  # Utility functions (conversions, etc.)
```

## API Endpoints

### GET /api/weather

Fetches weather data for all configured Mindanao cities (sorted alphabetically).

**Query Parameters:**

- `date` (optional): Specific date for forecast data (YYYY-MM-DD)

**Response:**

```json
{
  "currentDate": "2024-12-25",
  "weather": [
    {
      "city": "Davao",
      "location": {
        "lat": 7.07,
        "lon": 125.6,
        "region": "Davao Region"
      },
      "current": {
        "temp_c": 29,
        "humidity": 75,
        "wind_kph": 12,
        "condition": {
          "text": "Partly Cloudy"
        }
      }
    }
  ],
  "climateStats": {
    "avgTemp": 28.5,
    "avgHumidity": 78,
    "avgWind": 11,
    "minTemp": 26,
    "maxTemp": 31,
    "cityCount": 6
  }
}
```

## Configuration

### Environment Variables

| Variable          | Description                    | Required |
| ----------------- | ------------------------------ | -------- |
| `WEATHER_API_KEY` | Your WeatherAPI.com API key    | Yes      |
| `MINDANAO_CITIES` | Comma-separated list of cities | Yes      |

### Rate Limiting

- **Limit**: 100 requests per minute per IP
- **Window**: 60 seconds
- **Response**: 429 status code when exceeded

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms

1. Run `npm run build`
2. Deploy the `.next` folder
3. Set environment variables
4. Start with `npm start`

## License

This project is licensed under the MIT License.
