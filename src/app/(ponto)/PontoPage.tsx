"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Clock } from "lucide-react";
import { api } from "@/services/api";

function formatDocument(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function LiveClock() {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  );

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="font-mono text-4xl font-semibold tabular-nums text-blue-600 dark:text-blue-400 sm:text-5xl">
      {time}
    </span>
  );
}

export default function PontoPage() {
  const [doc, setDoc] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastSuccess, setLastSuccess] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const now = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    const clean = doc.replace(/\D/g, "");

    if (clean.length !== 11) {
      toast.error("Documento inválido", {
        description: "Informe um CPF válido com 11 dígitos.",
      });
      return;
    }

    setLoading(true);

    try {
      await api.registerPoint(clean);

      const time = new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      setLastSuccess(time);
      toast.success("Ponto registrado", { description: `Registrado às ${time}` });
      setDoc("");
      inputRef.current?.focus();
    } catch (err) {
      toast.error("Erro ao registrar", {
        description:
          err instanceof Error ? err.message : "Tente novamente em instantes.",
      });
    } finally {
      setLoading(false);
    }
  }

  const digits = doc.replace(/\D/g, "");
  const progress = Math.min((digits.length / 11) * 100, 100);
  const filled = digits.length === 11;

  return (
    <section className="mx-auto flex  max-w-lg flex-col items-center justify-center px-5 py-10 text-center">

   
      <div className="mb-2 flex items-center gap-2">
        <Clock className="h-4 w-4 text-blue-400" />
        <LiveClock />
      </div>

      
      <p className="mb-6 font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground capitalize">
        {now}
      </p>

      <h1 className="text-balance text-3xl font-semibold leading-tight sm:text-4xl">
        Registre seu ponto
        <span className="block italic text-blue-600 dark:text-blue-400">
          em segundos.
        </span>
      </h1>

      <p className="mt-3 max-w-sm text-sm text-muted-foreground">
        Digite seu CPF. O ponto ser&aacute; registrado instantaneamente.
      </p>

      
      {lastSuccess && (
        <div className="mt-5 flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 animate-in fade-in dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Último ponto registrado às {lastSuccess}
        </div>
      )}

     
      <form
        onSubmit={handleSubmit}
        className="mt-8 w-full overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm dark:border-blue-900/40 dark:bg-card"
      >
        {/* Faixa azul no topo */}
        <div className="border-b border-blue-100 bg-blue-50 px-6 py-3 dark:border-blue-900/40 dark:bg-blue-950/30">
          <p className="text-left font-mono text-[11px] uppercase tracking-[0.18em] text-blue-500 dark:text-blue-400">
            CPF / Documento
          </p>
        </div>

        <div className="p-6">
          <input
            ref={inputRef}
            id="document"
            inputMode="numeric"
            autoComplete="off"
            maxLength={14}
            value={doc}
            onChange={(e) => setDoc(formatDocument(e.target.value))}
            placeholder="000.000.000-00"
            className="w-full bg-transparent text-center font-mono text-3xl tracking-tight text-foreground outline-none placeholder:text-muted-foreground/25 sm:text-4xl"
          />

          
          <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-blue-50 dark:bg-blue-950/40">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                filled ? "bg-blue-600" : "bg-blue-300 dark:bg-blue-700"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-1.5 flex items-center justify-between">
            <span className="font-mono text-[11px] text-muted-foreground">
              {filled ? "✓ CPF completo" : "Preencha os 11 dígitos"}
            </span>
            <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
              {digits.length}/11
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-medium text-white transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 sm:py-4"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Registrando…
              </>
            ) : (
              "Registrar ponto"
            )}
          </button>
        </div>
      </form>

      <p className="mt-6 text-xs text-muted-foreground">
        Seus dados são usados apenas para registro de presença.
      </p>
    </section>
  );
}