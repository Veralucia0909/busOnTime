import { Link, useLocation } from "react-router-dom";
import { Home, Map, Wallet, Bell, User } from "lucide-react";
import "./Rodape.css";

const navegacao = [
  { para: "/",             rotulo: "Início",   Icone: Home },
  { para: "/mapa",         rotulo: "Mapa",     Icone: Map },
  { para: "/carteira",     rotulo: "Carteira", Icone: Wallet },
  { para: "/notificacoes", rotulo: "Alertas",  Icone: Bell },
  { para: "/perfil",       rotulo: "Perfil",   Icone: User },
];

export default function Rodape() {
  const { pathname } = useLocation();

  return (
    <nav className="rodape">
      <div className="rodape-grade">
        {navegacao.map(({ para, rotulo, Icone }) => (
          <Link
            key={para}
            to={para}
            className={`rodape-item${pathname === para ? " ativo" : ""}`}
          >
            <Icone />
            <span>{rotulo}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
