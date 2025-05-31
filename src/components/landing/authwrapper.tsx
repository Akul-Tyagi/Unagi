'use client';

import { SignIn, SignUp } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthWrapper() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isSignInMode, setIsSignInMode] = useState(false);
  
  // Detect mode changes whenever searchParams updates
  useEffect(() => {
    const mode = searchParams.get('mode');
    console.log('URL mode parameter:', mode);
    
    // Set the sign-in mode based on the URL parameter
    setIsSignInMode(mode === 'sign_in');
  }, [searchParams]);
  
  // Manual override functions for more reliable switching
  const switchToSignIn = () => {
    router.push('/?mode=sign_in');
  };
  
  const switchToSignUp = () => {
    router.push('/');
  };

  return (
    <div className='flex flex-col justify-center items-center w-full'>
      {!isSignInMode ? (
        <>
          <SignUp
            routing="path"
            path="/"
            signInForceRedirectUrl="/chat"
            appearance={{
              elements: {
                footerAction: "hidden", // Hide default footer
              }
            }}
          />
          <button 
            onClick={switchToSignIn}
            className="mt-3 text-black-dark text-sm hover:underline"
          >
            Already have an account? Sign in
          </button>
        </>
      ) : (
        <>
          <SignIn 
            routing="path"
            path="/"
            signUpForceRedirectUrl="/chat"
            appearance={{
              elements: {
                footerAction: "hidden", // Hide default footer
              }
            }}
          />
          <button 
            onClick={switchToSignUp}
            className="mt-3 text-black-dark text-sm hover:underline"
          >
            Don't have an account? Sign up
          </button>
        </>
      )}
    </div>
  );
}