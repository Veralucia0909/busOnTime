import { useEffect, useState } from "react";
import {
  Bell, ChevronRight, Clock, HelpCircle,
  LogOut, MapPin, Moon, Plus, Trash2, TrendingUp, Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../contexto/AppContext";
import { lines as linhas } from "../../lib/mock-data";
import { useFavorites } from "../../lib/use-favorites";
import {
  buscarConfiguracoes, atualizarConfiguracao,
} from "../../services/localStorageService";
import "./Perfil.css";

export default function Perfil() {
  const { usuarioLogado, fazerLogout, alternarModoEscuro } = useApp();
  const { favorites, toggle, remove } = useFavorites();
  const [adicionando, setAdicionando] = useState(false);
  const [config, setConfig] = useState({ notificacoes: true, localizacao: true, modoEscuro: true });
  const navigate = useNavigate();

  useEffect(() => {
    setConfig(buscarConfiguracoes());
  }, []);

  function alterarConfig(chave, valor) {
    const novo = { ...config, [chave]: valor };
    setConfig(novo);
    // Modo escuro: propaga ao contexto pra aplicar no <html> imediatamente
    if (chave === "modoEscuro") {
      alternarModoEscuro(valor);
    } else {
      atualizarConfiguracao(chave, valor);
    }
  }

  const linhasFavoritas = linhas.filter((l) => favorites.includes(l.id));
  const outrasLinhas    = linhas.filter((l) => !favorites.includes(l.id));

  const inicial = usuarioLogado?.nome
    ? usuarioLogado.nome.charAt(0).toUpperCase()
    : "U";

  function handleSair() {
    fazerLogout();
    navigate("/login");
  }

  return (
    <div className="pagina">

      <main className="conteudo">

        {/* Cabeçalho do perfil */}
        <div className="perfil-cabecalho">
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <div className="perfil-avatar-wrap">
              <div className="perfil-avatar">{inicial}</div>
              <div className="perfil-avatar-badge">✓</div>
            </div>
            <div style={{ minWidth: 0 }}>
              <div className="perfil-nome">{usuarioLogado?.nome || "Usuário"}</div>
              <div className="perfil-email">{usuarioLogado?.email || "usuario@email.com"}</div>
              <div className="perfil-badge-frequente">
                <TrendingUp size={12} style={{ color: "var(--accent)" }} /> Usuário Frequente
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="perfil-stats">
          <div className="perfil-stat">
            <div className="perfil-stat-valor">147</div>
            <div className="perfil-stat-rotulo">Viagens</div>
          </div>
          <div className="perfil-stat">
            <div className="perfil-stat-valor">{linhasFavoritas.length || 2}</div>
            <div className="perfil-stat-rotulo">Favoritos</div>
          </div>
          <div className="perfil-stat">
            <div className="perfil-stat-valor">28h</div>
            <div className="perfil-stat-rotulo">Economizadas</div>
          </div>
        </div>

        {/* Linhas favoritas */}
        <div className="perfil-favoritos">
          <div className="perfil-favoritos-cabecalho">
            <div>
              <div className="perfil-favoritos-titulo">Linhas favoritas</div>
              <div className="perfil-favoritos-sub">Alertas automáticos de chegada</div>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setAdicionando((v) => !v)}
            >
              <Plus size={12} /> {adicionando ? "Concluir" : "Adicionar"}
            </button>
          </div>

          {linhasFavoritas.length === 0 ? (
            <div className="perfil-favoritos-vazio">
              Nenhuma linha favorita. Clique em <strong>Adicionar</strong>.
            </div>
          ) : (
            <ul className="perfil-favoritos-lista">
              {linhasFavoritas.map((l) => (
                <li key={l.id} className="perfil-favorito-item">
                  <div
                    className="perfil-favorito-badge"
                    style={{ background: l.color }}
                  >
                    {l.code}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="perfil-favorito-nome">{l.name}</div>
                    <div className="perfil-favorito-rota">
                      {l.origin} → {l.destination}
                    </div>
                  </div>
                  <div className="perfil-favorito-tempo">
                    <Clock size={12} /> {l.nextArrival} min
                  </div>
                  <button
                    className="btn-remover"
                    onClick={() => remove(l.id)}
                    aria-label="Remover favorito"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {adicionando && (
            <div className="perfil-adicionar">
              <div className="perfil-adicionar-rotulo">Adicionar linha</div>
              {outrasLinhas.length === 0 ? (
                <p style={{ fontSize: "0.875rem", color: "var(--fg-muted)" }}>
                  Todas as linhas já estão nos favoritos.
                </p>
              ) : (
                <div className="perfil-adicionar-grade">
                  {outrasLinhas.map((l) => (
                    <button
                      key={l.id}
                      className="perfil-adicionar-btn"
                      onClick={() => toggle(l.id)}
                    >
                      <div
                        className="perfil-adicionar-badge"
                        style={{ background: l.color }}
                      >
                        {l.code}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="perfil-adicionar-nome">{l.name}</div>
                        <div className="perfil-adicionar-rota">
                          {l.origin} → {l.destination}
                        </div>
                      </div>
                      <Plus size={16} style={{ color: "var(--primary)", flexShrink: 0 }} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Configurações */}
        <div className="perfil-configuracoes">
          <LinhaToggle
            Icone={Bell}
            rotulo="Notificações"
            sub="Alertas de chegada e lotação"
            valor={config.notificacoes}
            aoMudar={(v) => alterarConfig("notificacoes", v)}
          />
          <LinhaToggle
            Icone={MapPin}
            rotulo="Localização"
            sub="Para ônibus próximos a você"
            valor={config.localizacao}
            aoMudar={(v) => alterarConfig("localizacao", v)}
          />
          <LinhaToggle
            Icone={Moon}
            rotulo="Modo Escuro"
            sub="Tema atual do aplicativo"
            valor={config.modoEscuro}
            aoMudar={(v) => alterarConfig("modoEscuro", v)}
          />
          <LinhaLink Icone={Wallet}     rotulo="Métodos de Pagamento" para="/carteira" />
          <LinhaLink Icone={HelpCircle} rotulo="Ajuda e Suporte"      para="/ajuda" ultimo />
        </div>

        {/* Botão de sair */}
        <button className="btn-sair" onClick={handleSair}>
          <LogOut size={16} /> Sair da conta
        </button>

      </main>

    </div>
  );
}

function LinhaToggle({ Icone, rotulo, sub, valor, aoMudar }) {
  return (
    <label className="perfil-config-linha" style={{ cursor: "pointer" }}>
      <Icone size={20} />
      <div className="perfil-config-info">
        <div className="perfil-config-rotulo">{rotulo}</div>
        <div className="perfil-config-sub">{sub}</div>
      </div>
      <button
        className={`toggle${valor ? " on" : ""}`}
        onClick={(e) => { e.preventDefault(); aoMudar(!valor); }}
      />
    </label>
  );
}

function LinhaLink({ Icone, rotulo, para, ultimo }) {
  const navigate = useNavigate();
  return (
    <button
      className="perfil-config-linha"
      onClick={() => navigate(para)}
      style={{ borderBottom: ultimo ? "none" : undefined }}
    >
      <Icone size={20} />
      <div className="perfil-config-info">
        <div className="perfil-config-rotulo">{rotulo}</div>
      </div>
      <ChevronRight size={16} style={{ color: "var(--fg-muted)" }} />
    </button>
  );
}
