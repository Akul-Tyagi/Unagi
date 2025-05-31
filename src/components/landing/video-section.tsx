'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function VideoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-end px-8 lg:px-16">
      <motion.div 
        className="w-full lg:w-1/2"
        initial={{ opacity: 0, x: 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-5xl font-bold mb-8">How It Works</h2>
        <div className="bg-gray-900/50 rounded-2xl p-8 border border-white/10">
          <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center mb-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 5v10l7-5z"/>
                </svg>
              </div>
              <p className="text-gray-400">Video walkthrough coming soon</p>
            </div>
          </div>
          <h3 className="text-2xl font-semibold mb-4">Process Overview</h3>
          <ol className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1">1</span>
              Input your content requirements and preferences
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1">2</span>
              Falcon3 7B processes and understands the context
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1">3</span>
              AI generates optimized LinkedIn content
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1">4</span>
              Review, edit, and publish your content
            </li>
          </ol>
        </div>
      </motion.div>
    </section>
  );
}