import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bus, MapPin, Zap, Star } from "lucide-react";
import { salvarUsuario, buscarUsuarios } from "../../services/localStorageService";
import CampoFormulario from "../../componentes/CampoFormulario/CampoFormulario";
import "./Cadastro.css";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const navigate = useNavigate();

  function handleCadastrar(e) {
    e.preventDefault();
    setErro("");

    if (!nome || !email || !senha || !confirmarSenha) {
      setErro("Preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    const usuarios = buscarUsuarios();
    const emailJaExiste = usuarios.some((u) => u.email === email);

    if (emailJaExiste) {
      setErro("Este e-mail já está cadastrado.");
      return;
    }

    salvarUsuario({ nome, email, senha });
    setSucesso(true);

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  }

  return (
    <div className="auth-pagina">
      <div className="auth-caixa">

        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icone">
            <Bus size={34} color="#fff" />
          </div>
          <div className="auth-logo-titulo">BusOnTime</div>
          <div className="auth-logo-sub">· Mobilidade Urbana Inteligente</div>
        </div>

        {/* Card */}
        <div className="auth-card">

          {/* Tabs */}
          <div className="auth-tabs">
            <button className="auth-tab" onClick={() => navigate("/login")}>
              Entrar
            </button>
            <button className="auth-tab ativo">Cadastrar</button>
          </div>

          {/* Formulário */}
          {sucesso ? (
            <div className="auth-sucesso">
              ✓ Conta criada! Redirecionando para o login...
            </div>
          ) : (
            <form onSubmit={handleCadastrar}>
              <CampoFormulario
                rotulo="Nome Completo"
                tipo="text"
                valor={nome}
                aoMudar={setNome}
                placeholder="Digite seu nome"
                autoCompleto="name"
              />
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
                placeholder="Mínimo 6 caracteres"
                autoCompleto="new-password"
              />
              <CampoFormulario
                rotulo="Confirmar Senha"
                tipo="password"
                valor={confirmarSenha}
                aoMudar={setConfirmarSenha}
                placeholder="Repita a senha"
                autoCompleto="new-password"
              />

              {erro && <p className="auth-erro">{erro}</p>}

              <button type="submit" className="auth-botao-primario">
                Criar Conta
              </button>
            </form>
          )}
        </div>

        {/* Badges de funcionalidades */}
        <div className="auth-funcionalidades">
          <div className="auth-func-item">
            <div className="auth-func-icone auth-func-icone-azul">
              <MapPin size={14} />
            </div>
            <span>Rastreamento em<br />Tempo Real</span>
          </div>
          <div className="auth-func-item">
            <div className="auth-func-icone auth-func-icone-amarelo">
              <Zap size={14} />
            </div>
            <span>Notificações<br />Inteligentes</span>
          </div>
          <div className="auth-func-item">
            <div className="auth-func-icone auth-func-icone-roxo">
              <Star size={14} />
            </div>
            <span>IA de Lotação</span>
          </div>
        </div>

        <p className="auth-rodape">
          Creative &amp; Tech Challenge · SENAI Florianópolis 2026
        </p>
      </div>
    </div>
  );
}
