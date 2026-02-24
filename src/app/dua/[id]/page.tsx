import { notFound } from "next/navigation";
import { getDuaById } from "@/lib/data";
import { DuaFlow } from "./DuaFlow";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DuaPage({ params }: PageProps) {
  const { id } = await params;
  const dua = getDuaById(id);
  if (!dua) notFound();

  return <DuaFlow dua={dua} />;
}
