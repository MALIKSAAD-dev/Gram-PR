"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { History, ExternalLink, RefreshCw, MessageSquare } from "lucide-react";

type ReviewHistoryItem = {
    id: string;
    repo: string;
    prTitle: string;
    prLink: string;
    date: string;
    status: "success" | "pending" | "error";
};

export default function Reviews() {
    const { status } = useSession();
    const router = useRouter();
    const [history, setHistory] = useState<ReviewHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            setLoading(false);
            router.push("/");
        } else if (status === "authenticated") {
            const stored = localStorage.getItem("gram_pr_review_history");
            if (stored) {
                setHistory(JSON.parse(stored));
            } else {
                setHistory([]);
            }
            setLoading(false);
        }
    }, [status, router]);

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const storedRepos = localStorage.getItem("gram_pr_connected_repos");
            const repos = storedRepos ? JSON.parse(storedRepos) : [];

            if (repos.length === 0) {
                alert("You have no connected repositories to sync. Go to Dashboard to connect a repository first.");
                setIsSyncing(false);
                return;
            }

            const res = await fetch("/api/github/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ repos }),
            });

            if (!res.ok) throw new Error("Failed to sync from GitHub");

            const data = await res.json();

            // Deduplicate new data with existing history based on ID if needed
            // For simplicity, overwrite the entire cache with the fresh data from Github
            setHistory(data.history || []);
            localStorage.setItem("gram_pr_review_history", JSON.stringify(data.history || []));

        } catch (err) {
            console.error("Sync error:", err);
            alert("An error occurred while syncing with GitHub.");
        } finally {
            setIsSyncing(false);
        }
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
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-end mb-8 border-b border-gray-800 pb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            <History className="w-8 h-8" /> Recent Activity
                        </h1>
                        <p className="text-gray-400 mt-2">Recent pull requests from your connected repositories.</p>
                    </div>
                    <button
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors bg-gray-900 border border-gray-800 px-4 py-2 rounded-md disabled:opacity-50"
                        onClick={handleSync}
                        disabled={isSyncing}
                    >
                        <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                        {isSyncing ? "Syncing..." : "Fetch Latest from GitHub"}
                    </button>
                </div>

                <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
                    {history.length === 0 ? (
                        <div className="py-16 text-center flex flex-col items-center justify-center border-t border-[#30363d]">
                            <MessageSquare className="w-12 h-12 text-gray-600 mb-4" />
                            <p className="text-gray-400">No review history found locally.</p>
                            <p className="text-gray-500 text-sm mt-2 max-w-md">
                                As Webhooks run entirely on the backend, click the Sync button above to fetch the latest pull requests from your connected repositories.
                            </p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-800">
                            {history.map((item) => (
                                <li key={item.id} className="p-4 sm:p-6 hover:bg-[#0d1117]/50 transition-colors">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-mono text-gray-500 bg-gray-900 border border-gray-800 px-2 py-0.5 rounded">
                                                    {item.repo}
                                                </span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full border border-green-800 text-green-400 bg-green-900/20`}>
                                                    Analyzed
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-white">
                                                {item.prTitle}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {new Date(item.date).toLocaleString()}
                                            </p>
                                        </div>

                                        <a
                                            href={item.prLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center whitespace-nowrap gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 border border-[#30363d] bg-[#161b22] hover:bg-[#30363d]/50 px-4 py-2 rounded-md transition-colors w-fit"
                                        >
                                            View on GitHub <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>
        </div>
    );
}
