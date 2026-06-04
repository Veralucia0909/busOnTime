import { Navigate, Outlet } from "react-router-dom";
import { useApp } from "../../contexto/AppContext";
import Cabecalho from "../Cabecalho/Cabecalho";
import Rodape from "../Rodape/Rodape";

/**
 * ValidarAutenticacao — proteção de rotas privadas.
 *
 * - Enquanto o contexto carrega o usuário do localStorage, exibe "Carregando..."
 *   (sem isso, dar F5 numa rota interna joga o usuário pro /login mesmo logado).
 * - Se não há usuário, redireciona para /login.
 * - Se há, renderiza Cabeçalho + Outlet (página filha) + Rodapé.
 *   Isso garante que login/cadastro NÃO mostrem o cabeçalho (são públicas
 *   e renderizadas fora deste validador no App.jsx).
 */
export default function ValidarAutenticacao() {
  const { usuarioLogado, carregando } = useApp();

  if (carregando) {
    return (
      <div
        style={{
          display: "grid",
          placeItems: "center",
          minHeight: "100vh",
          color: "var(--fg-muted)",
        }}
      >
        <div>Carregando...</div>
      </div>
    );
  }

  if (!usuarioLogado) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Cabecalho />
      <Outlet />
      <Rodape />
    </>
  );
}
