/* ================================================================
   SmartBus Floripa — Constantes Globais
   Use estas constantes ao invés de números mágicos no código.
   ================================================================ */

export const TARIFA = 7.70;          // valor da passagem
export const TARIFA_FORMATADA = "R$ 7,70";

export const RECARGA_MIN = 5;        // valor mínimo de recarga
export const RECARGA_MAX = 500;      // valor máximo de recarga

export function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(valor) || 0);
}

export function formatarData(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}
