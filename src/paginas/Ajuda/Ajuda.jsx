import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, HelpCircle, Mail, Phone, MapPin, ChevronDown, CheckCircle,
} from "lucide-react";
import { useApp } from "../../contexto/AppContext";
import { salvarMensagemSuporte } from "../../services/localStorageService";
import "./Ajuda.css";

const FAQ = [
  {
    p: "Como recarrego meu cartão?",
    r: "Vá em Carteira, escolha o valor (mínimo R$ 5, máximo R$ 500), selecione o método de pagamento e toque em Recarregar. O saldo é atualizado na hora.",
  },
  {
    p: "Quem tem direito à tarifa zero?",
    r: "Idosos 60+, pessoas com deficiência, pacientes renais crônicos, pessoas com HIV ou fibromialgia, e estudantes. Solicite a isenção pela tela Carteira > Solicitar isenção.",
  },
  {
    p: "Quanto custa a passagem?",
    r: "A tarifa atual é R$ 7,70 por viagem. Em recargas pelo app, não há taxa adicional.",
  },
  {
    p: "Como ativo alertas de uma linha?",
    r: "Adicione a linha aos favoritos pelo Perfil ou tocando no coração ao lado do nome da linha. Você receberá notificações de chegada se as notificações estiverem ativadas.",
  },
  {
    p: "Por que o ônibus não aparece no mapa?",
    r: "A frota envia posição por GPS a cada 10 segundos. Se um veículo está fora de operação ou sem sinal, ele não aparece no mapa.",
  },
  {
    p: "Os meus dados ficam salvos?",
    r: "Sim, todos os dados ficam armazenados no seu navegador (LocalStorage). Eles persistem mesmo após fechar o app, mas só no dispositivo onde foram criados.",
  },
];

export default function Ajuda() {
  const navigate = useNavigate();
  const { usuarioLogado } = useApp();
  const [aberto, setAberto] = useState(0);
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [email, setEmail] = useState(usuarioLogado?.email || "");
  const [erro, setErro] = useState("");
  const [enviado, setEnviado] = useState(false);

  function handleEnviar(e) {
    e.preventDefault();
    setErro("");
    if (!assunto.trim()) { setErro("Informe um assunto."); return; }
    if (mensagem.trim().length < 10) { setErro("Descreva sua dúvida com pelo menos 10 caracteres."); return; }
    salvarMensagemSuporte({ assunto: assunto.trim(), mensagem: mensagem.trim(), email: email.trim() });
    setEnviado(true);
    setAssunto("");
    setMensagem("");
    setTimeout(() => setEnviado(false), 4000);
  }

  return (
    <div className="pagina">

      <main className="conteudo">

        <button className="ajuda-voltar" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Voltar
        </button>

        <div className="ajuda-cabecalho">
          <HelpCircle size={28} style={{ color: "var(--primary)" }} />
          <div>
            <h1 className="ajuda-titulo">Ajuda e suporte</h1>
            <p className="ajuda-sub">FAQ, contato e formulário de dúvidas</p>
          </div>
        </div>

        {/* FAQ */}
        <section className="ajuda-secao">
          <h2 className="ajuda-secao-titulo">Perguntas frequentes</h2>
          <div className="ajuda-faq">
            {FAQ.map((item, i) => (
              <div key={i} className={`ajuda-faq-item${aberto === i ? " aberto" : ""}`}>
                <button
                  className="ajuda-faq-pergunta"
                  onClick={() => setAberto(aberto === i ? -1 : i)}
                  aria-expanded={aberto === i}
                >
                  <span>{item.p}</span>
                  <ChevronDown size={18} className="ajuda-faq-chevron" />
                </button>
                {aberto === i && <p className="ajuda-faq-resposta">{item.r}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Contato */}
        <section className="ajuda-secao">
          <h2 className="ajuda-secao-titulo">Fale com a gente</h2>
          <div className="ajuda-contatos">
            <div className="ajuda-contato">
              <Mail size={18} />
              <div>
                <div className="ajuda-contato-rotulo">E-mail</div>
                <div className="ajuda-contato-valor">suporte@smartbus.floripa</div>
              </div>
            </div>
            <div className="ajuda-contato">
              <Phone size={18} />
              <div>
                <div className="ajuda-contato-rotulo">Telefone</div>
                <div className="ajuda-contato-valor">0800 048 1234</div>
              </div>
            </div>
            <div className="ajuda-contato">
              <MapPin size={18} />
              <div>
                <div className="ajuda-contato-rotulo">Atendimento</div>
                <div className="ajuda-contato-valor">Seg–Sex, 7h às 19h</div>
              </div>
            </div>
          </div>
        </section>

        {/* Formulário */}
        <section className="ajuda-secao">
          <h2 className="ajuda-secao-titulo">Envie uma dúvida</h2>

          {enviado && (
            <div className="ajuda-sucesso" role="status">
              <CheckCircle size={18} /> Mensagem enviada! Vamos responder em até 24h.
            </div>
          )}

          <form className="ajuda-form" onSubmit={handleEnviar} noValidate>
            <label className="ajuda-campo">
              <span className="ajuda-campo-rotulo">E-mail para resposta</span>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                autoComplete="email"
              />
            </label>
            <label className="ajuda-campo">
              <span className="ajuda-campo-rotulo">Assunto</span>
              <input
                type="text"
                className="input"
                value={assunto}
                onChange={(e) => setAssunto(e.target.value)}
                placeholder="Ex: problema na recarga"
                required
              />
            </label>
            <label className="ajuda-campo">
              <span className="ajuda-campo-rotulo">Mensagem</span>
              <textarea
                className="input ajuda-textarea"
                rows={5}
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Descreva sua dúvida ou problema..."
                required
              />
            </label>

            {erro && <p className="ajuda-erro" role="alert">{erro}</p>}

            <button type="submit" className="btn btn-primary ajuda-enviar">
              Enviar mensagem
            </button>
          </form>
        </section>

      </main>

    </div>
  );
}
