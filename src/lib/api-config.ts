// Enhanced API config that auto-updates

let currentApiUrl = "https://32a9-34-125-145-107.ngrok-free.app"; // Fallback

// Apps Script Web App URL to get current ngrok URL
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx7mPaqI175tMDXKFjm0ZCllLPRrGf5fr207iXBleVoj80VrpFKcTTcvfWIjfi60Xa2Ww/exec";

// Function to get the latest API URL
export async function getCurrentApiUrl(): Promise<string> {
  try {
    const response = await fetch(APPS_SCRIPT_URL);
    const data = await response.json();
    
    if (data.apiUrl && data.apiUrl !== currentApiUrl) {
      currentApiUrl = data.apiUrl;
      console.log(`Updated API URL to: ${currentApiUrl}`);
    }
    
    return currentApiUrl;
  } catch (error) {
    console.error('Failed to fetch current API URL:', error);
    return currentApiUrl; // Return fallback
  }
}

export const API_URL = currentApiUrl;

// Helper function to check if API is available
export async function checkApiAvailability(): Promise<boolean> {
  try {
    const url = await getCurrentApiUrl();
    const response = await fetch(`${url}/status`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.ok;
  } catch (error) {
    console.error('API availability check failed:', error);
    return false;
  }
}