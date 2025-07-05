# HydraChat 🐉✨

> Your intelligent AI companion powered by DeepSeek R1. Experience natural conversations with advanced voice integration and seamless chat management.

## 🌟 Features

### 🤖 **Intelligent Conversations**
- Powered by **DeepSeek R1**, one of the most advanced AI models available
- Natural language processing with context-aware responses
- Real-time chat with optimized performance and minimal latency

### 🎤 **Voice Integration**
- **Speech-to-Text**: Speak naturally and get instant text conversion
- **Text-to-Speech**: Listen to AI responses with natural voice synthesis
- **Smart Audio Controls**: Toggle voice responses on/off with intelligent audio management
- **Voice Recognition**: Seamless voice input with browser-based speech recognition

### 🔐 **Security & Authentication**
- **User Authentication**: Secure login/signup with Supabase Auth
- **Encrypted Conversations**: All messages are encrypted and stored securely
- **Protected Routes**: Automatic redirection for authenticated users
- **Session Management**: Persistent login sessions with automatic token refresh

### 💬 **Multi-Chat Support**
- **Organized Conversations**: Create and manage multiple chat sessions
- **Chat History**: Access your complete conversation history
- **Smart Titles**: Automatic chat title generation based on conversation content
- **Search & Filter**: Find specific conversations quickly with search functionality

### 💳 **Subscription Management**
- **Stripe Integration**: Secure payment processing for premium features
- **Subscription Tiers**: Different plans with varying message limits
- **Usage Tracking**: Monitor daily message usage and limits
- **Customer Portal**: Manage subscriptions and billing information

### 🎨 **Modern UI/UX**
- **Responsive Design**: Beautiful interface that works on all devices
- **Dark/Light Themes**: Customizable appearance with theme switching
- **Smooth Animations**: Polished interactions and transitions
- **Accessibility**: Built with accessibility best practices

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **bun** package manager
- **Supabase** account and project
- **OpenRouter API** key for DeepSeek R1 access
- **Stripe** account for payment processing

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/hydrachat-vivacious-ai-friend.git
   cd hydrachat-vivacious-ai-friend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Supabase Configuration**
   
   Set up your Supabase project with the following environment variables:
   ```env
   OPENROUTER_API_KEY=your_openrouter_api_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```

5. **Database Setup**
   
   Run the migration to create the required tables:
   ```bash
   supabase db push
   ```

6. **Start the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

7. **Open your browser**
   
   Navigate to `http://localhost:5173` to see the application.

## 🏗️ Project Structure

```
hydrachat-vivacious-ai-friend/
├── src/
│   ├── components/          # React components
│   │   ├── ChatInterface.tsx    # Main chat interface
│   │   └── ui/              # Shadcn/ui components
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.tsx      # Authentication hook
│   │   └── use-mobile.tsx   # Mobile detection hook
│   ├── integrations/        # External service integrations
│   │   └── supabase/        # Supabase client and types
│   ├── pages/               # Page components
│   │   ├── Home.tsx         # Landing page
│   │   ├── Index.tsx        # Chat page
│   │   ├── Auth.tsx         # Authentication page
│   │   └── ...
│   └── lib/                 # Utility functions
├── supabase/
│   ├── functions/           # Edge functions
│   │   ├── chat-deepseek/   # AI chat processing
│   │   ├── check-subscription/  # Subscription status
│   │   ├── create-checkout/     # Stripe checkout
│   │   └── customer-portal/     # Subscription management
│   └── migrations/          # Database migrations
└── public/                  # Static assets
```

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Enable Authentication with email/password
3. Set up Row Level Security (RLS) policies
4. Configure Edge Functions for AI processing

### Stripe Integration

1. Create a Stripe account and get API keys
2. Set up webhook endpoints for subscription events
3. Configure products and pricing plans
4. Update environment variables with Stripe keys

### OpenRouter API

1. Sign up for OpenRouter API access
2. Get your API key for DeepSeek R1 model access
3. Configure the API key in Supabase environment variables

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build for development
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Database
supabase db push     # Push migrations to database
supabase db reset    # Reset database
supabase functions deploy  # Deploy edge functions
```

### Code Style

This project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Tailwind CSS** for styling

### Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Supabase Deployment

1. Deploy edge functions:
   ```bash
   supabase functions deploy
   ```

2. Push database migrations:
   ```bash
   supabase db push
   ```

### Environment Variables

Make sure to set these environment variables in your deployment platform:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENROUTER_API_KEY=your_openrouter_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and conventions
- Add TypeScript types for new features
- Include proper error handling
- Write meaningful commit messages
- Test your changes thoroughly

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **DeepSeek** for providing the R1 AI model
- **OpenRouter** for AI model access
- **Supabase** for backend infrastructure
- **Stripe** for payment processing
- **Shadcn/ui** for beautiful UI components
- **Vite** for fast development experience

   **Made with ❤️ by the Ayush Kumar**
