# GRAM PR 🤖

GRAM PR is a full-stack Next.js application designed to function as a GitHub App that provides automated, lightning-fast pull request reviews using Groq's high-performance LLM APIs.

## Features
- **GitHub App Integration**: Operates fully autonomously using a GitHub App installation (no manual Personal Access Tokens required).
- **Automated PR Reviews**: Generates actionable, concise, and structured code reviews immediately after a Pull Request is opened or synchronized.
- **Groq AI Engine**: Powered by the blazing fast `meta-llama/llama-4-scout-17b-16e-instruct` model via Groq.
- **Dark UI Dashboard**: Minimalist Next.js 14 App Router dashboard with a clean "GitHub vibe" to manage connected repositories.
- **Local History**: DB-free architecture uses `localStorage` to keep track of preferences.

## Environment Variables
Create a `.env.local` file in the project root with the following variables:
\`\`\`env
GITHUB_APP_ID=your_app_id
GITHUB_APP_CLIENT_ID=your_client_id
GITHUB_APP_CLIENT_SECRET=your_client_secret
GITHUB_APP_WEBHOOK_SECRET=your_webhook_secret
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n..."
GROQ_API_KEY=gsk_...
NEXTAUTH_SECRET=your_random_string
NEXTAUTH_URL=http://localhost:3000
\`\`\`

## Running the Application Locally

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Start the Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Open the App**
   Navigate to [http://localhost:3000](http://localhost:3000).

## GitHub App Setup
1. Create a GitHub App in your Developer Settings.
2. Set the Webhook URL to: \`https://your-domain.vercel.app/api/webhook/github\` (Use a tunneling service like ngrok or localtunnel if testing locally).
3. Generate a Private Key and store it in your `.env.local` exactly as provided.
4. Set Permissions:
   - **Pull requests**: Read & write
   - **Issues / Comments**: Read & write
   - **Contents**: Read-only
5. Subscribe to events: `Pull request`
6. Install the App on your repositories!

## Architecture
- **Auth**: \`NextAuth.js\` for dashboard authentication (logging users in to see repos).
- **Backend API**: Next.js Serverless Route Handlers (\`/api/webhook/github\`).
- **Review Generation**: \`groq-sdk\`.
