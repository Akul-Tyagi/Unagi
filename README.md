# Unagi

Unagi is an AI-powered LinkedIn post generator using a fine-tuned Falcon3-7B model with LoRA adapters. It helps professionals craft compelling LinkedIn posts with customizable tone and length.

## Features

- **Custom Fine-Tuned AI**: Falcon3-7B model with LoRA adapters trained specifically for LinkedIn content
- **Multiple Tones**: Professional, Casual, Enthusiastic, Thoughtful, Inspirational
- **Adjustable Length**: Short, Medium, or Long posts
- **Real-Time Status**: Live API status indicator
- **Elegant UI**: Modern, responsive design with smooth animations
- **Authentication**: Secure login via Supabase (Email/Google)

## Quick Start

### 1. Start the AI Backend (Google Colab)

1. Open `colab/UNAGI_OPTIMIZED.py` in Google Colab
2. Run cells 1-4 in order
3. Copy the ngrok URL displayed

### 2. Update API URL

**Option A - Vercel Environment Variable (Recommended):**
- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Add: `NEXT_PUBLIC_COLAB_API_URL` = `https://xxxx.ngrok-free.app`
- Redeploy

**Option B - Direct Code Update:**
- Update `FALLBACK_API_URL` in `src/lib/api-config.ts`
- Commit and push to trigger deployment

### 3. Use the Website

Visit your deployed Unagi website and start generating posts!

## Local Development

```bash
# Install dependencies
npm install

# Create .env.local with your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_COLAB_API_URL=https://your-ngrok-url.ngrok-free.app

# Run development server
npm run dev
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (proxy to Colab)
│   │   ├── generate/      # POST generation endpoint
│   │   └── status/        # GET status endpoint
│   ├── auth/              # Auth callback routes
│   └── chat/              # Main chat interface
├── components/            # React components
│   ├── chat/              # Chat UI components
│   ├── landing/           # Landing page components
│   └── ui/                # Reusable UI components
├── contexts/              # React contexts (auth)
├── hooks/                 # Custom hooks
└── lib/                   # Utilities and configs
    ├── api-config.ts      # API URL configuration
    └── supabase/          # Supabase client setup
```

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **3D Graphics**: Three.js, React Three Fiber
- **Animations**: Framer Motion
- **Auth**: Supabase
- **AI Backend**: Google Colab, Falcon3-7B, LoRA, FastAPI, ngrok

## How It Works

1. User enters topic, tone, and length on the website
2. Request goes to Next.js API route (`/api/generate`)
3. Next.js proxies request to Colab via ngrok tunnel
4. Falcon3-7B generates the LinkedIn post
5. Response returns through the proxy to the user

## License

MIT License