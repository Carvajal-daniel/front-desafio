
const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8044").replace(/\/$/, "");

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  // Garante que o path comece com /
  const url = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
   
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || "Erro na requisição");
  }

  if (res.status === 204) return {} as T;

  return res.json();
}


export type Colaborator = {
  id: string;
  name: string;
  document: string;
};

export type PointEntry = {
  id: string;
  createdAt: string;
};

export interface HistoryResponse {
  name: string;
  document: string;
  points: PointEntry[];
}


export const api = {
  listColaborators: () => 
    request<Colaborator[]>("/colaborators"),

  createColaborator: (data: { name: string; document: string }) =>
    request<Colaborator>("/colaborators", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  registerPoint: (document: string) =>
    request<PointEntry>("/points", {
      method: "POST",
      body: JSON.stringify({ document }),
    }),

  getHistory: (id: string) =>
    request<HistoryResponse>(`/colaborators/${id}/history`),
};