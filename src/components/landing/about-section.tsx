'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="min-h-screen flex items-center px-8 lg:px-16">
      <motion.div 
        className="w-full lg:w-1/2"
        initial={{ opacity: 0, x: -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-5xl font-bold mb-8">About Falcon3 7B</h2>
        <div className="space-y-6 text-lg text-gray-300">
          <p>
            Falcon3 7B Instruct represents a breakthrough in efficient AI language models, 
            combining exceptional performance with optimized resource usage.
          </p>
          <p>
            Our implementation leverages this powerful model to understand context, 
            tone, and professional nuances required for compelling LinkedIn content.
          </p>
          <p>
            With advanced instruction-following capabilities, Falcon3 7B generates 
            authentic, engaging posts that resonate with your professional audience.
          </p>
        </div>
        <motion.div 
          className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-white/10"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h3 className="text-2xl font-semibold mb-4 text-blue-400">Key Features</h3>
          <ul className="space-y-2">
            <li>• Advanced context understanding</li>
            <li>• Professional tone adaptation</li>
            <li>• Industry-specific knowledge</li>
            <li>• Engagement optimization</li>
          </ul>
        </motion.div>
      </motion.div>
    </section>
  );
}