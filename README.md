<div align="center">

# 🍣 Unagi

### AI-Powered LinkedIn Content Generation Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Falcon3](https://img.shields.io/badge/Falcon3--7B--Instruct-QLoRA-orange?style=for-the-badge)](https://huggingface.co/tiiuae/falcon3-7b-instruct)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)

*Generate professional, high-engagement LinkedIn posts with a fine-tuned Falcon3-7B-Instruct model*

[Live Demo](https://unagico.vercel.app/) • [Dataset](https://huggingface.co/datasets/Akul-Tyagi/LinkedOut-Dataset)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Quick Start](#-quick-start)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [How It Works](#-how-it-works)
- [Model Details](#-model-details)
- [Frontend Features](#-frontend-features)
- [API Endpoints](#-api-endpoints)
- [Getting Started](#-getting-started)
- [Google Colab Setup](#-google-colab-setup)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Unagi** is a full-stack AI-powered platform that generates professional LinkedIn posts using a custom fine-tuned **Falcon3-7B-Instruct** language model. The platform combines a sleek Next.js frontend with a FastAPI backend running on Google Colab, delivering an AI chat experience similar to commercial AI tools.

### Key Highlights

- 🧠 **Custom Fine-tuned Model**: Falcon3-7B-Instruct trained on 1,200+ high-engagement LinkedIn posts
- ⚡ **Optimized Inference**: QLoRA + 4-bit quantization for 35% lower latency on T4 GPUs
- 🎨 **Premium UI/UX**: Minimalist luxury design with 3D animations and smooth interactions
- 🔐 **Secure Authentication**: Supabase-powered auth with Google OAuth support

---

## 🚀 Quick Start

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

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              UNAGI ARCHITECTURE                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐     ┌──────────────────┐     ┌────────────────────────────────────┐
│              │     │                  │     │        GOOGLE COLAB (T4 GPU)       │
│   BROWSER    │────▶│  NEXT.JS FRONTEND │────▶│ ┌────────────────────────────────┐ │
│              │     │  (Vercel)        │     │ │     FastAPI Server (uvicorn)   │ │
│  - Auth UI   │◀────│  - API Routes    │◀────│ │                                │ │
│  - Chat UI   │     │  - Supabase SSR  │     │ │  ┌──────────────────────────┐  │ │
│  - 3D Model  │     │                  │     │ │  │  Falcon3-7B-Instruct     │  │ │
└──────────────┘     └─────────────────┘      │ │  │  + QLoRA Adapter         │  │ │
                                              │ │  │  (4-bit Quantized)       │  │ │
                                              │ │  └──────────────────────────┘  │ │
                                              │ │                                │ │
                                              │ │  POST /generate                │ │
                                              │ │  GET  /status                  │ │
                                              │ └────────────────────────────────┘ │
                                              │                │                   │
                                              │       ┌────────▼────────┐          │
                                              │       │   ngrok tunnel  │          │
                                              │       │  (public URL)   │          │
                                              │       └─────────────────┘          │
                                              └────────────────────────────────────┘
```

### Data Flow

1. **User Authentication**: User signs in via Supabase (Email/Password or Google OAuth)
2. **Post Generation Request**: Frontend sends topic, tone, and length to `/api/generate`
3. **API Proxy**: Next.js API route forwards request to Colab via ngrok URL
4. **Model Inference**: Colab-hosted FastAPI → Falcon3 generates post
5. **Response Delivery**: Generated post returned with typing animation effect

---

## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.5 | React framework with App Router |
| **TypeScript** | 5.5 | Type-safe JavaScript |
| **Tailwind CSS** | 3.4 | Utility-first styling |
| **Framer Motion** | 12.x | Animations & transitions |
| **Three.js** | 0.176 | 3D crystal model on landing page |
| **Supabase** | 2.49 | Authentication & user management |

### Backend (Google Colab)

| Technology | Version | Purpose |
|------------|---------|---------|
| **FastAPI** | 0.115 | High-performance API framework |
| **uvicorn** | 0.34 | ASGI server |
| **PyTorch** | 2.6 | Deep learning framework |
| **Transformers** | 4.51 | Hugging Face model loading |
| **PEFT** | 0.15 | LoRA adapter support |
| **bitsandbytes** | 0.45 | 4-bit quantization |
| **pyngrok** | 7.2 | Secure tunneling |

### Infrastructure

| Service | Purpose |
|---------|---------|
| **Vercel** | Frontend hosting & deployment |
| **Google Colab** | GPU inference (T4) |
| **Supabase** | Auth, database (if needed) |
| **ngrok** | Secure tunnel to Colab runtime |

---

## ⚙️ How It Works

### Step-by-Step

1. **Start Colab Notebook**: Run the notebook to load the model and start FastAPI server
2. **ngrok Tunnel Created**: Automatic tunnel creation exposes localhost:8000
3. **Update Frontend**: Set the ngrok URL in Vercel environment variables
4. **Generate Posts**: Users interact with chat interface, requests routed through tunnel

---

## 🧠 Model Details

### Base Model

**[tiiuae/falcon3-7b-instruct](https://huggingface.co/tiiuae/falcon3-7b-instruct)**

A 7-billion parameter instruction-tuned model from Technology Innovation Institute (TII), optimized for:
- Instruction following
- Professional content generation
- Context-aware responses

### Fine-Tuning Configuration

| Parameter | Value |
|-----------|-------|
| **Method** | QLoRA (Quantized Low-Rank Adaptation) |
| **Quantization** | 4-bit (NF4 with double quantization) |
| **LoRA Rank (r)** | 16 |
| **LoRA Alpha** | 32 |
| **LoRA Dropout** | 0.05 |
| **Training Examples** | 1,200+ high-engagement posts |
| **Compute Type** | bfloat16 |

### Training Dataset

**[LinkedOut-Dataset](https://huggingface.co/datasets/Akul-Tyagi/LinkedOut-Dataset)**

Custom-curated dataset of high-engagement LinkedIn posts featuring:
- Professional thought leadership content
- Industry-specific insights
- Engagement-optimized formatting
- Diverse tones (professional, casual, inspirational, etc.)

### Inference Optimization

```python
quantization_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.bfloat16,
    bnb_4bit_use_double_quant=True,
    bnb_4bit_quant_type="nf4"
)
```

**Results**: 35% latency reduction on NVIDIA T4 GPU while maintaining generation quality.

### Generation Parameters

```python
model.generate(
    max_new_tokens=600,
    do_sample=True,
    temperature=0.7,
    top_p=0.92,
    top_k=50,
    repetition_penalty=1.15,
    no_repeat_ngram_size=3
)
```

---

## 🎨 Frontend Features

### Landing Page
- **3D Crystal Model**: Interactive Three.js scene with floating animation
- **Smooth Cursor**: Custom cursor effects with Framer Motion
- **Scroll Progress**: Visual progress indicator
- **Spinning Text**: Dynamic typography animation

### Authentication
- **Email/Password**: Secure sign-up with email confirmation
- **Google OAuth**: One-click sign-in with Google
- **Protected Routes**: Middleware-based route protection
- **Session Management**: Automatic session refresh

### Chat Interface
- **Real-time Generation**: Live status updates during inference
- **Typing Animation**: Character-by-character text reveal
- **Tone Selection**: Professional, Casual, Enthusiastic, Thoughtful, Inspirational
- **Length Control**: Short, Medium, Long post options
- **Copy to Clipboard**: One-click copy with visual feedback
- **Status Indicator**: API availability monitoring

### UI Components
- **Custom Dropdowns**: Animated select components
- **Loading States**: Elegant spinners and skeletons
- **Message Bubbles**: Chat-style response display
- **Responsive Design**: Mobile-first approach

---

## 📡 API Endpoints

### FastAPI Backend (Colab)

#### `GET /`
Root endpoint with service information.

**Response:**
```json
{
    "service": "Unagi LinkedIn Post Generator",
    "status": "active",
    "uptime_minutes": 45.5,
    "requests_processed": 127
}
```

#### `GET /status`
Check service availability and queue status.

**Response:**
```json
{
    "status": "Active",
    "queue_position": 0,
    "estimated_time": "immediate"
}
```

#### `POST /generate`
Generate a LinkedIn post.

**Request:**
```json
{
    "topic": "The future of remote work",
    "tone": "professional",
    "length": "medium",
    "email": "optional@example.com"
}
```

**Response:**
```json
{
    "generated_text": "Remote work isn't just a trend...",
    "processing_time": 3.45
}
```

### Next.js API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/generate` | POST | Proxy to Colab FastAPI |
| `/api/status` | GET | Proxy status check |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Google Colab (with GPU runtime)
- ngrok account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Akul-Tyagi/Unagi.git
   cd Unagi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local with your credentials
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   NEXT_PUBLIC_COLAB_API_URL=https://your-ngrok-url.ngrok-free.app
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

---

## 📓 Google Colab Setup

### 1. Environment Setup

Run the first cell to install all dependencies:

```python
!pip install transformers==4.51.2 accelerate==1.6.0 peft==0.15.1 \
    bitsandbytes==0.45.5 torch==2.6.0 sentencepiece==0.2.0 \
    fastapi==0.115.12 uvicorn==0.34.2 pyngrok==7.2.9 huggingface-hub==0.32.3 \
    protobuf==6.31.1 nest_asyncio
```

### 2. Upload Model Files

Upload your fine-tuned model as a zip containing:
- `adapter_config.json`
- `adapter_model.safetensors`
- `special_tokens_map.json`
- `tokenizer_config.json`
- `tokenizer.json`
- `model_config.json`

### 3. Load the Model

```python
model, tokenizer = load_model(use_4bit=True)
```

### 4. Start Services

```python
PUBLIC_URL = start_services()
```

This will:
- Start FastAPI server on port 8000
- Create ngrok tunnel
- Display the public URL to use

### 5. Keep Alive

Keep the notebook running to serve requests. The API will be available at the ngrok URL displayed.

---

## 📁 Project Structure

```
Unagi/
├── colab/
│   └── UNAGI_OPTIMIZED.py     # Consolidated Colab notebook
│
├── public/
│   ├── fonts/                 # Custom Unagi fonts
│   └── models/                # 3D GLB models
│
├── src/
│   ├── app/
│   │   ├── [[...index]]/      # Landing page
│   │   ├── api/
│   │   │   ├── generate/      # POST - Forward to Colab
│   │   │   └── status/        # GET - Service status
│   │   ├── auth/
│   │   │   ├── callback/      # OAuth callback handler
│   │   │   └── auth-code-error/
│   │   ├── chat/              # Main chat interface
│   │   ├── globals.css
│   │   └── layout.tsx
│   │
│   ├── components/
│   │   ├── chat/
│   │   │   ├── chat-interface.tsx
│   │   │   ├── message-bubble.tsx
│   │   │   └── status-indicator.tsx
│   │   ├── icons/
│   │   ├── landing/
│   │   │   ├── about-section.tsx
│   │   │   ├── authwrapper.tsx
│   │   │   ├── three-model.tsx
│   │   │   └── video-section.tsx
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── custom-dropdown.tsx
│   │       ├── loading.tsx
│   │       ├── smooth-cursor.tsx
│   │       ├── spinning-text.tsx
│   │       └── typing-animation.tsx
│   │
│   ├── contexts/
│   │   └── auth-context.tsx   # Supabase auth provider
│   │
│   ├── hooks/
│   │   └── use-queue-status.ts
│   │
│   └── lib/
│       ├── api-config.ts      # API URL configuration
│       ├── supabase/
│       │   ├── client.ts
│       │   └── server.ts
│       ├── three-setup.ts
│       └── utils.ts
│
├── middleware.ts              # Route protection
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Update documentation for new features
- Test your changes thoroughly

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Akul Tyagi**

- GitHub: [@Akul-Tyagi](https://github.com/Akul-Tyagi)
- LinkedIn: [Connect](https://linkedin.com/in/akul-tyagi)

---

## 🙏 Acknowledgments

- [Hugging Face](https://huggingface.co/) for the Transformers library
- [TII](https://www.tii.ae/) for the Falcon3 model
- [Vercel](https://vercel.com/) for hosting
- [Supabase](https://supabase.com/) for authentication
- [ngrok](https://ngrok.com/) for tunneling

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

*Built with ❤️ and lots of ☕*

</div>
