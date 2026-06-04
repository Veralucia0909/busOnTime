import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard, FileText, Plus, QrCode, Receipt, ShieldCheck, Wallet,
  X, CheckCircle, AlertCircle, Trash2,
} from "lucide-react";
import { trips as viagens } from "../../lib/mock-data";
import { useApp } from "../../contexto/AppContext";
import {
  buscarSaldo, adicionarSaldo, salvarRecarga, buscarRecargas,
  buscarCartao, salvarCartao, removerCartao,
} from "../../services/localStorageService";
import {
  TARIFA, TARIFA_FORMATADA, RECARGA_MIN, RECARGA_MAX, formatarMoeda, formatarData,
} from "../../lib/constantes";
import "./Carteira.css";

const valoresRapidos = [10, 20, 50, 100];

const metodosPagamento = [
  { id: "pix",     rotulo: "PIX",     Icone: QrCode,     badge: "Instantâneo" },
  { id: "credito", rotulo: "Crédito", Icone: CreditCard },
  { id: "debito",  rotulo: "Débito",  Icone: CreditCard },
  { id: "boleto",  rotulo: "Boleto",  Icone: FileText },
];

export default function Carteira() {
  const navigate = useNavigate();
  const { usuarioLogado } = useApp();

  const [saldo, setSaldo] = useState(0);
  const [valor, setValor] = useState(20);
  const [valorCustomizado, setValorCustomizado] = useState("");
  const [metodo, setMetodo] = useState("pix");
  const [recargaAuto, setRecargaAuto] = useState(false);

  const [modalAberto, setModalAberto] = useState(false);
  const [confirmacao, setConfirmacao] = useState(null);
  const [erro, setErro] = useState("");
  const [recargas, setRecargas] = useState([]);

  // Cartão do usuário (Passe Floripa)
  const [cartao, setCartao] = useState(null);
  const [modalCartao, setModalCartao] = useState(false);
  const [cartaoNumero, setCartaoNumero] = useState("");
  const [cartaoTitular, setCartaoTitular] = useState("");
  const [cartaoValidade, setCartaoValidade] = useState("");
  const [erroCartao, setErroCartao] = useState("");

  useEffect(() => {
    setSaldo(buscarSaldo());
    setRecargas(buscarRecargas());
    if (usuarioLogado?.id) {
      setCartao(buscarCartao(usuarioLogado.id));
    }
  }, [usuarioLogado]);

  const viagensRestantes = Math.floor(saldo / TARIFA);

  function obterValorRecarga() {
    if (valorCustomizado) return Number(valorCustomizado.replace(",", "."));
    return Number(valor);
  }

  // Cadastrar cartão ---------------------------------------------------
  function formatarCartaoNumero(v) {
    return v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
  }
  function formatarCartaoValidade(v) {
    return v.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(\d)/, "$1/$2");
  }
  function cadastrarCartao(e) {
    e.preventDefault();
    setErroCartao("");
    const numLimpo = cartaoNumero.replace(/\s/g, "");
    if (numLimpo.length < 16) { setErroCartao("Número do cartão deve ter 16 dígitos."); return; }
    if (!cartaoTitular.trim()) { setErroCartao("Informe o nome do titular."); return; }
    if (!/^\d{2}\/\d{2}$/.test(cartaoValidade)) { setErroCartao("Validade no formato MM/AA."); return; }

    const novo = salvarCartao(usuarioLogado.id, {
      numero: numLimpo,
      titular: cartaoTitular.trim(),
      validade: cartaoValidade,
    });
    setCartao(novo);
    setModalCartao(false);
    setCartaoNumero(""); setCartaoTitular(""); setCartaoValidade("");
  }
  function excluirCartao() {
    if (!confirm("Remover o cartão cadastrado?")) return;
    removerCartao(usuarioLogado.id);
    setCartao(null);
  }

  function abrirModalRecarga() {
    setErro("");
    const v = obterValorRecarga();
    if (!v || isNaN(v) || v <= 0) {
      setErro("Informe um valor válido para recarga.");
      return;
    }
    if (v < RECARGA_MIN) {
      setErro(`Valor mínimo: ${formatarMoeda(RECARGA_MIN)}.`);
      return;
    }
    if (v > RECARGA_MAX) {
      setErro(`Valor máximo: ${formatarMoeda(RECARGA_MAX)}.`);
      return;
    }
    setModalAberto(true);
  }

  function confirmarRecarga() {
    const v = obterValorRecarga();
    const novoSaldo = adicionarSaldo(v);
    const recarga = salvarRecarga({ valor: v, metodo });
    setSaldo(novoSaldo);
    setRecargas([recarga, ...recargas]);
    setModalAberto(false);
    setConfirmacao({ valor: v, novoSaldo });
    setValorCustomizado("");
    setTimeout(() => setConfirmacao(null), 4500);
  }

  return (
    <div className="pagina">

      <main className="conteudo">
        <h1 className="carteira-titulo">Carteira digital</h1>
        <p className="carteira-sub">Saldo, recargas e tarifa social</p>

        {confirmacao && (
          <div className="carteira-toast" role="status">
            <CheckCircle size={20} />
            <div>
              <div className="carteira-toast-titulo">
                Recarga de {formatarMoeda(confirmacao.valor)} confirmada!
              </div>
              <div className="carteira-toast-sub">
                Saldo atual: {formatarMoeda(confirmacao.novoSaldo)}
              </div>
            </div>
          </div>
        )}

        {/* Cards superiores */}
        <div className="carteira-grade-topo">

          {/* Card de saldo — sempre visível, mostra o valor disponível */}
          <div className="carteira-card-saldo">
            <div className="carteira-card-saldo-cabecalho">
              <Wallet size={16} /> Saldo disponível
            </div>
            <div>
              <div className="carteira-card-saldo-rotulo">Em recargas</div>
              <div className="carteira-card-saldo-valor">{formatarMoeda(saldo)}</div>
            </div>
          </div>

          {/* Cartão Passe — com cartão cadastrado ou aviso de falta */}
          {cartao ? (
            <div className="carteira-card-passe">
              <div className="carteira-card-brilho" />
              <button
                type="button"
                className="carteira-card-excluir"
                onClick={excluirCartao}
                aria-label="Remover cartão"
                title="Remover cartão"
              >
                <Trash2 size={14} />
              </button>
              <div className="carteira-card-conteudo">
                <div>
                  <div className="carteira-rotulo">Passe Floripa</div>
                  <div className="carteira-saldo">{formatarMoeda(saldo)}</div>
                  <div className="carteira-saldo-sub">
                    ≈ {viagensRestantes} {viagensRestantes === 1 ? "viagem" : "viagens"} · Tarifa {TARIFA_FORMATADA}
                  </div>
                </div>
                <Wallet size={28} style={{ color: "var(--accent)" }} />
              </div>
              <div className="carteira-card-rodape">
                <div>
                  <div className="carteira-card-rodape-rotulo">Cartão</div>
                  <div className="carteira-card-rodape-valor">
                    •••• •••• •••• {cartao.numero.slice(-4)}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="carteira-card-rodape-rotulo">Titular</div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                    {cartao.titular}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="carteira-card-vazio">
              <CreditCard size={36} className="carteira-card-vazio-icone" />
              <div className="carteira-card-vazio-titulo">Nenhum cartão cadastrado</div>
              <p className="carteira-card-vazio-texto">
                Cadastre seu cartão Passe Floripa para começar a usar o saldo digital.
              </p>
              <button
                type="button"
                className="btn btn-ocean"
                onClick={() => setModalCartao(true)}
              >
                <Plus size={16} /> Cadastrar cartão
              </button>
            </div>
          )}

          {/* Tarifa social */}
          <div className="carteira-tarifa-social">
            <ShieldCheck size={24} style={{ color: "var(--accent)" }} />
            <div className="carteira-tarifa-titulo">Tarifa zero</div>
            <p className="carteira-tarifa-texto">
              Idosos 60+, PCD, pacientes renais crônicos, pessoas com HIV ou fibromialgia.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              style={{ marginTop: "1rem", width: "100%", justifyContent: "center" }}
              onClick={() => navigate("/isencao")}
            >
              Solicitar isenção
            </button>
          </div>
        </div>

        {/* Recarregar */}
        <section className="card card-p" style={{ marginTop: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Plus size={20} style={{ color: "var(--primary)" }} />
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Recarregar</h2>
          </div>

          <div className="carteira-grade-valores">
            {valoresRapidos.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => { setValor(v); setValorCustomizado(""); setErro(""); }}
                className={`carteira-btn-valor${valor === v && !valorCustomizado ? " ativo" : ""}`}
              >
                R$ {v}
              </button>
            ))}
          </div>

          <label className="carteira-valor-custom">
            <span>Outro valor</span>
            <input
              type="text"
              inputMode="decimal"
              className="input"
              placeholder={`R$ ${RECARGA_MIN} a R$ ${RECARGA_MAX}`}
              value={valorCustomizado}
              onChange={(e) => { setValorCustomizado(e.target.value); setErro(""); }}
            />
          </label>

          <div style={{ marginTop: "1.5rem" }}>
            <div className="carteira-pagamento-rotulo">Pagamento</div>
            <div className="carteira-grade-pagamento">
              {metodosPagamento.map(({ id, rotulo, Icone, badge }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMetodo(id)}
                  className={`carteira-btn-pagamento${metodo === id ? " ativo" : ""}`}
                >
                  <Icone size={16} />
                  {rotulo}
                  {badge && <span className="carteira-badge-pagamento">{badge}</span>}
                </button>
              ))}
            </div>
          </div>

          <div
            className="carteira-recarga-auto"
            onClick={() => setRecargaAuto(!recargaAuto)}
          >
            <div>
              <div style={{ fontWeight: 500 }}>Recarga automática</div>
              <div style={{ fontSize: "0.75rem", color: "var(--fg-muted)" }}>
                Recarrega R$ 20 quando saldo &lt; R$ 5
              </div>
            </div>
            <button
              type="button"
              className={`toggle${recargaAuto ? " on" : ""}`}
              onClick={(e) => { e.stopPropagation(); setRecargaAuto(!recargaAuto); }}
              aria-label="Ativar recarga automática"
            />
          </div>

          {erro && (
            <p className="carteira-erro" role="alert">
              <AlertCircle size={14} /> {erro}
            </p>
          )}

          <button
            type="button"
            className="btn btn-ocean carteira-btn-recarregar"
            onClick={abrirModalRecarga}
          >
            Recarregar {formatarMoeda(obterValorRecarga() || 0)}
          </button>
        </section>

        {/* Histórico de recargas (LocalStorage) */}
        {recargas.length > 0 && (
          <section style={{ marginTop: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Plus size={20} style={{ color: "var(--accent)" }} />
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Recargas realizadas</h2>
            </div>
            <div className="carteira-historico">
              {recargas.slice(0, 5).map((r) => (
                <div key={r.id} className="carteira-viagem">
                  <div>
                    <div className="carteira-viagem-linha">
                      Recarga via {r.metodo.toUpperCase()}
                    </div>
                    <div className="carteira-viagem-data">{formatarData(r.data)}</div>
                  </div>
                  <div className="carteira-viagem-tarifa" style={{ color: "var(--status-free)" }}>
                    + {formatarMoeda(r.valor)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Histórico de viagens */}
        <section style={{ marginTop: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Receipt size={20} style={{ color: "var(--primary)" }} />
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Histórico de viagens</h2>
          </div>
          <div className="carteira-historico">
            {viagens.map((v) => (
              <div key={v.id} className="carteira-viagem">
                <div>
                  <div className="carteira-viagem-linha">
                    Linha {v.line} · {v.from} → {v.to}
                  </div>
                  <div className="carteira-viagem-data">{v.date}</div>
                </div>
                <div className="carteira-viagem-tarifa">- {formatarMoeda(v.fare)}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Modal de confirmação de recarga */}
      {modalAberto && (
        <div className="carteira-modal-fundo" onClick={() => setModalAberto(false)}>
          <div className="carteira-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <button
              className="carteira-modal-fechar"
              onClick={() => setModalAberto(false)}
              aria-label="Fechar"
            >
              <X size={18} />
            </button>
            <h3 className="carteira-modal-titulo">Confirmar recarga</h3>
            <p className="carteira-modal-texto">
              Você está prestes a recarregar
              <strong> {formatarMoeda(obterValorRecarga())} </strong>
              via <strong>{metodo.toUpperCase()}</strong>.
            </p>
            <div className="carteira-modal-resumo">
              <div className="carteira-modal-linha">
                <span>Saldo atual</span>
                <strong>{formatarMoeda(saldo)}</strong>
              </div>
              <div className="carteira-modal-linha">
                <span>Após a recarga</span>
                <strong style={{ color: "var(--status-free)" }}>
                  {formatarMoeda(saldo + obterValorRecarga())}
                </strong>
              </div>
            </div>
            <div className="carteira-modal-acoes">
              <button className="btn btn-ghost" onClick={() => setModalAberto(false)}>
                Cancelar
              </button>
              <button className="btn btn-ocean" onClick={confirmarRecarga}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de cadastro de cartão */}
      {modalCartao && (
        <div className="carteira-modal-fundo" onClick={() => setModalCartao(false)}>
          <div className="carteira-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <button
              type="button"
              className="carteira-modal-fechar"
              onClick={() => setModalCartao(false)}
              aria-label="Fechar"
            >
              <X size={18} />
            </button>
            <h3 className="carteira-modal-titulo">Cadastrar cartão</h3>
            <p className="carteira-modal-texto">
              Cadastre seu cartão Passe Floripa para acompanhar saldo e recarregar.
            </p>
            <form onSubmit={cadastrarCartao} style={{ marginTop: "1rem" }}>
              <label className="carteira-valor-custom">
                <span>Número do cartão</span>
                <input
                  type="text"
                  inputMode="numeric"
                  className="input"
                  placeholder="0000 0000 0000 0000"
                  value={cartaoNumero}
                  onChange={(e) => setCartaoNumero(formatarCartaoNumero(e.target.value))}
                  maxLength={19}
                  required
                />
              </label>
              <label className="carteira-valor-custom" style={{ marginTop: "0.75rem" }}>
                <span>Titular do cartão</span>
                <input
                  type="text"
                  className="input"
                  placeholder="Nome como aparece no cartão"
                  value={cartaoTitular}
                  onChange={(e) => setCartaoTitular(e.target.value)}
                  autoComplete="cc-name"
                  required
                />
              </label>
              <label className="carteira-valor-custom" style={{ marginTop: "0.75rem" }}>
                <span>Validade</span>
                <input
                  type="text"
                  inputMode="numeric"
                  className="input"
                  placeholder="MM/AA"
                  value={cartaoValidade}
                  onChange={(e) => setCartaoValidade(formatarCartaoValidade(e.target.value))}
                  maxLength={5}
                  required
                />
              </label>
              {erroCartao && (
                <p className="carteira-erro" role="alert">
                  <AlertCircle size={14} /> {erroCartao}
                </p>
              )}
              <div className="carteira-modal-acoes">
                <button type="button" className="btn btn-ghost" onClick={() => setModalCartao(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-ocean">
                  Cadastrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
}
