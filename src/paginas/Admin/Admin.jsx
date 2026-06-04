import { Link } from "react-router-dom";
import {
  ArrowLeft, Bus, Shield, TrendingUp,
  AlertTriangle, Activity,
} from "lucide-react";
import { lines as linhas } from "../../lib/mock-data";
import { statusOf, statusClass, statusLabel } from "../../lib/mock-data";
import "./Admin.css";

const kpis = [
  { rotulo: "Ônibus ativos",    valor: "23",   tendencia: "+2",  positivo: true },
  { rotulo: "Passageiros hoje", valor: "4.821", tendencia: "+8%", positivo: true },
  { rotulo: "Atrasos",          valor: "3",    tendencia: "-1",  positivo: true },
  { rotulo: "Lotação média",    valor: "64%",  tendencia: "+4%", positivo: false },
];

const eventos = [
  { hora: "14:32", texto: "Linha 210 partiu do TICEN no horário",    tag: "normal" },
  { hora: "14:28", texto: "Reforço acionado na Linha 115 — lotação", tag: "alerta" },
  { hora: "14:15", texto: "Linha 330 com atraso de 4 min (trânsito)",tag: "aviso" },
  { hora: "14:00", texto: "Linha 410 partiu do TIRIO",               tag: "normal" },
];

export default function Admin() {
  return (
    <div className="admin-pagina">

      {/* Topbar */}
      <div className="admin-topbar">
        <div className="admin-topbar-inner">
          <div className="admin-topbar-esquerda">
            <Link to="/" className="admin-voltar">
              <ArrowLeft size={18} />
            </Link>
            <div className="admin-divisor" />
            <div className="admin-marca">
              <div className="admin-icone">
                <Shield size={16} />
              </div>
              <div>
                <div className="admin-titulo">Painel da Empresa</div>
                <div className="admin-sub">BusOnTime Floripa</div>
              </div>
            </div>
          </div>
          <div className="admin-status-ativo">
            <span
              className="animate-pulse"
              style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--status-free)", display: "inline-block" }}
            />
            Sistema operacional
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <main className="admin-conteudo">

        {/* Cabeçalho */}
        <div className="admin-cabecalho">
          <div>
            <h1 className="admin-cabecalho-titulo">Dashboard Operacional</h1>
            <p className="admin-cabecalho-sub">Monitoramento em tempo real da frota</p>
          </div>
        </div>

        {/* KPIs */}
        <div className="admin-grade-kpi">
          {kpis.map((kpi) => (
            <div key={kpi.rotulo} className="admin-kpi">
              <div className="admin-kpi-cabecalho">
                <div className="admin-kpi-icone">
                  <Activity size={18} />
                </div>
                <span
                  className="admin-kpi-tendencia"
                  style={{ color: kpi.positivo ? "var(--status-free)" : "var(--status-almost)" }}
                >
                  {kpi.tendencia}
                </span>
              </div>
              <div className="admin-kpi-valor">{kpi.valor}</div>
              <div className="admin-kpi-rotulo">{kpi.rotulo}</div>
            </div>
          ))}
        </div>

        {/* Alertas de lotação */}
        <section className="admin-secao-alertas">
          <div className="admin-secao-alertas-cabecalho">
            <AlertTriangle size={20} style={{ color: "var(--coral)" }} />
            <h2 className="admin-secao-titulo">Alertas de lotação</h2>
            <span className="admin-badge-alertas">
              {linhas.filter((l) => statusOf(l.occupancy, l.capacity) !== "free").length}
            </span>
          </div>

          {linhas
            .filter((l) => statusOf(l.occupancy, l.capacity) !== "free")
            .map((l) => {
              const status = statusOf(l.occupancy, l.capacity);
              return (
                <div key={l.id} className="admin-alerta-item">
                  <div className="admin-alerta-badge" style={{ background: l.color }}>
                    {l.code}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{l.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--fg-muted)" }}>
                      {l.origin} → {l.destination}
                    </div>
                  </div>
                  <span className={`pill-status ${statusClass[status]}`}>
                    {statusLabel[status]}
                  </span>
                  <div style={{ fontSize: "0.875rem", color: "var(--fg-muted)" }}>
                    {l.occupancy}/{l.capacity}
                  </div>
                </div>
              );
            })}
        </section>

        {/* Grade frota + eventos */}
        <div className="admin-grade-inferior">

          {/* Tabela da frota */}
          <div className="admin-card-frota">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <Bus size={20} style={{ color: "var(--primary)" }} />
              <h2 className="admin-card-titulo">Frota em operação</h2>
            </div>

            {/* Versão desktop: tabela */}
            <div className="admin-tabela-wrap">
              <table className="admin-tabela">
                <thead>
                  <tr>
                    <th>Linha</th>
                    <th>Ônibus</th>
                    <th>Ocupação</th>
                    <th>Próximo</th>
                  </tr>
                </thead>
                <tbody>
                  {linhas.map((l) => {
                    const pct = Math.round((l.occupancy / l.capacity) * 100);
                    const status = statusOf(l.occupancy, l.capacity);
                    return (
                      <tr key={l.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <div className="admin-tabela-badge" style={{ background: l.color }}>
                              {l.code}
                            </div>
                            <span style={{ fontSize: "0.875rem" }}>{l.name}</span>
                          </div>
                        </td>
                        <td>{l.buses}</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <div className="admin-barra-ocupacao">
                              <div
                                className={`progress-fill ${statusClass[status]}`}
                                style={{ width: `${pct}%`, height: "100%", borderRadius: "var(--r-full)" }}
                              />
                            </div>
                            <span style={{ fontSize: "0.75rem" }}>{pct}%</span>
                          </div>
                        </td>
                        <td style={{ fontSize: "0.875rem" }}>{l.nextArrival} min</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Versão mobile: cards */}
            <div className="admin-frota-cards">
              {linhas.map((l) => {
                const pct = Math.round((l.occupancy / l.capacity) * 100);
                const status = statusOf(l.occupancy, l.capacity);
                return (
                  <div key={l.id} className="admin-frota-card">
                    <div className="admin-frota-card-cabecalho">
                      <div className="admin-tabela-badge" style={{ background: l.color }}>
                        {l.code}
                      </div>
                      <div className="admin-frota-card-nome">{l.name}</div>
                      <span className={`pill-status ${statusClass[status]}`}>
                        {statusLabel[status]}
                      </span>
                    </div>
                    <div className="admin-frota-card-ocupacao">
                      <div className="admin-frota-card-ocupacao-info">
                        <span>Ocupação</span>
                        <strong>{pct}% ({l.occupancy}/{l.capacity})</strong>
                      </div>
                      <div className="admin-frota-card-barra">
                        <div
                          className={`progress-fill ${statusClass[status]}`}
                          style={{ width: `${pct}%`, height: "100%", borderRadius: "var(--r-full)" }}
                        />
                      </div>
                    </div>
                    <div className="admin-frota-card-rodape">
                      <span>Ônibus: <strong>{l.buses}</strong></span>
                      <span>Próximo: <strong>{l.nextArrival} min</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Log de eventos */}
          <div className="admin-card-eventos">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <TrendingUp size={20} style={{ color: "var(--primary)" }} />
              <h2 className="admin-card-titulo">Eventos recentes</h2>
            </div>
            <div className="admin-eventos-lista">
              {eventos.map((ev, i) => (
                <div key={i} className="admin-evento-item">
                  <span className="admin-evento-hora">{ev.hora}</span>
                  <div>
                    <div className="admin-evento-texto">{ev.texto}</div>
                    <span className={`admin-evento-tag admin-evento-tag-${ev.tag}`}>
                      {ev.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
