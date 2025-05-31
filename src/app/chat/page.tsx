'use client';

import { useAuth, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ChatInterface from '@/components/chat/chat-interface';
import { motion } from 'framer-motion';
import Loading from '@/components/ui/loading';
import { SmoothCursor } from '@/components/ui/smooth-cursor';

export default function ChatPage() {
  const { isSignedIn, userId, isLoaded } = useAuth();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Only redirect if clerk has fully loaded
    if (isLoaded) {
      if (!isSignedIn) {
        router.push('/');
      }
      setIsCheckingAuth(false);
    }
  }, [isSignedIn, isLoaded, router]);

  if (isCheckingAuth || !isLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-light">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Loading />
        </motion.div>
        <motion.p 
          className="mt-8 text-dark/70 font-display"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Loading your creative space...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light text-dark relative overflow-hidden">
      <SmoothCursor/>
      {/* User Button in top right - small and subtle */}
      <motion.div 
        className="absolute top-4 right-4 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
              userButtonPopoverCard: "shadow-xl border border-accent/20"
            }
          }}
        />
      </motion.div>

      {/* Main Content - perfectly centered */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <ChatInterface user={userId} />
      </div>
    </div>
  );
}