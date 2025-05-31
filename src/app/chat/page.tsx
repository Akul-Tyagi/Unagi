'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ChatInterface from '@/components/chat/chat-interface';
import { motion } from 'framer-motion';
import Loading from '@/components/ui/loading';
import { SmoothCursor } from '@/components/ui/smooth-cursor';

export default function ChatPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
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

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-light text-dark relative overflow-hidden">
      <SmoothCursor/>
      
      {/* User Menu in top right */}
      <motion.div 
        className="absolute top-4 right-4 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="relative group">
          <button className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center hover:bg-accent/90 transition-colors">
            {user.email?.[0]?.toUpperCase() || 'U'}
          </button>
          
          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <div className="p-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
            </div>
            <button
              onClick={signOut}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content - perfectly centered */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <ChatInterface user={user.id} />
      </div>
    </div>
  );
}