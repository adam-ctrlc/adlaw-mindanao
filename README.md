# Weather Mindanao 🌦️

**Bai, Init Ba Karon? Tan-awa Ang Panahon**

A real-time weather application for Mindanao cities with a touch of Bisaya humor. Built with Next.js and GraphQL, this app provides weather updates with local flavor and personality.

## Features

- 🌡️ **Real-time weather data** for multiple Mindanao cities
- 📅 **14-day forecast** with date selection
- 🔍 **City search** functionality
- 🎭 **Bisaya weather commentary** with personality
- 📱 **Responsive design** for all devices
- ⚡ **GraphQL API** for efficient data fetching
- 🛡️ **Rate limiting** protection
- 🎨 **Modern UI** with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: GraphQL (Apollo Server), Next.js API Routes
- **Data**: WeatherAPI.com
- **Icons**: Lucide React
- **Fonts**: Geist Sans & Mono

## Getting Started

### Prerequisites

- Node.js 18+
- WeatherAPI.com API key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/adam-ctrlc/adlaw-mindanao.git
   cd weather-mindanao
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your configuration:

   ```env
   WEATHER_API_KEY=your_weatherapi_key_here
   MINDANAO_CITIES=Davao,Cagayan de Oro,Butuan,General Santos,Zamboanga,Cotabato
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Documentation

### GraphQL Endpoint

The app uses GraphQL at `/api/graphql` with the following schema:

```graphql
type Query {
  weather(date: String): [WeatherEntry]
}

type WeatherEntry {
  city: String!
  location: Location!
  current: CurrentWeather!
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
```

### Example Query

```graphql
query GetWeatherData($date: String) {
  weather(date: $date) {
    city
    current {
      temp_c
      humidity
      condition {
        text
      }
    }
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
- **Response**: 429 status with retry-after header

## Development

### Project Structure

```
src/
├── app/
│   ├── api/graphql/     # GraphQL API endpoint
│   ├── globals.css      # Global styles
│   ├── layout.jsx       # Root layout
│   └── page.jsx         # Main weather page
├── components/
│   └── apollo-provider.jsx  # GraphQL client wrapper
└── lib/
    ├── apollo-client.js     # Apollo Client config
    └── queries.js           # GraphQL queries
```

### Scripts

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

## Weather Commentary

The app features humorous Bisaya weather commentary based on conditions:

- ☀️ **Sunny**: "Nindot ang panahon karon, sige laag!"
- 🌧️ **Rainy**: "Mo-ulan karon. Pero dayon japun ang klase hahay."
- 🌡️ **Hot**: "Init kaayo karon! Ayaw kalimot ug payong ha!"
- ⛈️ **Storm**: "Bawal laag! May bagyo! Puydi ka ma-unay!"

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please open an issue on GitHub.

---

**Disclaimer**: Weather data provided by WeatherAPI.com. Bisaya commentary provided by local humor. 😄
