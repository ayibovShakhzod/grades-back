# Grades Telegram Bot API

A NestJS application with Telegram bot integration that provides REST API endpoints for sending messages and managing bot interactions.

## Features

- 🤖 Telegram bot integration with command handling
- 📚 Swagger API documentation
- 🔍 Health check endpoint
- ✅ Input validation with DTOs
- 🚦 Global exception handling
- 🌐 CORS enabled

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure your Telegram bot token in `.env` file or use the default one for testing:

   ```env
   BOT_TOKEN=your_actual_bot_token_here
   ```

3. Start the application:

   ```bash
   npm run start:dev
   ```

The application will be available at `http://localhost:3000`

## API Documentation

Once the application is running, you can access the interactive Swagger documentation at:

**📚 [http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

The Swagger UI provides:
- Interactive API testing
- Request/response examples
- Schema definitions
- Error response documentation

## API Endpoints

### Health Check
- **GET** `/api/health` - Returns application health status

### Bot Operations
- **POST** `/api/bot/send` - Send a message via Telegram bot

## Usage Examples

### Send Message via Bot
Send a POST request to `/api/bot/send` with the following JSON body:

```json
{
  "chatId": 123456789,
  "message": "Hello from the bot!"
}
```

### cURL Examples

Send a message via the bot:
```bash
curl -X POST http://localhost:3000/api/bot/send \
  -H "Content-Type: application/json" \
  -d '{"chatId": 123456789, "message": "Hello from API!"}'
```

Check application health:
```bash
curl http://localhost:3000/api/health
```

## Getting Chat ID

To find your chat ID:

1. Start a conversation with your bot
2. Send a message to your bot
3. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Look for the `chat.id` field in the response

## Bot Commands

The bot supports the following commands:

- `/start` - Start the bot and get welcome message
- `/help` - Show available commands
- `/info` - Get bot information
- `/ping` - Test bot responsiveness

## Development

### Available Scripts

- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run build` - Build the application
- `npm run lint` - Run ESLint

### Technologies Used

- **NestJS** - Progressive Node.js framework
- **Telegraf** - Telegram bot framework
- **Swagger** - API documentation
- **class-validator** - Validation decorators
- **TypeScript** - Type-safe JavaScript
