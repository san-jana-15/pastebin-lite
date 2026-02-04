import { kv } from "@vercel/kv";

export type Paste = {
  id: string;
  content: string;
  createdAt: number;
  expiresAt: number | null;
  maxViews: number | null;
  views: number;
};

export async function savePaste(paste: Paste) {
  await kv.set(`paste:${paste.id}`, paste);
}

export async function getPaste(id: string): Promise<Paste | null> {
  return await kv.get<Paste>(`paste:${id}`);
}

export async function updatePaste(paste: Paste) {
  await kv.set(`paste:${paste.id}`, paste);
}
