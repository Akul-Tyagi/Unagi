import { NextResponse } from 'next/server';
import { getCurrentApiUrl } from '@/lib/api-config';

// Quick timeout for status checks (5 seconds)
const STATUS_TIMEOUT = 5000;

function getOfflineStatus() {
    // When Colab is not running, show as Inactive
    // The frontend will display appropriate messaging
    return NextResponse.json(
        { status: 'Inactive' },
        { status: 200 }
    );
}

export async function GET() {
    try {
        const apiUrl = await getCurrentApiUrl();
        
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), STATUS_TIMEOUT);

        const response = await fetch(`${apiUrl}/status`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true', // Skip ngrok warning page
            },
            signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            return getOfflineStatus();
        }
        
        const data = await response.json();
        
        // Map the response to match frontend expectations
        return NextResponse.json({
            status: data.status || 'Active',
            queuePosition: data.queue_position,
            estimatedTime: data.estimated_time
        });
    } catch (error) {
        // API unreachable - Colab not running
        return getOfflineStatus();
    }
}