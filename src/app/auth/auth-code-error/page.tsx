export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-light">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-dark mb-4">Authentication Error</h1>
        <p className="text-dark/70 mb-6">
          Sorry, we couldn't complete your authentication. Please try again.
        </p>
        <a 
          href="/"
          className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors"
        >
          Return to Home
        </a>
      </div>
    </div>
  )
}