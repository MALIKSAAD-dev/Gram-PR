import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { owner, repo } = body;

    if (!owner || !repo) {
        return NextResponse.json({ error: "Missing owner or repo" }, { status: 400 });
    }

    // NOTE: In a GitHub App architecture, webhooks are configured globally at the App level 
    // via the GitHub Developer Settings. Individual repository webhooks are not typically created via API 
    // unless you have a specific reason to bypass the App's built-in webhook delivery.
    // We return success here to satisfy the frontend flow, and rely on the global App installation 
    // to deliver the webhooks to our `/api/webhook/github` endpoint.

    return NextResponse.json({ success: true, message: "Repo connected successfully" });
}
