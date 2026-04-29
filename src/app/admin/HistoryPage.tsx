"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/services/api";
import { ArrowLeft, Loader2 } from "lucide-react";

type PointEntry = {
  id: string;
  createdAt: string;
};

function formatDate(date: Date) {
  return {
    day: date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    key: date.toLocaleDateString("pt-BR"),
  };
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-muted/50 px-4 py-3">
      <p className="mb-1 text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-medium">{value}</p>
    </div>
  );
}

export default function HistoryPage({ id }: { id: string }) {
  const [entries, setEntries] = useState<PointEntry[]>([]);
  const [name, setName] = useState("");
  const [document, setDocument] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function load() {
      try {
        const data = await api.getHistory(id);
        if (cancelled) return;
        setEntries(Array.isArray(data.points) ? data.points : []);
        setName(data.name ?? "");
        setDocument(data.document ?? "");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id]);

  const grouped = entries
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .reduce<Record<string, PointEntry[]>>((acc, e) => {
      const key = formatDate(new Date(e.createdAt)).key;
      (acc[key] ??= []).push(e);
      return acc;
    }, {});

  const totalDays = Object.keys(grouped).length;
  const avgPerDay =
    totalDays > 0 ? (entries.length / totalDays).toFixed(1) : "—";

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Carregando...
      </div>
    );
  }

  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-12">

      
      <Link
        href="/admin"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para admin
      </Link>

   
      <header className="mb-8 border-b border-border pb-6">
        <h1 className="text-3xl font-medium">{name}</h1>
        <p className="mt-1 font-mono text-sm text-muted-foreground">{document}</p>
      </header>

    
      <div className="mb-10 grid grid-cols-3 gap-3">
        <StatCard label="Total de marcações" value={entries.length} />
        <StatCard label="Dias com registro" value={totalDays} />
        <StatCard label="Média por dia" value={avgPerDay} />
      </div>

      
      {entries.length === 0 ? (
        <div className="rounded-2xl border border-border p-8 text-center text-muted-foreground">
          Nenhum ponto registrado
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([day, list]) => {
            const sample = formatDate(new Date(list[0].createdAt));

            return (
              <div key={day}>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium capitalize text-muted-foreground">
                    {sample.day}
                  </span>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                    {list.length} {list.length === 1 ? "marcação" : "marcações"}
                  </span>
                </div>

                <ul className="divide-y divide-border rounded-xl border border-border">
                  {list.map((e, i) => {
                    const t = formatDate(new Date(e.createdAt));
                    return (
                      <li
                        key={e.id ?? i}
                        className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-muted/40"
                      >
                        <span className="text-xl font-medium tabular-nums">
                          {t.time}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          #{String(i + 1).padStart(2, "0")}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}