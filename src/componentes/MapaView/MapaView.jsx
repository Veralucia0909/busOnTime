import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { busStops, FLORIPA_CENTER } from "../../lib/bus-stops";
import { lines as linhas } from "../../lib/mock-data";
import "./MapaView.css";

/**
 * MapaView — mapa interativo de Florianópolis.
 *
 * Mostra:
 *  - Paradas e terminais com marcadores (popup com info da linha ao clicar)
 *  - Filtragem opcional para destacar apenas algumas paradas
 *
 * As linhas/rotas NÃO são desenhadas como polylines — em escala de cidade
 * elas ficam com aspecto de "linhas retas conectando pontos distantes",
 * o que confunde mais do que ajuda. Os marcadores carregam toda a
 * informação no popup.
 */
export default function MapaView({ altura = 420, apenasParadas, zoom = 11 }) {
  const refMapa = useRef(null);
  const instanciaRef = useRef(null);

  useEffect(() => {
    if (!refMapa.current || instanciaRef.current) return;

    const mapa = L.map(refMapa.current, {
      center: [FLORIPA_CENTER.lat, FLORIPA_CENTER.lng],
      zoom,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(mapa);

    instanciaRef.current = mapa;

    // ---------- Marcadores das paradas/terminais --------------------
    const paradasVisiveis = apenasParadas
      ? busStops.filter((p) => apenasParadas.includes(p.id))
      : busStops;

    paradasVisiveis.forEach((parada) => {
      const ehTerminal = parada.type === "terminal";
      const tamanho = ehTerminal ? 22 : 14;

      const icone = L.divIcon({
        className: "",
        html: `<div style="
          width:${tamanho}px;height:${tamanho}px;border-radius:50%;
          background:${ehTerminal ? "#d97757" : "#0e7c8a"};
          border:${ehTerminal ? "3px" : "2px"} solid white;
          box-shadow:0 1px 4px rgba(0,0,0,0.4);
        "></div>`,
        iconSize: [tamanho, tamanho],
        iconAnchor: [tamanho / 2, tamanho / 2],
      });

      const linhasHtml = parada.lines
        .map((codigo) => {
          const linhaInfo = linhas.find((l) => l.code === codigo);
          const cor = linhaInfo?.color || "#0e7c8a";
          return `<span style="background:${cor};color:#fff;border-radius:999px;padding:2px 8px;font-size:10px;font-weight:600;display:inline-block;margin:1px">Linha ${codigo}</span>`;
        })
        .join("");

      const popup = L.popup({ offset: [0, -8] }).setContent(
        `<div style="font-family:system-ui;padding:4px 6px;min-width:160px">
          <div style="font-weight:700;font-size:13px;color:#0e7c8a">${parada.name}</div>
          <div style="font-size:11px;color:#555;margin-top:2px">${ehTerminal ? "Terminal de integração" : "Ponto de ônibus"}</div>
          <div style="margin-top:6px;display:flex;gap:4px;flex-wrap:wrap">${linhasHtml}</div>
        </div>`
      );

      L.marker([parada.lat, parada.lng], { icon: icone })
        .addTo(mapa)
        .bindPopup(popup);
    });

    return () => {
      mapa.remove();
      instanciaRef.current = null;
    };
  }, [apenasParadas, zoom]);

  return (
    <div className="mapa-view" style={{ height: altura }}>
      <div ref={refMapa} className="mapa-view-container" />
      <div className="mapa-view-legenda">
        Florianópolis · {busStops.length} pontos mapeados
      </div>
      <div className="mapa-view-tipos">
        <span className="mapa-view-tipo-item">
          <span className="mapa-ponto" style={{ width: 10, height: 10, background: "#d97757" }} />
          Terminal
        </span>
        <span className="mapa-view-tipo-item">
          <span className="mapa-ponto" style={{ width: 8, height: 8, background: "#0e7c8a" }} />
          Parada
        </span>
      </div>
    </div>
  );
}
