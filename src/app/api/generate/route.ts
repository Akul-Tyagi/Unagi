import { NextResponse } from 'next/server';
import { getCurrentApiUrl } from '@/lib/api-config';

// Timeout for generation requests (90 seconds - generation can take time)
const GENERATION_TIMEOUT = 90000;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const apiUrl = await getCurrentApiUrl();
        
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), GENERATION_TIMEOUT);
        
        // Forward the request to the Colab API
        const response = await fetch(`${apiUrl}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true', // Skip ngrok warning page
            },
            body: JSON.stringify({
                topic: body.topic,
                tone: body.tone || 'professional',
                length: body.length || 'medium',
                email: body.email
            }),
            signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { 
                    error: `API error: ${response.status}`, 
                    details: errorText 
                }, 
                { status: response.status }
            );
        }
        
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const isTimeout = errorMessage.includes('abort');
        
        console.error('Error generating post:', errorMessage);
        return NextResponse.json(
            { 
                error: isTimeout 
                    ? 'Generation timed out. The AI might be busy - please try again.' 
                    : 'Failed to connect to AI service. Make sure Colab is running.'
            }, 
            { status: isTimeout ? 504 : 503 }
        );
    }
}