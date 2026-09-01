/**
 * Split CMS copy into short paragraphs for mobile reading (§40).
 * Honours blank-line breaks; otherwise groups sentences (~2 per paragraph).
 */
export function splitReadableParagraphs(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const byBlank = trimmed
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  if (byBlank.length > 1) return byBlank;

  const single = byBlank[0] ?? trimmed;
  if (single.length < 180) return [single];

  const sentences =
    single.match(/[^.!?…]+(?:[.!?…]+|$)/g)?.map((s) => s.trim()).filter(Boolean) ??
    [single];

  if (sentences.length <= 2) return [single];

  const paragraphs: string[] = [];
  for (let i = 0; i < sentences.length; i += 2) {
    paragraphs.push(sentences.slice(i, i + 2).join(" "));
  }
  return paragraphs;
}

export function ReadableParagraphs({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const parts = splitReadableParagraphs(text);
  if (parts.length === 0) return null;

  return (
    <div className={className}>
      {parts.map((p, i) => (
        <p
          key={i}
          className={i === 0 ? undefined : "mt-3 md:mt-3.5"}
        >
          {p}
        </p>
      ))}
    </div>
  );
}
