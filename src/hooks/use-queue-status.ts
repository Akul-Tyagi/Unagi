import { useState, useEffect } from 'react';

type QueueStatus = {
  status: 'Active' | 'Scheduled' | 'Processing' | 'Inactive';
  nextWindow?: string;
  queuePosition?: number;
  estimatedTime?: string;
};

export function useQueueStatus() {
  const [status, setStatus] = useState<QueueStatus>({
    status: 'Active',
  });
  const [isFirstFetch, setIsFirstFetch] = useState(true);

  useEffect(() => {
    // Fetch status from API
    const fetchStatus = async () => {
      try {
        // Show loading on first fetch
        if (isFirstFetch) {
          setStatus(prev => ({ ...prev, status: 'Processing' }));
          setIsFirstFetch(false);
        }
        
        const response = await fetch('/api/status');
        if (response.ok) {
          const data = await response.json();
          setStatus(data);
        } else {
          console.error('Status API returned error:', response.status);
          setStatus({ status: 'Inactive' });
        }
      } catch (error) {
        console.error('Error fetching status:', error);
        setStatus({ status: 'Inactive' });
      }
    };

    fetchStatus();
    const intervalId = setInterval(fetchStatus, 30000);
    
    return () => clearInterval(intervalId);
  }, [isFirstFetch]);

  return status;
}