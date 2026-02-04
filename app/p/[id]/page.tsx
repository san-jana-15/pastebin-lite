async function getPaste(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/pastes/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function PastePage({
  params,
}: {
  params: { id: string };
}) {
  const paste = await getPaste(params.id);

  if (!paste) {
    return <h1>404 – Paste not found</h1>;
  }

  return (
    <pre
      style={{
        whiteSpace: "pre-wrap",
        padding: "16px",
        fontFamily: "monospace",
      }}
    >
      {paste.content}
    </pre>
  );
}
