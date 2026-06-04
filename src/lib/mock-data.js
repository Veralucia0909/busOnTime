export function statusOf(occ, cap) {
  const pct = occ / cap;
  if (pct < 0.5) return "free";
  if (pct < 0.8) return "moderate";
  if (occ >= cap - 10 && occ < cap) return "almost";
  if (pct >= 1) return "full";
  return "almost";
}

export const statusLabel = {
  free: "Livre",
  moderate: "Moderado",
  almost: "Quase lotado",
  full: "Lotado",
};

export const statusClass = {
  free: "free",
  moderate: "moderate",
  almost: "almost",
  full: "full",
};

export const lines = [
  { id: "210", code: "210", name: "TICEN → UFSC", color: "#0e7c8a", origin: "TICEN", destination: "UFSC Trindade", nextArrival: 3, capacity: 60, occupancy: 22, buses: 4, favorite: true },
  { id: "330", code: "330", name: "Lagoa da Conceição", color: "#d97757", origin: "TILAG", destination: "Centrinho da Lagoa", nextArrival: 7, capacity: 60, occupancy: 51, buses: 3, favorite: true },
  { id: "180", code: "180", name: "Canasvieiras Direto", color: "#2d5fa8", origin: "TICAN", destination: "Centro", nextArrival: 12, capacity: 70, occupancy: 68, buses: 2 },
  { id: "410", code: "410", name: "Ingleses Executivo", color: "#5b3fb0", origin: "TIRIO", destination: "Praia dos Ingleses", nextArrival: 18, capacity: 50, occupancy: 14, buses: 5 },
];

export const trips = [
  { id: "t1", line: "210", date: "Hoje, 14:32", fare: 7.70, from: "TICEN", to: "UFSC" },
  { id: "t2", line: "330", date: "Hoje, 09:14", fare: 7.70, from: "Centro", to: "Lagoa" },
  { id: "t3", line: "180", date: "Ontem, 18:42", fare: 7.70, from: "TICAN", to: "Centro" },
  { id: "t4", line: "115", date: "Ontem, 07:55", fare: 7.70, from: "TICEN", to: "Saco dos Limões" },
];

export const notifications = [
  { id: "n1", type: "approach",  title: "Linha 210 chegando",       body: "Seu ônibus está a 2 paradas. Tempo estimado: 3 min.", time: "agora" },
  { id: "n2", type: "crowding",  title: "Atenção: Linha 115 lotada", body: "Reforço de frota acionado automaticamente.",          time: "5 min" },
  { id: "n3", type: "departure", title: "Saída confirmada",          body: "Linha 330 saiu do TILAG no horário.",                 time: "12 min" },
  { id: "n4", type: "traffic",   title: "Trânsito na SC-401",        body: "Lentidão detectada via Waze. Tempo recalculado.",     time: "23 min" },
];
