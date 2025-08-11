// This will run on the server and show in terminal
export default function TestEnv() {
  // This runs on the server
  console.log("🔍 Server - NextAuth Secret:", !!process.env.NEXTAUTH_SECRET ? "✅ Loaded" : "❌ Missing")
  console.log("🔍 Server - Google Client ID:", !!process.env.GOOGLE_CLIENT_ID ? "✅ Loaded" : "❌ Missing")
  console.log("🔍 Server - NextAuth URL:", process.env.NEXTAUTH_URL)
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Environment Test</h1>
      <p>Check your terminal/console for server-side environment variables</p>
      <p>NextAuth Secret: {process.env.NEXTAUTH_SECRET ? "✅ Loaded" : "❌ Missing"}</p>
      <p>Google Client ID: {process.env.GOOGLE_CLIENT_ID ? "✅ Loaded" : "❌ Missing"}</p>
      <p>NextAuth URL: {process.env.NEXTAUTH_URL || "❌ Missing"}</p>
    </div>
  )
}