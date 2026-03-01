"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Github, Link as LinkIcon, AlertCircle, CheckCircle2 } from "lucide-react";

type Repo = {
    id: number;
    name: string;
    full_name: string;
    owner: {
        login: string;
    };
    html_url: string;
    description: string | null;
    private: boolean;
};

export default function Dashboard() {
    const { status } = useSession();
    const router = useRouter();

    const [repos, setRepos] = useState<Repo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [connectedRepos, setConnectedRepos] = useState<string[]>([]);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Redirects should be handled by backend. If not, this is a fallback.
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        }
    }, [status, router]);

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const res = await fetch("/api/github/repos");
                if (!res.ok) throw new Error("Failed to fetch repositories.");
                const data = await res.json();
                setRepos(data);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                setError(err.message || "An error occurred while fetching your repositories.");
            } finally {
                setLoading(false);
            }
        };

        if (status === "unauthenticated") {
            setLoading(false);
            router.push("/");
        } else if (status === "authenticated") {
            fetchRepos();
            const stored = localStorage.getItem("gram_pr_connected_repos");
            if (stored) {
                setConnectedRepos(JSON.parse(stored));
            }
        }
    }, [status, router]);

    const connectRepo = async (repo: Repo) => {
        setActionLoading(repo.full_name);
        try {
            // Stub API call to fulfill webhook setup requirement, though it's handled by GitHub App globally.
            await fetch("/api/webhook/setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ owner: repo.owner.login, repo: repo.name }),
            });

            const newConnected = [...connectedRepos, repo.full_name];
            setConnectedRepos(newConnected);
            localStorage.setItem("gram_pr_connected_repos", JSON.stringify(newConnected));
        } catch (err) {
            console.error(err);
            alert("Failed to connect repository.");
        } finally {
            setActionLoading(null);
        }
    };

    const disconnectRepo = (repoFullName: string) => {
        const newConnected = connectedRepos.filter((r) => r !== repoFullName);
        setConnectedRepos(newConnected);
        localStorage.setItem("gram_pr_connected_repos", JSON.stringify(newConnected));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0d1117] flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0d1117] text-gray-300 font-sans selection:bg-green-900 selection:text-white pb-20">
            <Navbar />
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-end mb-8 border-b border-gray-800 pb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            <Github className="w-8 h-8" /> Your Repositories
                        </h1>
                        <p className="text-gray-400 mt-2">Manage which repositories get automated Groq PR reviews.</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-400 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5" />
                        <p>{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {repos.map((repo) => {
                        const isConnected = connectedRepos.includes(repo.full_name);
                        const isActioning = actionLoading === repo.full_name;

                        return (
                            <div
                                key={repo.id}
                                className={`bg-[#161b22] border rounded-xl overflow-hidden flex flex-col transition-all ${isConnected ? "border-green-600/50 shadow-[0_0_15px_-3px_rgba(22,163,74,0.1)]" : "border-[#30363d] hover:border-gray-500"
                                    }`}
                            >
                                <div className="p-5 flex-grow">
                                    <div className="flex justify-between items-start mb-2 gap-4">
                                        <a
                                            href={repo.html_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-lg font-semibold text-blue-400 hover:underline break-words line-clamp-1"
                                            title={repo.full_name}
                                        >
                                            {repo.name}
                                        </a>
                                        <span className={`text-xs px-2 py-0.5 rounded-full border ${repo.private ? 'border-gray-700 text-gray-400' : 'border-gray-700 text-gray-400'}`}>
                                            {repo.private ? "Private" : "Public"}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 line-clamp-2 h-10">
                                        {repo.description || "No description provided."}
                                    </p>
                                </div>

                                <div className="bg-[#0d1117] border-t border-[#30363d] px-5 py-3 flex justify-between items-center">
                                    <div className="text-xs text-gray-500 font-mono">
                                        {repo.owner.login}
                                    </div>

                                    {isConnected ? (
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center gap-1.5 text-sm font-medium text-green-400 bg-green-900/20 px-2.5 py-1 rounded-full border border-green-900/50">
                                                <CheckCircle2 className="w-4 h-4" /> Active
                                            </span>
                                            <button
                                                onClick={() => disconnectRepo(repo.full_name)}
                                                className="text-gray-500 hover:text-red-400 text-sm transition-colors"
                                            >
                                                Disconnect
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => connectRepo(repo)}
                                            disabled={isActioning}
                                            className="flex items-center gap-1.5 text-sm font-medium text-white bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 px-3 py-1.5 rounded-md transition-colors border border-[rgba(240,246,252,0.1)]"
                                        >
                                            {isActioning ? (
                                                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                                            ) : (
                                                <LinkIcon className="w-4 h-4" />
                                            )}
                                            Connect
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {repos.length === 0 && !loading && !error && (
                        <div className="col-span-full py-12 text-center text-gray-500 border border-dashed border-gray-700 rounded-xl">
                            No repositories found. Ensure you have granted access to the GitHub App.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
