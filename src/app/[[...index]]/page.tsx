'use client';

import ThreeModel from '@/components/landing/three-model';
import Image from 'next/image';
import AuthWrapper from '@/components/landing/authwrapper';
import { motion } from 'framer-motion';
import LinkedInLogo from '@/components/icons/LinkedInLogo';
import { SmoothCursor } from '@/components/ui/smooth-cursor';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import { PointerHighlight } from '@/components/ui/pointer-highlight';

export default function Home() {
  return (
    <main className="flex min-h-screen bg-light">
      <SmoothCursor/>
      <ScrollProgress className="top-[1px]" />
      {/* Left section - Content & Authentication */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-12 z-10">
        {/* Logo section */}
          <div className="flex flex-col justify-center items-center">
            <span className="p-4 text-8xl font-unagi text-dark">Unagi</span>
          </div>
        
        {/* Main content */}
        <div className="flex justify-center items-center content-center"> 
          {/* Auth component with toggle between sign-in and sign-up */}
          <AuthWrapper />
        </div>
      </div>
      
      {/* Right section - 3D Model with background text */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        {/* Background pattern and large text elements */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Large background words - first and third stay behind model */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute w-full text-center top-[15%] text-[90px] font-unagiiiiiii text-dark/80 leading-none"
            style={{ 
              textShadow: '2px 2px 10px rgba(25, 24, 10, 0.15), 0px 0px 30px rgba(25, 24, 10, 0.1)',
              filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
            }}
          >
            <motion.span 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Your <span className="relative">
                <span className="text-dark/80">Linked</span> 
                <LinkedInLogo size={90} className="-ml-1 mb-5" />
              </span>
            </motion.span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.6 }}
            className="absolute w-full text-center bottom-[17%] text-[46px] font-unagiiiiiii text-dark/30 leading-none"
            style={{ 
              textShadow: '1px 1px 8px rgba(25, 24, 10, 0.2), 0px 0px 20px rgba(25, 24, 10, 0.1)',
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
            }}
          >
            <motion.span
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              While They're Still Figuring It Out You're Already Winning.
            </motion.span>
          </motion.div>
        </div>
        
        {/* 3D Model (in middle layer) */}
        <div className="absolute inset-0 z-10">
          <ThreeModel />
        </div>
        
        {/* Middle text that appears ABOVE the 3D model */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute w-full text-center gradient-glow top-[40%] z-20 text-[90px] font-unagii text-dark/90 leading-none"
        >
          Wing(Wo)man
        </motion.div>
      </div>
    </main>
  );
}