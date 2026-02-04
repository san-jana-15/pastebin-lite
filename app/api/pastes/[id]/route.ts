import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

function getNow(req: NextRequest) {
  if (process.env.TEST_MODE === "1") {
    const h = req.headers.get("x-test-now-ms");
    if (h) return Number(h);
  }
  return Date.now();
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const key = `paste:${params.id}`;
  const paste = await kv.get<any>(key);

  if (!paste) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const now = getNow(req);

  // TTL check
  if (
    paste.ttl_seconds !== null &&
    now > paste.created_at_ms + paste.ttl_seconds * 1000
  ) {
    return NextResponse.json({ error: "expired" }, { status: 404 });
  }

  // View limit check
  if (paste.max_views !== null && paste.views >= paste.max_views) {
    return NextResponse.json({ error: "view limit exceeded" }, { status: 404 });
  }

  paste.views += 1;
  await kv.set(key, paste);

  return NextResponse.json({
    content: paste.content,
    remaining_views:
      paste.max_views === null ? null : paste.max_views - paste.views,
    expires_at:
      paste.ttl_seconds === null
        ? null
        : new Date(
            paste.created_at_ms + paste.ttl_seconds * 1000
          ).toISOString(),
  });
}
