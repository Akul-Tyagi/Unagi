'use client';

import { useQueueStatus } from '@/hooks/use-queue-status';
import { motion } from 'framer-motion';
import { ClockIcon } from '@heroicons/react/24/outline';

export default function StatusIndicator() {
  const queueStatus = useQueueStatus();

  const getScheduleInfo = () => {
    return {
      dayName: "Sunday",
      hourRange: "9 AM - 1 PM"
    };
  };

  const getStatusInfo = () => {
    switch (queueStatus.status) {
      case 'Active':
        return {
          color: 'text-emerald-500',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]',
          icon: '●',
          message: queueStatus.estimatedTime 
            ? `Ready in approximately ${queueStatus.estimatedTime}`
            : 'Ready for your LinkedIn post request',
        };
      case 'Processing':
        return {
          color: 'text-sky-500',
          bgColor: 'bg-sky-50',
          borderColor: 'border-sky-200',
          glow: 'shadow-[0_0_12px_rgba(14,165,233,0.25)]',
          icon: '◯',
          message: 'System is initializing...',
        };
      case 'Scheduled':
        const scheduleInfo = getScheduleInfo();
        return {
          color: 'text-amber-500',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          glow: '',
          icon: '◐',
          message: `Available on ${scheduleInfo.dayName}s, ${scheduleInfo.hourRange}`,
        };
      default:
        return {
          color: 'text-gray-500',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          glow: '',
          icon: '○',
          message: 'Service currently unavailable',
        };
    }
  };

  const statusInfo = getStatusInfo();
  const scheduleInfo = getScheduleInfo();

  // Animation variants
  const pulse = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.9, 1, 0.9],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div 
      className={`flex items-center gap-4 px-6 py-3 ${statusInfo.bgColor} backdrop-blur-sm border ${statusInfo.borderColor} rounded-xl ${statusInfo.glow}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <motion.div 
        className={`flex items-center justify-center w-10 h-10 rounded-full bg-white ${statusInfo.glow}`}
        variants={pulse}
        animate="animate"
      >
        <span className={`text-xl ${statusInfo.color} font-bold`}>
          {statusInfo.icon}
        </span>
      </motion.div>
      
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={`font-medium text-base ${statusInfo.color}`}>
            {queueStatus.status}
          </span>
        </div>
        <span className="text-gray-600 text-sm mt-0.5 flex items-center">
          {queueStatus.status === 'Active' && (
            <ClockIcon className="w-3 h-3 mr-1 inline" />
          )}
          {statusInfo.message}
        </span>
      </div>
    </motion.div>
  );
}