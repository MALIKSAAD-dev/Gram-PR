"use client";

import { signIn } from "next-auth/react";
import { Github, CheckCircle, Zap, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function LandingClient() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-300 font-sans selection:bg-green-900 selection:text-white">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center">
        <div className="mb-8 p-3 bg-gray-900 border border-gray-800 rounded-full inline-flex items-center gap-2 shadow-lg">
          <span className="bg-green-600/20 text-green-400 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">New</span>
          <span className="text-sm font-medium mr-2">Powered by Groq&apos;s blazing fast Llama 3 models</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6">
          Automated PR Reviews <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
            at the speed of light
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl leading-relaxed">
          Connect your repositories and let our AI provide immediate, actionable, and comprehensive code reviews directly on your GitHub pull requests.
        </p>

        <button
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-green-600 rounded-lg overflow-hidden transition-all duration-300 hover:bg-green-500 hover:scale-105 shadow-[0_0_40px_-10px_rgba(22,163,74,0.5)] focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-[#0d1117]"
        >
          <Github className="w-6 h-6 mr-3 group-hover:animate-bounce" />
          <span className="text-lg">Get Started with GitHub</span>
        </button>

        <div className="mt-24 grid md:grid-cols-3 gap-8 w-full text-left">
          <FeatureCard
            icon={<Zap className="w-8 h-8 text-yellow-400" />}
            title="Instant Feedback"
            description="Our Groq-powered AI reviews code in seconds, catching bugs and suggesting improvements before you even switch tabs."
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8 text-blue-400" />}
            title="Security First"
            description="Runs as a GitHub App with fine-grained permissions. Uses Groq infrastructure to ensure your data is processed securely."
          />
          <FeatureCard
            icon={<CheckCircle className="w-8 h-8 text-green-400" />}
            title="Actionable Insights"
            description="Get concise, markdown-formatted comments straight on your PR lines, ready to be addressed or merged."
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-xl hover:border-gray-500 transition-colors">
      <div className="bg-[#0d1117] inline-block p-3 rounded-lg border border-[#30363d] mb-4">
        {icon}
      </div>
      <h3 className="text-white text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
}
