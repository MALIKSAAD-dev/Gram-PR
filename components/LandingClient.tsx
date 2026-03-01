"use client";

import { signIn } from "next-auth/react";
import { Github, CheckCircle, Zap, Shield, GitPullRequest, MessageSquare, Bot } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function LandingClient() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117] text-gray-300 font-sans selection:bg-green-900 selection:text-white">
      <Navbar />

      <main className="flex-grow flex flex-col items-center">
        {/* HERO SECTION */}
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center pb-20 border-b border-gray-800">
          <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
            <SparklesIcon className="w-4 h-4" />
            <span>Now with Llama 3 speeds</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8">
            AI Code Reviews on <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
              Every Pull Request
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Gram-PR automatically reviews your PRs using AI and posts feedback as comments. Free forever.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://github.com/apps/gram-pr/installations/new"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-green-600 rounded-lg hover:bg-green-500 transition-colors shadow-lg shadow-green-900/20"
            >
              <Github className="w-5 h-5 mr-2" />
              Install on GitHub
            </a>

            <button
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 font-bold text-gray-300 bg-transparent border border-gray-700 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
            >
              Sign In to Dashboard
            </button>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-b border-gray-800">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How it works</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Get automated code reviews in minutes. No configuration files required.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-gray-800 via-green-500/30 to-gray-800 z-0"></div>

            <StepCard
              number="1"
              icon={<Shield className="w-6 h-6 text-green-400" />}
              title="Install the App"
              description="Install the GitHub App on your repo with one click. We only request permission to read code and write PR comments."
            />
            <StepCard
              number="2"
              icon={<GitPullRequest className="w-6 h-6 text-green-400" />}
              title="Open a Pull Request"
              description="Keep coding as usual. Whenever you open or update a Pull Request, GitHub sends us a secure webhook instantly."
            />
            <StepCard
              number="3"
              icon={<MessageSquare className="w-6 h-6 text-green-400" />}
              title="Get Review Comments"
              description="Our AI analyzes the diff and posts a concise, actionable review comment directly on your PR within seconds."
            />
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Features</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Everything you need for better code quality, built right in.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-yellow-400" />}
              title="Zero Setup"
              description="Install once, works forever automatically. No complex YAML configurations, no CI/CD pipelines to modify."
            />
            <FeatureCard
              icon={<Bot className="w-8 h-8 text-blue-400" />}
              title="AI Powered"
              description="Powered by Llama 4 Scout. Finds bugs, security issues, and provides performance suggestions with high accuracy."
            />
            <FeatureCard
              icon={<CheckCircle className="w-8 h-8 text-green-400" />}
              title="Free Forever"
              description="Completely free to use. No credit card required, no limits on the number of repositories or pull requests."
            />
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-gray-800 py-8 text-center bg-[#090c10]">
        <p className="text-gray-500 font-medium tracking-wide">
          Built by <span className="text-gray-300 font-bold">MALIKSAAD-dev</span>
        </p>
      </footer>
    </div>
  );
}

function StepCard({ number, icon, title, description }: { number: string, icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="relative z-10 flex flex-col items-center text-center">
      <div className="w-24 h-24 rounded-full bg-[#161b22] border-4 border-[#0d1117] flex items-center justify-center shadow-xl shadow-black/50 mb-6 relative">
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-[#0d1117]">
          {number}
        </div>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed max-w-xs">{description}</p>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-[#161b22] border border-[#30363d] p-8 rounded-2xl hover:border-gray-500 hover:shadow-lg hover:shadow-white/5 transition-all duration-300 group">
      <div className="bg-[#0d1117] inline-flex p-4 rounded-xl border border-[#30363d] mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-white text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
