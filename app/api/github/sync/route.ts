/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !(session as any).accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { repos } = body;

        if (!repos || !Array.isArray(repos) || repos.length === 0) {
            return NextResponse.json({ history: [] });
        }

        const accessToken = (session as any).accessToken;

        // Fetch recent pull requests for the connected repositories
        const repoQuery = repos.map((r: string) => `repo:${r}`).join(" ");
        const q = `is:pr ${repoQuery}`;

        const res = await fetch(`https://api.github.com/search/issues?q=${encodeURIComponent(q)}&sort=updated&order=desc&per_page=15`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/vnd.github.v3+json",
            }
        });

        if (!res.ok) {
            throw new Error(`GitHub API error: ${res.statusText}`);
        }

        const data = await res.json();

        // Map to ReviewHistoryItem format
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const history = data.items.map((item: any) => {
            const repoUrlMatch = item.html_url.match(/github\.com\/([^/]+\/[^/]+)\/pull\/\d+/);
            const repoFullName = repoUrlMatch ? repoUrlMatch[1] : "Unknown";

            return {
                id: item.id.toString(),
                repo: repoFullName,
                prTitle: item.title,
                prLink: item.html_url,
                date: item.updated_at,
                // We mark it as success to indicate the PR is active and likely reviewed by the bot
                status: "success",
            };
        });

        return NextResponse.json({ history });

    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
