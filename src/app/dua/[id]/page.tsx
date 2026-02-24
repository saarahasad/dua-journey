import { notFound } from "next/navigation";
import { duas, getDuaById } from "@/lib/data";
import { DuaFlow } from "./DuaFlow";

export function generateStaticParams() {
  return duas.map((d) => ({ id: d.id }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DuaPage({ params }: PageProps) {
  const { id } = await params;
  const dua = getDuaById(id);
  if (!dua) notFound();

  return <DuaFlow dua={dua} />;
}
