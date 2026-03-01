"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Github, LogOut, History, LayoutDashboard } from "lucide-react";

export default function Navbar() {
    const { data: session, status } = useSession();

    return (
        <nav className="border-b border-gray-800 bg-gray-900 text-gray-300">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2 group">
                            <Github className="w-8 h-8 text-white group-hover:text-green-500 transition-colors" />
                            <span className="text-white font-semibold text-xl tracking-tight">GRAM PR</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        {status === "loading" ? (
                            <div className="w-20 h-8 bg-gray-800 animate-pulse rounded"></div>
                        ) : session ? (
                            <>
                                <Link href="/dashboard" className="hover:text-white transition-colors flex items-center gap-1 text-sm font-medium">
                                    <LayoutDashboard className="w-4 h-4" />
                                    <span className="hidden sm:inline">Dashboard</span>
                                </Link>
                                <Link href="/reviews" className="hover:text-white transition-colors flex items-center gap-1 text-sm font-medium">
                                    <History className="w-4 h-4" />
                                    <span className="hidden sm:inline">History</span>
                                </Link>

                                <div className="h-4 w-px bg-gray-700 mx-2"></div>
                                <div className="flex items-center gap-2">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={session.user?.image || ""}
                                        alt="Avatar"
                                        className="w-8 h-8 rounded-full border border-gray-700"
                                    />
                                    <button
                                        onClick={() => signOut({ callbackUrl: "/" })}
                                        className="text-gray-400 hover:text-red-400 transition-colors"
                                        title="Sign Out"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <button
                                onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2"
                            >
                                <Github className="w-4 h-4" />
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
