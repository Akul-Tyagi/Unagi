'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/button';
import StatusIndicator from '@/components/chat/status-indicator';
import { useQueueStatus } from '@/hooks/use-queue-status';
import CustomDropdown from '@/components/ui/custom-dropdown';
import Loading from '@/components/ui/loading';
import { TypingAnimation } from '@/components/ui/typing-animation';
import { ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

interface ChatInterfaceProps {
  user: string | null;
}
interface PostGenerationResult {
  generated_text?: string;
  processing_time?: number;
  error?: string;
}

const toneOptions = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'enthusiastic', label: 'Enthusiastic' },
  { value: 'thoughtful', label: 'Thoughtful' },
  { value: 'inspirational', label: 'Inspirational' },
];

const lengthOptions = [
  { value: 'short', label: 'Short' },
  { value: 'medium', label: 'Medium' },
  { value: 'long', label: 'Long' },
];

export default function ChatInterface({ user }: ChatInterfaceProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PostGenerationResult | null>(null);
  const [selectedTone, setSelectedTone] = useState('professional');
  const [selectedLength, setSelectedLength] = useState('medium');
  const [showTyping, setShowTyping] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const queueStatus = useQueueStatus();
  
  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "❄️Good Morning";
    if (hour < 18) return "❄️Good Afternoon";
    return "❄️Good Evening";
  };

  // Check if current time is within active hours (Sunday 9 AM - 1 PM)
  const isActiveTime = () => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday
    const hour = now.getHours();
    
    return day === 0 && hour >= 9 && hour < 13;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setIsLoading(true);
    setResult(null);
    setShowTyping(false);
    setIsCopied(false);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: message,
          tone: selectedTone,
          length: selectedLength,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Stop loading and start typing animation
      setIsLoading(false);
      setResult({
        generated_text: data.generated_text,
        processing_time: data.processing_time,
      });
      setShowTyping(true);
      
    } catch (error) {
      console.error('Failed to generate post:', error);
      setIsLoading(false);
      setResult({ error: error instanceof Error ? error.message : 'Unknown error' });
      setShowTyping(true);
    }
  };

  const handleCopy = async () => {
    if (result?.generated_text) {
      try {
        await navigator.clipboard.writeText(result.generated_text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    }
  };

  // Auto-resize textarea as user types
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${Math.min(textAreaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  // Smooth scroll to bottom when content changes
  useEffect(() => {
    if (containerRef.current && (isLoading || showTyping)) {
      const scrollToBottom = () => {
        containerRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'end' 
        });
      };
      
      // Small delay to ensure content is rendered
      setTimeout(scrollToBottom, 100);
    }
  }, [isLoading, showTyping, result]);

  return (
    <div ref={containerRef} className="w-full max-w-3xl flex flex-col items-center justify-center space-y-4 min-h-screen">
      <span className='font-unagi text-7xl'>Unagi</span>
      {/* Status indicator */}
      <StatusIndicator/>

      {/* Greeting */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="text-3xl text-accent font-unagii">
          {getGreeting()}
        </div>
      </motion.div>
      
      <div className='text-center'>
       <span className='font-unagiii'>Post Like a Pro, Even If You're a Rookie</span>
      </div>

      {/* Loading Animation - appears between tagline and input */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center space-y-3"
          >
            <Loading />
            <motion.p 
              className="text-dark/70 text-sm font-unagiii"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Crafting your perfect LinkedIn post...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generated Post Result with Typing Animation */}
      <AnimatePresence>
        {showTyping && result && !isLoading && (
          <motion.div 
            className="w-full max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-accent/10 relative">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg text-accent font-unagii">Generated LinkedIn Post</h3>
                {result.processing_time && (
                  <span className="text-xs text-dark/60 font-unagiii">
                    Generated in {result.processing_time.toFixed(1)}s
                  </span>
                )}
              </div>
              
              {result.error ? (
                <motion.div 
                  className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="font-medium">Error generating post</p>
                  <p className="text-sm mt-1">{result.error}</p>
                </motion.div>
              ) : (
                <div className="relative">
                  <TypingAnimation
                    className="whitespace-pre-wrap font-light leading-relaxed text-dark text-base"
                    duration={30}
                    delay={200}
                  >
                    {result.generated_text || ''}
                  </TypingAnimation>
                  
                  {/* Copy button - appears after typing completes */}
                  <motion.button
                    onClick={handleCopy}
                    className={`absolute bottom-0 right-0 p-2 rounded-lg transition-all duration-200 ${
                      isCopied 
                        ? 'bg-emerald-100 text-emerald-600' 
                        : 'bg-accent/10 text-accent hover:bg-accent/20'
                    }`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 3, duration: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isCopied ? (
                      <CheckIcon className="w-5 h-5" />
                    ) : (
                      <ClipboardDocumentIcon className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area */}
      <motion.form 
        onSubmit={handleSubmit}
        className="w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="relative">
          <textarea
            ref={textAreaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="How can I help you today?"
            className="w-full p-4 pr-32 bg-white/70 backdrop-blur-sm text-dark min-h-[56px] max-h-[200px] resize-none outline-none rounded-lg overflow-hidden shadow-lg focus:ring-2 focus:ring-accent/40 border border-accent/20"
            rows={1}
            disabled={isLoading}
          />
          
          <div className="absolute right-2 bottom-3 m-auto flex items-center">
            <Button 
              type="submit"
              disabled={!message.trim() || isLoading}
              className="py-2 px-3 text-sm"
            >
              {isLoading ? 'Generating...' : 'Generate'}
            </Button>
          </div>
        </div>

        {/* Tone and Length selection */}
        <motion.div 
          className="flex gap-6 mt-6 justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="w-40">
            <CustomDropdown
              options={toneOptions}
              selectedValue={selectedTone}
              onChange={setSelectedTone}
              label="Tone"
              placeholder="Select tone"
            />
          </div>
          
          <div className="w-40">
            <CustomDropdown
              options={lengthOptions}
              selectedValue={selectedLength}
              onChange={setSelectedLength}
              label="Length"
              placeholder="Select length"
            />
          </div>
        </motion.div>
        
        {/* Model label */}
        <div className="flex justify-center mt-2 px-1">
          <span className="text-dark/70 text-xs">UNAGI is Trained upon Falcon3-7b-Instruct Model</span>
        </div>
      </motion.form>

      {/* Pro tip - only show when not loading or showing results */}
      <AnimatePresence>
        {!result && !isLoading && (
          <motion.div 
            className="text-center text-dark/80 text-xs max-w-md bg-accent/5 p-3 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <p className="text-sm font-unagiiii">Pro tip: Great posts deserve great visuals. Grab a slick, vibe-matching image from Pinterest or Unsplash before you hit "Post." Your audience scrolls with their eyes first.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}