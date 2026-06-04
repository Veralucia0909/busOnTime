import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bus, Clock, Heart, MapPin, Search, Wallet, SearchX } from "lucide-react";
import CartaoLinha from "../../componentes/CartaoLinha/CartaoLinha";
import MapaView from "../../componentes/MapaView/MapaView";
import AvatarUsuario from "../../componentes/AvatarUsuario/AvatarUsuario";
import { useApp } from "../../contexto/AppContext";
import { lines as linhas } from "../../lib/mock-data";
import { busStops as paradas } from "../../lib/bus-stops";
import { useFavorites } from "../../lib/use-favorites";
import { buscarSaldo } from "../../services/localStorageService";
import { formatarMoeda } from "../../lib/constantes";
import "./Home.css";

/**
 * Normaliza texto: remove acentos, baixa case, espaços extras.
 * Permite buscar "ufsc" e encontrar "UFSC", "ingleses" e "Inglêses", etc.
 */
function normalizar(s) {
  return (s || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export default function Home() {
  const { usuarioLogado } = useApp();
  const { favorites } = useFavorites();
  const [busca, setBusca] = useState("");
  const [saldo, setSaldo] = useState(0);

  useEffect(() => {
    setSaldo(buscarSaldo());
  }, []);

  const linhasFavoritas = linhas.filter((l) => favorites.includes(l.id));
  const linhasNaoFavoritas = linhas.filter((l) => !favorites.includes(l.id));
  const totalOnibus = linhas.reduce((acc, l) => acc + l.buses, 0);

  // Pesquisa: filtra linhas por código/nome/origem/destino e paradas por nome
  const termo = normalizar(busca);
  const buscando = termo.length > 0;

  const linhasFiltradas = useMemo(() => {
    if (!buscando) return [];
    return linhas.filter((l) => {
      const campos = [l.code, l.name, l.origin, l.destination].map(normalizar);
      return campos.some((c) => c.includes(termo));
    });
  }, [termo, buscando]);

  const paradasFiltradas = useMemo(() => {
    if (!buscando) return [];
    return paradas.filter((p) => {
      const campos = [p.name, ...(p.lines || [])].map(normalizar);
      return campos.some((c) => c.includes(termo));
    });
  }, [termo, buscando]);

  const semResultados = buscando &&
    linhasFiltradas.length === 0 &&
    paradasFiltradas.length === 0;

  const nomeUsuario = usuarioLogado?.nome
    ? usuarioLogado.nome.split(" ")[0]
    : "Usuário";

  return (
    <div className="pagina">

      <main className="conteudo">

        {/* Saudação */}
        <div className="home-saudacao">
          <div>
            <p className="home-saudacao-muted">Bom dia,</p>
            <h1 className="home-saudacao-nome">
              Olá, {nomeUsuario} <span role="img" aria-label="sol">🌤</span>
            </h1>
            <p className="home-saudacao-local">
              <MapPin size={12} /> Florianópolis, SC
            </p>
          </div>
          <AvatarUsuario />
        </div>

        {/* Busca */}
        <form
          className="input-wrap home-busca-form"
          onSubmit={(e) => e.preventDefault()}
          role="search"
        >
          <button
            type="submit"
            className="home-busca-botao"
            aria-label="Buscar"
            title="Buscar"
          >
            <Search size={16} />
          </button>
          <input
            className="input"
            placeholder="Buscar linha, parada, bairro..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            aria-label="Buscar"
          />
          {busca && (
            <button
              type="button"
              className="home-busca-limpar"
              onClick={() => setBusca("")}
              aria-label="Limpar busca"
            >
              ×
            </button>
          )}
        </form>

        {/* Resultados de pesquisa */}
        {buscando && (
          <section className="home-resultados" style={{ marginTop: "1.5rem" }}>
            <div className="home-resultados-cabecalho">
              <h2 className="secao-titulo">
                Resultados para "<span style={{ color: "var(--primary)" }}>{busca}</span>"
              </h2>
              <span className="home-resultados-contagem">
                {linhasFiltradas.length + paradasFiltradas.length} encontrado
                {linhasFiltradas.length + paradasFiltradas.length !== 1 ? "s" : ""}
              </span>
            </div>

            {semResultados && (
              <div className="home-sem-resultados">
                <SearchX size={40} />
                <h3>Nada encontrado</h3>
                <p>
                  Não achamos nada para "<strong>{busca}</strong>". Tente buscar por código
                  da linha (ex: 210), bairro (ex: Lagoa) ou nome de terminal (ex: TICEN).
                </p>
              </div>
            )}

            {linhasFiltradas.length > 0 && (
              <>
                <h3 className="home-resultados-subtitulo">
                  Linhas ({linhasFiltradas.length})
                </h3>
                <div className="grade-linhas">
                  {linhasFiltradas.map((l) => (
                    <CartaoLinha key={l.id} linha={l} />
                  ))}
                </div>
              </>
            )}

            {paradasFiltradas.length > 0 && (
              <>
                <h3 className="home-resultados-subtitulo" style={{ marginTop: "1.5rem" }}>
                  Paradas e terminais ({paradasFiltradas.length})
                </h3>
                <div className="home-paradas-lista">
                  {paradasFiltradas.map((p) => (
                    <Link key={p.id} to="/mapa" className="home-parada-item">
                      <div className="home-parada-icone">
                        <MapPin size={18} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="home-parada-nome">{p.name}</div>
                        <div className="home-parada-meta">
                          {p.type === "terminal" ? "Terminal" : "Parada"}
                          {p.lines && p.lines.length > 0 && (
                            <> · Linhas {p.lines.join(", ")}</>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </section>
        )}

        {/* Conteúdo padrão (só aparece quando não há busca) */}
        {!buscando && (
          <>
            {/* Cards de estatísticas */}
            <div className="home-grade-stats">
              <CardEstatistica
                valor={String(totalOnibus)}
                rotulo="Ônibus Ativos"
                sub="agora em circulação"
                gradiente="bg-gradient-ocean"
                Icone={Bus}
              />
              <CardEstatistica
                valor="8 min"
                rotulo="Espera Média"
                sub="próximo ônibus"
                gradiente="bg-gradient-sunset"
                Icone={Clock}
              />
              <CardEstatistica
                valor={String(linhasFavoritas.length || 2)}
                rotulo="Linhas Favoritas"
                sub="com alertas ativos"
                gradiente="bg-primary"
                Icone={Heart}
              />
              <CardEstatistica
                valor={formatarMoeda(saldo)}
                rotulo="Saldo Passe"
                sub="Passe Floripa"
                gradiente="bg-ocean"
                Icone={Wallet}
              />
            </div>

            {/* Linhas favoritas - aparecem primeiro */}
            {linhasFavoritas.length > 0 && (
              <section style={{ marginTop: "2rem" }}>
                <div className="home-secao-cabecalho">
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <h2 className="secao-titulo">Suas linhas favoritas</h2>
                    <span className="badge-ao-vivo">
                      <span
                        className="animate-pulse"
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "var(--status-free)",
                          display: "inline-block",
                        }}
                      />
                      AO VIVO
                    </span>
                  </div>
                  <Link to="/mapa" className="home-link-ver-todos">
                    Ver no mapa →
                  </Link>
                </div>
                <div className="grade-linhas" style={{ marginTop: "1rem" }}>
                  {linhasFavoritas.map((l) => (
                    <CartaoLinha key={l.id} linha={l} />
                  ))}
                </div>
              </section>
            )}

            {/* Demais linhas - sem duplicação com favoritas */}
            {linhasNaoFavoritas.length > 0 && (
              <section style={{ marginTop: "2rem" }}>
                <h2 className="secao-titulo">
                  {linhasFavoritas.length > 0 ? "Outras linhas" : "Linhas disponíveis"}
                </h2>
                <p className="secao-sub">Toque no coração para favoritar</p>
                <div className="grade-linhas" style={{ marginTop: "1rem" }}>
                  {linhasNaoFavoritas.map((l) => (
                    <CartaoLinha key={l.id} linha={l} />
                  ))}
                </div>
              </section>
            )}

            {/* Mapa */}
            <section style={{ marginTop: "2rem" }}>
              <h2 className="secao-titulo">Pontos próximos no mapa</h2>
              <p className="secao-sub">Sua localização e arredores</p>
              <div style={{ marginTop: "1.25rem" }}>
                <MapaView altura={360} />
              </div>
            </section>
          </>
        )}
      </main>

    </div>
  );
}

function CardEstatistica({ valor, rotulo, sub, gradiente, Icone }) {
  return (
    <div className={`home-card-stat ${gradiente}`}>
      <Icone size={16} style={{ opacity: 0.7 }} />
      <div className="home-card-stat-valor">{valor}</div>
      <div className="home-card-stat-rotulo">{rotulo}</div>
      <div className="home-card-stat-sub">{sub}</div>
    </div>
  );
}
