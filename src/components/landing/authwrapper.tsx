'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ButtonAuth from '@/components/ui/button-auth';

export default function AuthWrapper() {
  const [isSignInMode, setIsSignInMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  const supabase = createClient();
  const router = useRouter();

  const getURL = () => {
    let url =
      process?.env?.NEXT_PUBLIC_SITE_URL ?? 
      process?.env?.NEXT_PUBLIC_VERCEL_URL ?? 
      'http://localhost:3000/'
    url = url.startsWith('http') ? url : `https://${url}`
    url = url.endsWith('/') ? url : `${url}/`
    return url
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignInMode) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/chat');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${getURL()}auth/callback`,
          },
        });
        if (error) throw error;
        setError('Check your email for the confirmation link!');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${getURL()}auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  const fieldVariants = {
    focused: { 
      scale: 1.02,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    unfocused: { 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full max-w-sm mx-auto">
      {/* Header */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <p className="text-dark/60 font-light">
          {isSignInMode 
            ? 'Continue your LinkedIn content journey' 
            : 'Start creating amazing LinkedIn posts'
          }
        </p>
      </motion.div>

      {/* Error/Success Message */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`w-full mb-6 p-4 rounded-2xl text-sm font-medium ${
              error.includes('Check your email') 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Google Auth Button */}
      <motion.div
        className="w-full mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <ButtonAuth
          onClick={handleGoogleAuth}
          disabled={loading}
          variant="secondary"
        >
          <div className="flex items-center justify-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </>
            ) : (
              'Continue with Google'
            )}
          </div>
        </ButtonAuth>
      </motion.div>

      {/* Divider */}
      <motion.div 
        className="w-full flex items-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        <span className="px-4 text-sm text-gray-500 font-medium">or</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </motion.div>

      {/* Email Form */}
      <motion.form 
        onSubmit={handleEmailAuth} 
        className="w-full space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        {/* Email Field */}
        <motion.div
          variants={fieldVariants}
          animate={focusedField === 'email' ? 'focused' : 'unfocused'}
          className="relative"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            required
            className="w-full px-6 py-4 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-2xl focus:border-accent focus:bg-white focus:shadow-lg outline-none transition-all duration-300 text-dark placeholder-gray-400"
          />
          <motion.div 
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/10 to-purple-500/10 opacity-0 pointer-events-none"
            animate={{ 
              opacity: focusedField === 'email' ? 1 : 0,
              scale: focusedField === 'email' ? 1 : 0.95
            }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>
        
        {/* Password Field */}
        <motion.div
          variants={fieldVariants}
          animate={focusedField === 'password' ? 'focused' : 'unfocused'}
          className="relative"
        >
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
            required
            minLength={6}
            className="w-full px-6 py-4 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-2xl focus:border-accent focus:bg-white focus:shadow-lg outline-none transition-all duration-300 text-dark placeholder-gray-400"
          />
          <motion.div 
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/10 to-purple-500/10 opacity-0 pointer-events-none"
            animate={{ 
              opacity: focusedField === 'password' ? 1 : 0,
              scale: focusedField === 'password' ? 1 : 0.95
            }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>

        {/* Submit Button */}
        <ButtonAuth
          type="submit"
          disabled={loading}
          variant="primary"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              {isSignInMode ? 'Signing in...' : 'Creating account...'}
            </div>
          ) : (
            isSignInMode ? 'Sign In' : 'Create Account'
          )}
        </ButtonAuth>
      </motion.form>

      {/* Toggle Mode */}
      <motion.div 
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <button 
          onClick={() => setIsSignInMode(!isSignInMode)}
          className="text-dark/70 hover:text-accent transition-colors duration-300 font-medium"
        >
          {isSignInMode 
            ? (
              <>
                Don't have an account? 
                <span className="text-accent ml-1 hover:underline">Sign up</span>
              </>
            ) : (
              <>
                Already have an account? 
                <span className="text-accent ml-1 hover:underline">Sign in</span>
              </>
            )
          }
        </button>
      </motion.div>
    </div>
  );
}