import { Link } from "react-router-dom";
import { useApp } from "../../contexto/AppContext";
import "./AvatarUsuario.css";

export default function AvatarUsuario() {
  const { usuarioLogado } = useApp();

  const inicial = usuarioLogado?.nome
    ? usuarioLogado.nome.charAt(0).toUpperCase()
    : "U";

  return (
    <Link to="/perfil" className="avatar-usuario" title="Ver perfil">
      {inicial}
    </Link>
  );
}
