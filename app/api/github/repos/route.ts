import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(authOptions);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || !(session as any).accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const res = await fetch("https://api.github.com/user/repos?per_page=100&sort=updated", {
            headers: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                Authorization: `Bearer ${(session as any).accessToken}`,
                Accept: "application/vnd.github.v3+json",
            },
        });

        if (!res.ok) {
            throw new Error("Failed to fetch repositories from GitHub");
        }

        const repos = await res.json();
        return NextResponse.json(repos);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
