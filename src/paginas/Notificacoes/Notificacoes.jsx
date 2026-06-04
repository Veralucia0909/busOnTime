import { useEffect, useState } from "react";
import {
  Bell, Bus, AlertTriangle, CheckCircle, TrendingUp, X, RotateCcw,
} from "lucide-react";
import { notifications as alertas } from "../../lib/mock-data";
import {
  buscarNotificacoesOcultas, ocultarNotificacao, restaurarNotificacoes,
} from "../../services/localStorageService";
import "./Notificacoes.css";

const iconesPorTipo = {
  approach:  Bus,
  crowding:  AlertTriangle,
  departure: CheckCircle,
  traffic:   TrendingUp,
};

export default function Notificacoes() {
  const [ocultas, setOcultas] = useState([]);

  useEffect(() => {
    setOcultas(buscarNotificacoesOcultas());
  }, []);

  function excluir(id) {
    ocultarNotificacao(id);
    setOcultas([...ocultas, id]);
  }

  function restaurar() {
    restaurarNotificacoes();
    setOcultas([]);
  }

  const visiveis = alertas.filter((a) => !ocultas.includes(a.id));

  return (
    <div className="pagina">

      <main className="conteudo">

        <div className="notif-cabecalho">
          <Bell size={28} style={{ color: "var(--primary)" }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 className="notif-titulo">Notificações</h1>
            <p className="notif-sub">Alertas em tempo real das suas linhas</p>
          </div>
          {ocultas.length > 0 && (
            <button
              type="button"
              className="btn btn-ghost btn-sm notif-restaurar"
              onClick={restaurar}
              title="Restaurar todas as notificações"
            >
              <RotateCcw size={14} /> Restaurar
            </button>
          )}
        </div>

        {visiveis.length === 0 ? (
          <div className="notif-vazio">
            <Bell size={40} />
            <h3>Nenhuma notificação</h3>
            <p>
              Você excluiu todas as suas notificações.
              Toque em "Restaurar" acima para vê-las novamente.
            </p>
          </div>
        ) : (
          <div className="notif-lista">
            {visiveis.map((alerta) => {
              const Icone = iconesPorTipo[alerta.type] || Bell;
              return (
                <div key={alerta.id} className="notif-item">
                  <div className={`notif-icone ${alerta.type}`}>
                    <Icone size={18} />
                  </div>
                  <div className="notif-corpo">
                    <div className="notif-linha">
                      <span className="notif-item-titulo">{alerta.title}</span>
                      <span className="notif-tempo">{alerta.time}</span>
                    </div>
                    <p className="notif-item-corpo">{alerta.body}</p>
                  </div>
                  <button
                    type="button"
                    className="notif-excluir"
                    onClick={() => excluir(alerta.id)}
                    aria-label="Excluir notificação"
                    title="Excluir notificação"
                  >
                    <X size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>

    </div>
  );
}
