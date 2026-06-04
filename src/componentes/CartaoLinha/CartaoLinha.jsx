import { Link } from "react-router-dom";
import { Clock, Bus, Users, Heart } from "lucide-react";
import { statusOf, statusClass, statusLabel } from "../../lib/mock-data";
import { useFavorites } from "../../lib/use-favorites";
import "./CartaoLinha.css";

export default function CartaoLinha({ linha }) {
  const status = statusOf(linha.occupancy, linha.capacity);
  const porcentagem = Math.min(100, Math.round((linha.occupancy / linha.capacity) * 100));
  const { isFavorite, toggle } = useFavorites();
  const favorito = isFavorite(linha.id);

  return (
    <div className="cartao-linha">
      <div className="cartao-linha-cabecalho">
        <div className="cartao-linha-info">
          <div
            className="cartao-linha-badge"
            style={{ background: linha.color }}
          >
            {linha.code}
          </div>
          <div>
            <div className="cartao-linha-nome">{linha.name}</div>
            <div className="cartao-linha-rota">
              {linha.origin} → {linha.destination}
            </div>
          </div>
        </div>

        <button
          type="button"
          className={`btn-favorito${favorito ? " ativo" : ""}`}
          onClick={() => toggle(linha.id)}
          aria-label={favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Heart size={16} fill={favorito ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="cartao-linha-meta">
        <div className="cartao-linha-meta-item">
          <Clock size={16} /> em <strong>{linha.nextArrival} min</strong>
        </div>
        <div className="cartao-linha-meta-item">
          <Bus size={16} /> {linha.buses} ativos
        </div>
        <div className="cartao-linha-meta-item">
          <Users size={16} /> {linha.occupancy}/{linha.capacity}
        </div>
      </div>

      <div className="cartao-linha-ocupacao">
        <div className="cartao-linha-ocupacao-cabecalho">
          <span className="ocupacao-rotulo">Ocupação</span>
          <span className={`pill-status ${statusClass[status]}`}>
            {statusLabel[status]}
          </span>
        </div>
        <div className="progress-bar">
          <div
            className={`progress-fill ${statusClass[status]}`}
            style={{ width: `${porcentagem}%` }}
          />
        </div>
      </div>
    </div>
  );
}
