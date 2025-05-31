import { NextResponse } from 'next/server';
import { getCurrentApiUrl } from '@/lib/api-config';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const apiUrl = await getCurrentApiUrl();
        
        // Forward the request to the Colab API
        const response = await fetch(`${apiUrl}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                topic: body.topic,
                tone: body.tone || 'professional',
                length: body.length || 'medium',
                email: body.email
            }),
        });
        
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
        console.error('Error generating post:', error);
        return NextResponse.json(
            { error: 'Failed to generate post' }, 
            { status: 500 }
        );
    }
}