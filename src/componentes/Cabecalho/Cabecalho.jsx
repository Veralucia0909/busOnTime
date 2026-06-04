import { Link, useLocation } from "react-router-dom";
import { Bus, Home, Map, Wallet, Bell, User, Shield } from "lucide-react";
import { useApp } from "../../contexto/AppContext";
import "./Cabecalho.css";

const navegacao = [
  { para: "/",             rotulo: "Início",   Icone: Home   },
  { para: "/mapa",         rotulo: "Mapa",     Icone: Map    },
  { para: "/carteira",     rotulo: "Carteira", Icone: Wallet },
  { para: "/notificacoes", rotulo: "Alertas",  Icone: Bell   },
  { para: "/perfil",       rotulo: "Perfil",   Icone: User   },
];

export default function Cabecalho() {
  const { pathname } = useLocation();
  const { usuarioLogado } = useApp();
  const ehAdmin = usuarioLogado?.papel === "admin";

  return (
    <header className="cabecalho">
      <Link to="/" className="cabecalho-logo" aria-label="Início">
        <div className="cabecalho-logo-icone">
          <Bus size={18} aria-hidden="true" />
        </div>
        <span className="cabecalho-logo-texto">
          BusOnTime<span> Floripa</span>
        </span>
      </Link>

      <nav className="cabecalho-nav" aria-label="Navegação principal">
        {navegacao.map(({ para, rotulo, Icone }) => {
          const ativo = pathname === para;
          return (
            <Link
              key={para}
              to={para}
              className={`cabecalho-nav-link${ativo ? " ativo" : ""}`}
              aria-current={ativo ? "page" : undefined}
              title={rotulo}
            >
              <Icone size={18} aria-hidden="true" />
              <span className="cabecalho-nav-label">{rotulo}</span>
            </Link>
          );
        })}

      </nav>
    </header>
  );
}
