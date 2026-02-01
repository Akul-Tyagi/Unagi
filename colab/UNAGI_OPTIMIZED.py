# ============================================================================
# UNAGI - AI-Powered LinkedIn Post Generator
# Optimized Google Colab Notebook (Consolidated Version)
# ============================================================================
# 
# INSTRUCTIONS:
# 1. Run Cell 1 (Setup) - Wait for completion
# 2. Run Cell 2 (Upload Model) - Upload your model.zip when prompted
# 3. Run Cell 3 (Load Model) - Wait for model to load (~2-3 min)
# 4. Run Cell 4 (Start Server) - Copy the ngrok URL displayed
# 5. Run Cell 5 (Keep-Alive) - Prevents Colab from timing out!
# 6. Update NEXT_PUBLIC_COLAB_API_URL in Vercel dashboard OR
#    update FALLBACK_API_URL in src/lib/api-config.ts
#
# That's it! Your Unagi website is now connected to the AI.
# The keep-alive will ping every 8 minutes to keep your session active.
# ============================================================================


# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  CELL 1: ENVIRONMENT SETUP (Run this first)                              ║
# ╚══════════════════════════════════════════════════════════════════════════╝

# Install all required packages
!pip install -q transformers==4.51.2 accelerate==1.6.0 peft==0.15.1 \
    bitsandbytes==0.45.5 torch==2.6.0 sentencepiece==0.2.0 \
    fastapi==0.115.12 uvicorn==0.34.2 pyngrok==7.2.9 \
    huggingface-hub==0.32.3 protobuf==6.31.1 nest_asyncio

import torch
import os
import gc
import time
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Check GPU
print("=" * 60)
print("🔧 ENVIRONMENT CHECK")
print("=" * 60)
print(f"✓ CUDA available: {torch.cuda.is_available()}")
if torch.cuda.is_available():
    print(f"✓ GPU: {torch.cuda.get_device_name(0)}")
    print(f"✓ GPU Memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.2f} GB")
    # Quick GPU test
    x = torch.ones(100, 100, device="cuda")
    del x
    torch.cuda.empty_cache()
    print("✓ GPU test passed!")
else:
    print("⚠️ No GPU - using CPU (slower inference)")

# Create model directory
os.makedirs("model_files", exist_ok=True)
print("\n✅ Setup complete! Proceed to Cell 2.")


# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  CELL 2: UPLOAD MODEL FILES                                              ║
# ╚══════════════════════════════════════════════════════════════════════════╝

from google.colab import files
import zipfile
import shutil
import glob
import json

def upload_and_prepare_model():
    """Upload and extract model files"""
    print("=" * 60)
    print("📁 MODEL UPLOAD")
    print("=" * 60)
    
    # Check if files already exist
    required = ["adapter_config.json", "tokenizer.json", "tokenizer_config.json"]
    existing = [f for f in required if os.path.exists(f"model_files/{f}")]
    safetensors = glob.glob("model_files/*.safetensors")
    
    if len(existing) >= 3 and safetensors:
        print("✓ Model files already present!")
        print(f"  Found: {existing + [os.path.basename(s) for s in safetensors]}")
        return True
    
    # Upload zip file
    print("\n📤 Please upload your model.zip file:")
    uploaded = files.upload()
    
    if not uploaded:
        print("❌ No file uploaded")
        return False
    
    filename = list(uploaded.keys())[0]
    
    # Extract
    print(f"📦 Extracting {filename}...")
    with zipfile.ZipFile(filename, 'r') as zip_ref:
        zip_ref.extractall("model_files")
    os.remove(filename)
    
    # Flatten directory structure if needed
    for subdir in [d for d in os.listdir("model_files") if os.path.isdir(f"model_files/{d}")]:
        for f in os.listdir(f"model_files/{subdir}"):
            src, dst = f"model_files/{subdir}/{f}", f"model_files/{f}"
            if not os.path.exists(dst):
                shutil.move(src, dst)
        shutil.rmtree(f"model_files/{subdir}", ignore_errors=True)
    
    # Create default config if missing
    if not os.path.exists("model_files/model_config.json"):
        with open("model_files/model_config.json", 'w') as f:
            json.dump({
                "base_model": "tiiuae/falcon3-7b-instruct",
                "lora_r": 16, "lora_alpha": 32, "lora_dropout": 0.05
            }, f)
    
    print("✅ Model files ready! Proceed to Cell 3.")
    return True

upload_and_prepare_model()


# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  CELL 3: LOAD MODEL                                                      ║
# ╚══════════════════════════════════════════════════════════════════════════╝

from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from peft import PeftModel

def load_model():
    """Load Falcon3-7B with LoRA adapter"""
    print("=" * 60)
    print("🤖 LOADING MODEL")
    print("=" * 60)
    
    gc.collect()
    if torch.cuda.is_available():
        torch.cuda.empty_cache()
    
    base_model_id = "tiiuae/falcon3-7b-instruct"
    
    # Load tokenizer
    print("Loading tokenizer...")
    try:
        tokenizer = AutoTokenizer.from_pretrained("model_files", use_fast=True)
    except:
        tokenizer = AutoTokenizer.from_pretrained(base_model_id)
    
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token
    print("✓ Tokenizer loaded")
    
    # Load model with 4-bit quantization
    print("Loading base model (4-bit quantization)...")
    start = time.time()
    
    quantization_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_compute_dtype=torch.bfloat16,
        bnb_4bit_use_double_quant=True,
        bnb_4bit_quant_type="nf4"
    )
    
    model = AutoModelForCausalLM.from_pretrained(
        base_model_id,
        device_map="auto",
        torch_dtype=torch.bfloat16,
        quantization_config=quantization_config
    )
    print(f"✓ Base model loaded ({time.time() - start:.1f}s)")
    
    # Load LoRA adapter
    print("Loading LoRA adapter...")
    start = time.time()
    model = PeftModel.from_pretrained(model, "model_files", torch_dtype=torch.bfloat16)
    model.eval()
    print(f"✓ LoRA adapter loaded ({time.time() - start:.1f}s)")
    
    # Memory info
    if torch.cuda.is_available():
        allocated = torch.cuda.memory_allocated() / 1e9
        total = torch.cuda.get_device_properties(0).total_memory / 1e9
        print(f"✓ GPU Memory: {allocated:.2f} / {total:.2f} GB ({allocated/total*100:.1f}%)")
    
    print("\n✅ Model loaded successfully! Proceed to Cell 4.")
    return model, tokenizer

model, tokenizer = load_model()


# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  CELL 4: START API SERVER                                                ║
# ╚══════════════════════════════════════════════════════════════════════════╝

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
import uvicorn
from pyngrok import ngrok, conf
import threading
import asyncio
import nest_asyncio
import re

nest_asyncio.apply()

# ─── Request/Response Models ─────────────────────────────────────────────────

class PostRequest(BaseModel):
    topic: str = Field(..., min_length=2, max_length=500)
    tone: str = Field("professional")
    length: str = Field("medium")
    email: str = Field(None)
    
    @field_validator('tone')
    def validate_tone(cls, v):
        valid = ["professional", "casual", "enthusiastic", "thoughtful", "inspirational"]
        return v.lower() if v.lower() in valid else "professional"
    
    @field_validator('length')
    def validate_length(cls, v):
        valid = ["short", "medium", "long"]
        return v.lower() if v.lower() in valid else "medium"

class PostResponse(BaseModel):
    generated_text: str
    processing_time: float

class StatusResponse(BaseModel):
    status: str
    queue_position: int = 0
    estimated_time: str = "immediate"

# ─── Generation Functions ────────────────────────────────────────────────────

def create_prompt(topic: str, tone: str, length: str) -> str:
    length_words = {"short": "100-150", "medium": "200-300", "long": "400-600"}
    tone_desc = {
        "professional": "formal, polished and authoritative",
        "casual": "conversational, approachable and friendly",
        "enthusiastic": "energetic, passionate and motivational",
        "thoughtful": "reflective, analytical and insightful",
        "inspirational": "uplifting, encouraging and motivational"
    }
    
    return f"""<|system|>
You are an AI assistant specializing in creating engaging LinkedIn posts. Write in a {tone} tone that is {tone_desc.get(tone, 'professional')}. Create content that is engaging, authentic, and valuable.

Requirements:
- Topic: {topic}
- Tone: {tone}
- Length: {length_words.get(length, '200-300')} words
- Use clear paragraph breaks
- Avoid generic intros like "Hey connections!"
<|user|>
Write a LinkedIn post about: {topic}
<|assistant|>
"""

async def generate_text(prompt: str, max_tokens: int = 600) -> str:
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    
    def _generate():
        with torch.no_grad():
            return model.generate(
                inputs.input_ids,
                max_new_tokens=max_tokens,
                do_sample=True,
                temperature=0.7,
                top_p=0.92,
                top_k=50,
                repetition_penalty=1.15,
                no_repeat_ngram_size=3,
                pad_token_id=tokenizer.pad_token_id,
                eos_token_id=tokenizer.eos_token_id,
            )
    
    loop = asyncio.get_event_loop()
    outputs = await asyncio.wait_for(
        loop.run_in_executor(None, _generate),
        timeout=90
    )
    
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

def clean_output(text: str, prompt: str) -> str:
    if prompt in text:
        text = text.replace(prompt, "")
    
    for pattern in [r"<\|system\|>.*?<\|user\|>", r"<\|assistant\|>", 
                    r"<\|user\|>.*?<\|assistant\|>", r"<\|endoftext\|>"]:
        text = re.sub(pattern, "", text, flags=re.DOTALL)
    
    return re.sub(r'\n{3,}', '\n\n', text).strip()

# ─── FastAPI App ─────────────────────────────────────────────────────────────

app = FastAPI(title="Unagi API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

generation_lock = asyncio.Semaphore(1)
request_count = 0
start_time = time.time()

@app.get("/")
def root():
    return {
        "service": "Unagi LinkedIn Post Generator",
        "status": "active",
        "uptime_minutes": round((time.time() - start_time) / 60, 2),
        "requests_processed": request_count
    }

@app.get("/status", response_model=StatusResponse)
def get_status():
    return StatusResponse(status="Active", queue_position=0, estimated_time="immediate")

@app.post("/generate", response_model=PostResponse)
async def generate_post(request: PostRequest):
    global request_count
    
    async with generation_lock:
        start = time.time()
        prompt = create_prompt(request.topic, request.tone, request.length)
        
        try:
            generated = await generate_text(prompt)
            cleaned = clean_output(generated, prompt)
            request_count += 1
            
            return PostResponse(
                generated_text=cleaned,
                processing_time=round(time.time() - start, 2)
            )
        except asyncio.TimeoutError:
            raise HTTPException(status_code=504, detail="Generation timed out")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

# ─── Start Server ────────────────────────────────────────────────────────────

def start_server():
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="warning")

def start_services():
    print("=" * 60)
    print("🚀 STARTING UNAGI SERVER")
    print("=" * 60)
    
    # Start FastAPI in background thread
    thread = threading.Thread(target=start_server, daemon=True)
    thread.start()
    time.sleep(3)
    print("✓ API server running on port 8000")
    
    # Configure and start ngrok
    NGROK_TOKEN = "2xo4I0POrb4cA5CFWCcTurWrbt8_iQf6jGXka3dVRdQ6F3VM"  # Your token
    conf.get_default().auth_token = NGROK_TOKEN
    
    # Check for existing tunnel
    tunnels = ngrok.get_tunnels()
    if tunnels:
        public_url = str(tunnels[0].public_url)
    else:
        public_url = str(ngrok.connect(8000))
    
    print("✓ Ngrok tunnel established")
    
    # Display the URL prominently
    print("\n" + "=" * 60)
    print("✅ UNAGI IS NOW LIVE!")
    print("=" * 60)
    print(f"\n🔗 YOUR API URL:\n")
    print(f"   {public_url}")
    print(f"\n" + "=" * 60)
    print("\n📋 NEXT STEPS:")
    print("   1. Copy the URL above")
    print("   2. Go to Vercel Dashboard → Settings → Environment Variables")
    print("   3. Add/Update: NEXT_PUBLIC_COLAB_API_URL = <your-url>")
    print("   4. Redeploy your site (or it will auto-update)")
    print("\n   OR update FALLBACK_API_URL in src/lib/api-config.ts")
    print("\n" + "=" * 60)
    print("\n📊 Endpoints:")
    print(f"   • Status:   {public_url}/status")
    print(f"   • Generate: {public_url}/generate")
    print("\n⚠️  Keep this notebook running while using Unagi!")
    print("=" * 60)
    
    return public_url

# Start everything!
PUBLIC_URL = start_services()


# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  OPTIONAL: TEST GENERATION LOCALLY                                       ║
# ╚══════════════════════════════════════════════════════════════════════════╝

# Uncomment and run this cell to test generation without using the website

"""
import requests

# Test the API locally
test_request = {
    "topic": "The importance of continuous learning in tech",
    "tone": "professional",
    "length": "medium"
}

response = requests.post(f"{PUBLIC_URL}/generate", json=test_request)
result = response.json()

print("Generated Post:")
print("-" * 40)
print(result.get("generated_text", "Error: " + str(result)))
print("-" * 40)
print(f"Processing time: {result.get('processing_time', 'N/A')} seconds")
"""


# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  CELL 5: KEEP-ALIVE (Run this to prevent Colab timeout)                  ║
# ╚══════════════════════════════════════════════════════════════════════════╝

import threading
import time
import random
from datetime import datetime
from IPython.display import display, HTML, clear_output

class KeepAlive:
    """
    Background keep-alive mechanism to prevent Colab from timing out.
    Runs lightweight operations periodically without affecting the model.
    """
    
    def __init__(self, interval_minutes=8):
        self.interval = interval_minutes * 60  # Convert to seconds
        self.running = False
        self.thread = None
        self.ping_count = 0
        self.start_time = None
        
    def _keep_alive_worker(self):
        """Background worker that performs lightweight operations"""
        while self.running:
            try:
                self.ping_count += 1
                current_time = datetime.now().strftime("%H:%M:%S")
                elapsed = (time.time() - self.start_time) / 60
                
                # Lightweight operations to keep the kernel active
                _ = sum(range(1000))  # Simple CPU operation
                _ = [random.random() for _ in range(100)]  # Memory operation
                
                # Optional: Quick GPU ping if available (very lightweight)
                if torch.cuda.is_available():
                    x = torch.ones(10, device="cuda")
                    del x
                
                # Print status update
                print(f"[{current_time}] 💚 Keep-alive ping #{self.ping_count} | "
                      f"Session active: {elapsed:.1f} min | "
                      f"Next ping in {self.interval // 60} min")
                
            except Exception as e:
                print(f"[Keep-alive] Minor error (safe to ignore): {e}")
            
            # Sleep in small intervals so we can stop quickly if needed
            for _ in range(self.interval):
                if not self.running:
                    break
                time.sleep(1)
    
    def start(self):
        """Start the keep-alive background thread"""
        if self.running:
            print("⚠️  Keep-alive is already running!")
            return
        
        self.running = True
        self.start_time = time.time()
        self.thread = threading.Thread(target=self._keep_alive_worker, daemon=True)
        self.thread.start()
        
        print("=" * 60)
        print("🔄 KEEP-ALIVE ACTIVATED")
        print("=" * 60)
        print(f"✓ Pinging every {self.interval // 60} minutes")
        print("✓ Your Colab session will stay active!")
        print("✓ This runs in the background - you can use Unagi normally")
        print("\n💡 To stop: run  keep_alive.stop()")
        print("=" * 60)
    
    def stop(self):
        """Stop the keep-alive background thread"""
        if not self.running:
            print("⚠️  Keep-alive is not running")
            return
        
        self.running = False
        if self.thread:
            self.thread.join(timeout=5)
        
        elapsed = (time.time() - self.start_time) / 60
        print("=" * 60)
        print("⏹️  KEEP-ALIVE STOPPED")
        print("=" * 60)
        print(f"✓ Total pings: {self.ping_count}")
        print(f"✓ Session was active for: {elapsed:.1f} minutes")
        print("=" * 60)
    
    def status(self):
        """Check keep-alive status"""
        if self.running:
            elapsed = (time.time() - self.start_time) / 60
            print(f"✓ Keep-alive is ACTIVE | Pings: {self.ping_count} | "
                  f"Running for: {elapsed:.1f} min")
        else:
            print("✗ Keep-alive is NOT running")

# Create and start the keep-alive instance
keep_alive = KeepAlive(interval_minutes=8)
keep_alive.start()

# ─── Manual Controls (run these in separate cells if needed) ─────────────────
# keep_alive.stop()    # Stop the keep-alive
# keep_alive.status()  # Check current status
# keep_alive.start()   # Restart if stopped
