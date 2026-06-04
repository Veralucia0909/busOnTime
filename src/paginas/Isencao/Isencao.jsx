import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, CheckCircle } from "lucide-react";
import { salvarIsencao } from "../../services/localStorageService";
import "./Isencao.css";

const CATEGORIAS = [
  { id: "idoso",       rotulo: "Idoso (60+)" },
  { id: "pcd",         rotulo: "Pessoa com deficiência" },
  { id: "renal",       rotulo: "Paciente renal crônico" },
  { id: "hiv",         rotulo: "Pessoa com HIV" },
  { id: "fibromialgia",rotulo: "Pessoa com fibromialgia" },
  { id: "estudante",   rotulo: "Estudante" },
];

function formatarCPF(v) {
  return v
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function cpfValido(cpf) {
  return cpf.replace(/\D/g, "").length === 11;
}

export default function Isencao() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [categoria, setCategoria] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [erro, setErro] = useState("");
  const [enviado, setEnviado] = useState(false);

  function handleEnviar(e) {
    e.preventDefault();
    setErro("");

    if (!nome.trim()) { setErro("Informe seu nome completo."); return; }
    if (!cpfValido(cpf)) { setErro("CPF inválido. Use 11 dígitos."); return; }
    if (!categoria) { setErro("Selecione uma categoria de isenção."); return; }

    salvarIsencao({ nome: nome.trim(), cpf, categoria, observacoes: observacoes.trim() });
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="pagina">

        <main className="conteudo">
          <div className="isencao-sucesso">
            <div className="isencao-sucesso-icone">
              <CheckCircle size={48} />
            </div>
            <h1 className="isencao-sucesso-titulo">Solicitação enviada!</h1>
            <p className="isencao-sucesso-texto">
              Sua solicitação de isenção foi registrada e será analisada em até 5 dias úteis.
              Você receberá uma resposta por e-mail.
            </p>
            <div className="isencao-sucesso-acoes">
              <button className="btn btn-primary" onClick={() => navigate("/carteira")}>
                Voltar à carteira
              </button>
              <button className="btn btn-ghost" onClick={() => {
                setEnviado(false);
                setNome(""); setCpf(""); setCategoria(""); setObservacoes("");
              }}>
                Nova solicitação
              </button>
            </div>
          </div>
        </main>

      </div>
    );
  }

  return (
    <div className="pagina">

      <main className="conteudo">

        <button className="isencao-voltar" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Voltar
        </button>

        <div className="isencao-cabecalho">
          <ShieldCheck size={28} style={{ color: "var(--accent)" }} />
          <div>
            <h1 className="isencao-titulo">Solicitar isenção</h1>
            <p className="isencao-sub">Tarifa zero para quem tem direito</p>
          </div>
        </div>

        <div className="isencao-info">
          <p>
            A tarifa zero é garantida por lei a determinados grupos. Preencha os dados abaixo
            e nossa equipe avaliará sua solicitação. Os documentos comprobatórios podem ser
            anexados depois pelo e-mail informado na confirmação.
          </p>
        </div>

        <form className="isencao-form" onSubmit={handleEnviar} noValidate>

          <label className="isencao-campo">
            <span className="isencao-campo-rotulo">Nome completo</span>
            <input
              type="text"
              className="input"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Como aparece no documento"
              autoComplete="name"
              required
            />
          </label>

          <label className="isencao-campo">
            <span className="isencao-campo-rotulo">CPF</span>
            <input
              type="text"
              className="input"
              value={cpf}
              onChange={(e) => setCpf(formatarCPF(e.target.value))}
              placeholder="000.000.000-00"
              inputMode="numeric"
              required
            />
          </label>

          <label className="isencao-campo">
            <span className="isencao-campo-rotulo">Categoria da isenção</span>
            <select
              className="input"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
            >
              <option className="isencao-campo-opcao" value="">Selecione...</option>
              {CATEGORIAS.map((c) => (
                <option className="isencao-campo-opcao" key={c.id} value={c.id}>{c.rotulo}</option>
              ))}
            </select>
          </label>

          <label className="isencao-campo">
            <span className="isencao-campo-rotulo">Observações (opcional)</span>
            <textarea
              className="input isencao-textarea"
              rows={4}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Informações adicionais que possam ajudar na análise"
            />
          </label>

          {erro && <p className="isencao-erro" role="alert">{erro}</p>}

          <button type="submit" className="btn btn-ocean isencao-enviar">
            Enviar solicitação
          </button>
        </form>

      </main>

    </div>
  );
}
