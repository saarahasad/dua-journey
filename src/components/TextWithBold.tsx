/**
 * Renders text with **wrapped** segments as <strong>.
 * Use in JSON: "Hello **bold** world" → Hello <strong>bold</strong> world
 */
export function TextWithBold({
  text,
  className,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  as?: "span" | "p";
}) {
  if (!text || typeof text !== "string") {
    return <Tag className={className} />;
  }
  const parts = text.split("**");
  const content = parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
  return <Tag className={className}>{content}</Tag>;
}
