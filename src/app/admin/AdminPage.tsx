"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Plus, Loader2, Users, UserCheck } from "lucide-react";

import { api, type Colaborator } from "@/services/api";
import { NewColaboratorDialog } from "./NewColaboratorDialog";

function formatDoc(value: string) {
  const d = value.replace(/\D/g, "");
  if (d.length === 11)
    return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  if (d.length === 14)
    return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  return value;
}

const AVATAR_COLORS = [
  { bg: "bg-blue-100 dark:bg-blue-900/40", text: "text-blue-700 dark:text-blue-300" },
  { bg: "bg-sky-100 dark:bg-sky-900/40", text: "text-sky-700 dark:text-sky-300" },
  { bg: "bg-indigo-100 dark:bg-indigo-900/40", text: "text-indigo-700 dark:text-indigo-300" },
  { bg: "bg-cyan-100 dark:bg-cyan-900/40", text: "text-cyan-700 dark:text-cyan-300" },
  { bg: "bg-violet-100 dark:bg-violet-900/40", text: "text-violet-700 dark:text-violet-300" },
  { bg: "bg-slate-100 dark:bg-slate-800/60", text: "text-slate-600 dark:text-slate-300" },
];

function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4 shadow-sm dark:bg-card sm:gap-4 sm:p-5">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 dark:bg-blue-950/40 sm:h-10 sm:w-10">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-semibold tabular-nums sm:text-2xl">{value}</p>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [items, setItems] = useState<Colaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listColaborators();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao carregar.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">

      
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="mb-1 font-mono text-xs uppercase tracking-widest text-blue-500">
            Administração
          </p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">
            Colaboradores
          </h1>
        </div>

        <button
          onClick={() => setDialogOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 active:scale-[0.98] sm:px-5"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Novo colaborador</span>
          <span className="sm:hidden">Novo</span>
        </button>
      </div>

      {!loading && !error && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4">
          <StatCard
            icon={<Users className="h-4 w-4 text-blue-500 sm:h-5 sm:w-5" />}
            label="Total"
            value={items.length}
          />
          <StatCard
            icon={<UserCheck className="h-4 w-4 text-blue-500 sm:h-5 sm:w-5" />}
            label="Ativos"
            value={items.length}
          />
        </div>
      )}

     
      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm dark:bg-card">

       
        <div className="hidden grid-cols-[1fr_1fr_auto] gap-6 border-b border-border px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground sm:grid">
          <span>Nome</span>
          <span>Documento</span>
          <span className="sr-only">Ações</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-20 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            Carregando…
          </div>
        ) : error ? (
          <div className="py-20 text-center text-sm text-destructive">{error}</div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 dark:bg-blue-950/40">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <p className="text-sm text-muted-foreground">Nenhum colaborador ainda.</p>
            <button
              onClick={() => setDialogOpen(true)}
              className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Adicionar o primeiro →
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {items.map((c, i) => {
              const color = avatarColor(c.name ?? String(i));
              const initials = (c.name ?? "?")
                .split(" ")
                .slice(0, 2)
                .map((w) => w[0]?.toUpperCase() ?? "")
                .join("");

              return (
                <li key={c.id ?? i} className="transition-colors hover:bg-muted/20">

         
                  <div className="flex items-center justify-between gap-3 px-4 py-4 sm:hidden">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-semibold ${color.bg} ${color.text}`}>
                        {initials}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-sm">{c.name}</p>
                        <p className="font-mono text-xs text-muted-foreground">{formatDoc(c.document ?? "")}</p>
                      </div>
                    </div>
                    <Link
                      href={`/admin/colaboradores/${c.id}`}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600 transition-colors hover:bg-blue-600 hover:text-white dark:bg-blue-950/40 dark:text-blue-400"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>

                
                  <div className="hidden grid-cols-[1fr_1fr_auto] items-center gap-6 px-6 py-5 sm:grid">
                    <div className="flex items-center gap-3">
                      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-semibold ${color.bg} ${color.text}`}>
                        {initials}
                      </span>
                      <span className="font-medium">{c.name}</span>
                    </div>

                    <span className="font-mono text-sm text-muted-foreground">
                      {formatDoc(c.document ?? "")}
                    </span>

                    <Link
                      href={`/admin/colaboradores/${c.id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-4 py-2 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-600 hover:text-white dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white"
                    >
                      Ver histórico
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                </li>
              );
            })}
          </ul>
        )}
      </div>

      <NewColaboratorDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={load}
      />
    </section>
  );
}