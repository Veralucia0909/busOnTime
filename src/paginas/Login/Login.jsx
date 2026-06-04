import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bus, Shield } from "lucide-react";
import { loginUsuario, loginAdmin, ADMIN } from "../../services/localStorageService";
import { useApp } from "../../contexto/AppContext";
import CampoFormulario from "../../componentes/CampoFormulario/CampoFormulario";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const { setUsuarioLogado } = useApp();
  const navigate = useNavigate();

  function handleEntrar(e) {
    e.preventDefault();
    setErro("");

    if (!email || !senha) {
      setErro("Preencha todos os campos.");
      return;
    }

    const usuario = loginUsuario(email, senha);

    if (!usuario) {
      setErro("E-mail ou senha incorretos.");
      return;
    }

    setUsuarioLogado(usuario);
    // Admin vai direto pro painel
    navigate(usuario.papel === "admin" ? "/admin" : "/");
  }

  function entrarComoAdmin() {
    const admin = loginAdmin();
    setUsuarioLogado(admin);
    navigate("/admin");
  }

  return (
    <div className="auth-pagina">
      <div className="auth-caixa">

        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icone">
            <Bus size={34} color="#fff" />
          </div>
          <div className="auth-logo-titulo">BusOnTime Floripa</div>
          <div className="auth-logo-sub">· Mobilidade Urbana Inteligente</div>
        </div>

        {/* Card */}
        <div className="auth-card">

          {/* Tabs */}
          <div className="auth-tabs">
            <button type="button" className="auth-tab ativo">Entrar</button>
            <button type="button" className="auth-tab" onClick={() => navigate("/cadastro")}>
              Cadastrar
            </button>
          </div>

          {/* Formulário */}
          <form onSubmit={handleEntrar}>
            <CampoFormulario
              rotulo="E-mail"
              tipo="email"
              valor={email}
              aoMudar={setEmail}
              placeholder="seu@email.com"
              autoCompleto="email"
            />
            <CampoFormulario
              rotulo="Senha"
              tipo="password"
              valor={senha}
              aoMudar={setSenha}
              placeholder="••••••••"
              autoCompleto="current-password"
            />

            {erro && <p className="auth-erro">{erro}</p>}

            <button type="submit" className="auth-botao-primario">
              Entrar
            </button>
          </form>

          <button
            type="button"
            className="auth-botao-secundario"
            onClick={() => navigate("/cadastro")}
          >
            Criar Conta →
          </button>

          {/* Acesso admin */}
          <div className="auth-divisor">
            <span>ou</span>
          </div>
          <button
            type="button"
            className="auth-botao-admin"
            onClick={entrarComoAdmin}
            title={`Entra com ${ADMIN.email}`}
          >
            <Shield size={16} /> Entrar como administrador
          </button>
          <p className="auth-admin-dica">
            Acesso ao painel operacional da frota
          </p>
        </div>

        <p className="auth-rodape">
          BusOnTime Floripa ®
        </p>
      </div>
    </div>
  );
}
