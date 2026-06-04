/* ================================================================
   SmartBus Floripa — Serviço de LocalStorage
   Centraliza todo o armazenamento local do app.
   Dados persistem entre sessões (mesmo após F5).
   ================================================================ */

const K = {
  USUARIOS:        "smartbus:usuarios",
  USUARIO_LOGADO:  "smartbus:usuarioLogado",
  SALDO:           "smartbus:saldo",
  RECARGAS:        "smartbus:recargas",
  ISENCOES:        "smartbus:isencoes",
  SUPORTE:         "smartbus:mensagensSuporte",
  CONFIG:          "smartbus:configuracoes",
};

// ---------- helpers internos ----------
function ler(chave, padrao) {
  try {
    const d = localStorage.getItem(chave);
    return d ? JSON.parse(d) : padrao;
  } catch {
    return padrao;
  }
}
function gravar(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

// ---------- usuários ----------

// Conta admin fixa: usada pelo botão "Entrar como admin" da tela de login.
// Não é armazenada no localStorage — sempre disponível.
export const ADMIN = {
  id: "admin",
  nome: "Administrador",
  email: "admin@smartbus.floripa",
  senha: "admin123",
  papel: "admin",
};

export function salvarUsuario(usuario) {
  const usuarios = buscarUsuarios();
  usuarios.push(usuario);
  gravar(K.USUARIOS, usuarios);
}
export function buscarUsuarios() {
  return ler(K.USUARIOS, []);
}
export function buscarUsuarioLogado() {
  return ler(K.USUARIO_LOGADO, null);
}
export function loginUsuario(email, senha) {
  // Credenciais de admin batem antes dos usuários normais.
  if (email === ADMIN.email && senha === ADMIN.senha) {
    gravar(K.USUARIO_LOGADO, ADMIN);
    return ADMIN;
  }
  const u = buscarUsuarios().find((x) => x.email === email && x.senha === senha);
  if (u) gravar(K.USUARIO_LOGADO, u);
  return u || null;
}
export function loginAdmin() {
  gravar(K.USUARIO_LOGADO, ADMIN);
  return ADMIN;
}
export function logout() {
  localStorage.removeItem(K.USUARIO_LOGADO);
}

// ---------- cartão (passe Floripa) ----------
// Cada usuário tem um cartão associado (ou nenhum, se ainda não cadastrou).
const K_CARTAO_PREFIX = "smartbus:cartao:";

function chaveCartao(idUsuario) {
  return `${K_CARTAO_PREFIX}${idUsuario}`;
}
export function buscarCartao(idUsuario) {
  if (!idUsuario) return null;
  return ler(chaveCartao(idUsuario), null);
}
export function salvarCartao(idUsuario, { numero, titular, validade }) {
  if (!idUsuario) return null;
  const cartao = {
    id: `c_${Date.now()}`,
    numero: numero.replace(/\s/g, "").slice(-16),
    titular: titular.toUpperCase(),
    validade,
    criado: new Date().toISOString(),
  };
  gravar(chaveCartao(idUsuario), cartao);
  return cartao;
}
export function removerCartao(idUsuario) {
  if (!idUsuario) return;
  localStorage.removeItem(chaveCartao(idUsuario));
}

// ---------- saldo (carteira) ----------
export function buscarSaldo() {
  const v = ler(K.SALDO, 24.5);
  return typeof v === "number" ? v : 24.5;
}
export function atualizarSaldo(novoSaldo) {
  gravar(K.SALDO, Math.max(0, Number(novoSaldo) || 0));
}
export function adicionarSaldo(valor) {
  const novo = buscarSaldo() + Number(valor || 0);
  atualizarSaldo(novo);
  return novo;
}

// ---------- recargas ----------
export function buscarRecargas() {
  return ler(K.RECARGAS, []);
}
export function salvarRecarga({ valor, metodo }) {
  const recarga = {
    id: `r_${Date.now()}`,
    valor: Number(valor),
    metodo,
    data: new Date().toISOString(),
    status: "confirmada",
  };
  const recargas = [recarga, ...buscarRecargas()];
  gravar(K.RECARGAS, recargas);
  return recarga;
}

// ---------- isenções ----------
export function buscarIsencoes() {
  return ler(K.ISENCOES, []);
}
export function salvarIsencao({ nome, cpf, categoria, observacoes }) {
  const isencao = {
    id: `i_${Date.now()}`,
    nome,
    cpf,
    categoria,
    observacoes: observacoes || "",
    data: new Date().toISOString(),
    status: "em análise",
  };
  const lista = [isencao, ...buscarIsencoes()];
  gravar(K.ISENCOES, lista);
  return isencao;
}

// ---------- suporte ----------
export function buscarMensagensSuporte() {
  return ler(K.SUPORTE, []);
}
export function salvarMensagemSuporte({ assunto, mensagem, email }) {
  const msg = {
    id: `s_${Date.now()}`,
    assunto,
    mensagem,
    email: email || "",
    data: new Date().toISOString(),
    status: "enviada",
  };
  const lista = [msg, ...buscarMensagensSuporte()];
  gravar(K.SUPORTE, lista);
  return msg;
}

// ---------- configurações ----------
const CONFIG_PADRAO = {
  notificacoes: true,
  localizacao:  true,
  modoEscuro:   true,
};
export function buscarConfiguracoes() {
  return { ...CONFIG_PADRAO, ...ler(K.CONFIG, {}) };
}
export function atualizarConfiguracao(chave, valor) {
  const atual = buscarConfiguracoes();
  atual[chave] = valor;
  gravar(K.CONFIG, atual);
}

// ---------- notificações lidas/excluídas ----------
const K_NOTIF_OCULTAS = "smartbus:notif:ocultas";

export function buscarNotificacoesOcultas() {
  return ler(K_NOTIF_OCULTAS, []);
}
export function ocultarNotificacao(id) {
  const ocultas = buscarNotificacoesOcultas();
  if (!ocultas.includes(id)) {
    ocultas.push(id);
    gravar(K_NOTIF_OCULTAS, ocultas);
  }
}
export function restaurarNotificacoes() {
  gravar(K_NOTIF_OCULTAS, []);
}
