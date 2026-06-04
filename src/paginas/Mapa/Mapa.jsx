import { useState } from "react";
import { AlertTriangle, Navigation, MapPin } from "lucide-react";
import CartaoLinha from "../../componentes/CartaoLinha/CartaoLinha";
import MapaView from "../../componentes/MapaView/MapaView";
import { lines as linhas } from "../../lib/mock-data";
import "./Mapa.css";

export default function Mapa() {
  const [localizacao, setLocalizacao] = useState(null);

  function usarMinhaLocalizacao() {
    if (!navigator.geolocation) {
      alert("GPS não disponível neste navegador.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocalizacao({
        lat: pos.coords.latitude.toFixed(5),
        lng: pos.coords.longitude.toFixed(5),
      }),
      () => alert("Não foi possível obter sua localização.")
    );
  }

  return (
    <div className="pagina">

      <main className="conteudo">

        {/* Cabeçalho */}
        <div className="mapa-pagina-cabecalho">
          <div>
            <h1 className="mapa-pagina-titulo">Mapa em tempo real</h1>
            <p className="mapa-pagina-sub">
              Pontos de ônibus, terminais e rotas · OpenStreetMap
            </p>
          </div>
        </div>

        {/* Mapa */}
        <div style={{ marginTop: "1.5rem" }}>
          <MapaView altura={560} zoom={11} />
        </div>

        {/* Localização atual */}
        {localizacao && (
          <div className="mapa-localizacao">
            <MapPin size={18} />
            <div>
              <strong>Sua localização atual</strong>
              <div className="mapa-localizacao-coords">
                Lat: {localizacao.lat} · Lng: {localizacao.lng}
              </div>
            </div>
          </div>
        )}

        {/* Alerta de trânsito */}
        <div className="mapa-alerta">
          <AlertTriangle size={20} />
          <div className="mapa-alerta-texto">
            <strong>Trânsito na SC-401 (Saco Grande):</strong>{" "}
            lentidão detectada via Waze. Tempo de chegada recalculado para 3 linhas.
          </div>
        </div>

        {/* Botão GPS */}
        <div style={{ marginTop: "0.75rem" }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={usarMinhaLocalizacao}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem" }}
          >
            <Navigation size={14} /> Usar minha localização
          </button>
        </div>

        {/* Linhas circulando */}
        <section style={{ marginTop: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Navigation size={20} style={{ color: "var(--primary)" }} />
            <h2 className="secao-titulo">Linhas circulando agora</h2>
          </div>
          <div className="grade-linhas" style={{ marginTop: "1rem" }}>
            {linhas.map((l) => (
              <CartaoLinha key={l.id} linha={l} />
            ))}
          </div>
        </section>

      </main>

    </div>
  );
}
