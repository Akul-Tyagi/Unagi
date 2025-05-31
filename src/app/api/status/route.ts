import { NextResponse } from 'next/server';
import { getCurrentApiUrl } from '@/lib/api-config';

export async function GET() {
    try {
        // Forward the request to the real API
        const apiUrl = await getCurrentApiUrl();

        const response = await fetch(`${apiUrl}/status`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (!response.ok) {
            // Check if the current time is within scheduled window (Sunday 9 AM - 1 PM)
            const now = new Date();
            const day = now.getDay(); // 0 = Sunday
            const hour = now.getHours();
            
            const isActiveWindow = day === 0 && hour >= 9 && hour < 13;
            
            // If we're in the active window but API is unreachable, show "Processing"
            return NextResponse.json(
                { 
                  status: isActiveWindow ? 'Processing' : 'Scheduled',
                  estimatedTime: isActiveWindow ? 'immediate' : undefined
                }, 
                { status: 200 } // Change this to 200 instead of response.status
            );
        }
        
        const data = await response.json();
        
        // Map the response to match your frontend expectations
        return NextResponse.json({
            status: data.status || 'Inactive',
            queuePosition: data.queue_position,
            estimatedTime: data.estimated_time
        });
    } catch (error) {
        console.error('Error fetching AI status:', error);
        
        // If API is completely unreachable, check if we're in active window
        const now = new Date();
        const day = now.getDay();
        const hour = now.getHours();
        const isActiveWindow = day === 0 && hour >= 9 && hour < 13;
        
        return NextResponse.json(
            { 
              status: isActiveWindow ? 'Processing' : 'Scheduled'
            }, 
            { status: 200 } // Change this to 200 instead of 500
        );
    }
}