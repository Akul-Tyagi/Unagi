/**
 * Unagi API Configuration
 * 
 * To update the API URL:
 * 1. Set NEXT_PUBLIC_COLAB_API_URL in your .env.local file, OR
 * 2. Update the fallback URL below after starting Colab
 * 
 * Using environment variable is preferred for Vercel deployments
 */

// Primary: Environment variable (set in Vercel dashboard or .env.local)
// Fallback: Hardcoded URL (update this when you start Colab)
const FALLBACK_API_URL = "https://b5403c4acf4b.ngrok-free.app";

export function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_COLAB_API_URL || FALLBACK_API_URL;
}

// Async version for consistency with existing code
export async function getCurrentApiUrl(): Promise<string> {
  return getApiUrl();
}

// Legacy export for backward compatibility
export const API_URL = FALLBACK_API_URL;

// Check if the Colab API is currently available
export async function checkApiAvailability(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
    
    const response = await fetch(`${getApiUrl()}/status`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
}