// lib/rag.ts
export type Doc = { id: string; title: string; content: string };

export function chunkProfile(profile: string): Doc[] {
  const paras = profile
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return paras.map((p, i) => ({ id: `p${i + 1}`, title: `Profile ${i + 1}`, content: p }));
}

/**
 * Edge-safe, deterministic "embedding" (NOT cryptographic).
 * Produces a 16-dim vector from char codes; good enough for tiny RAG.
 */
export function fakeEmbed(text: string): number[] {
  const dims = 16;
  const out = new Array<number>(dims).fill(0);
  let acc = 2166136261 >>> 0; // FNV-like accumulator
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    acc ^= c;
    acc = Math.imul(acc, 16777619) >>> 0;
    out[i % dims] += (acc & 0xffff) / 0xffff; // 0..1 bucket
  }
  // L2 normalize
  const norm = Math.sqrt(out.reduce((s, v) => s + v * v, 0)) || 1;
  return out.map((v) => v / norm);
}

export function cosine(a: number[], b: number[]) {
  let dot = 0,
    na = 0,
    nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-9);
}

export function topK(query: string, docs: Doc[], k = 4) {
  const qv = fakeEmbed(query);
  return docs
    .map((d) => ({ d, score: cosine(qv, fakeEmbed(d.content)) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map(({ d, score }) => ({ ...d, score }));
}
