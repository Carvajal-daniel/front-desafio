"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { api } from "@/services/api";

function formatCpf(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function NewColaboratorDialog({ open, onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [doc, setDoc] = useState("");
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (loading) return;

    if (!name.trim() || !doc.trim()) {
      toast.error("Preencha nome e documento.");
      return;
    }

    const cleanDoc = doc.replace(/\D/g, "");

    if (cleanDoc.length !== 11) {
      toast.error("Documento inválido", {
        description: "Informe um CPF válido com 11 dígitos.",
      });
      return;
    }

    setLoading(true);

    try {
      await api.createColaborator({
        name: name.trim(),
        document: cleanDoc,
      });

      toast.success("Colaborador cadastrado");

      setName("");
      setDoc("");

      onCreated();
      onClose();
    } catch (err) {
      toast.error("Falha ao cadastrar", {
        description:
          err instanceof Error ? err.message : "Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-lift animate-in zoom-in-95">

        {/* HEADER */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Novo colaborador
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Adicione alguém para registrar pontos.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted transition"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

       
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              Nome
            </label>

            <input
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Maria de Andrade"
              className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none transition focus:border-foreground focus:ring-1 focus:ring-foreground/20"
            />
          </div>

      
          <div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              CPF
            </label>

            <input
              value={doc}
              onChange={(e) => setDoc(formatCpf(e.target.value))}
              inputMode="numeric"
              maxLength={14}
              placeholder="000.000.000-00"
              className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm font-mono outline-none transition focus:border-foreground focus:ring-1 focus:ring-foreground/20"
            />

            
            <div className="mt-2 h-[2px] w-full bg-muted">
              <div
                className="h-full bg-foreground transition-all"
                style={{ width: `${(doc.length / 14) * 100}%` }}
              />
            </div>
          </div>

     
          <div className="flex items-center justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2.5 text-sm font-medium text-white shadow transition hover:opacity-90 disabled:opacity-60"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}