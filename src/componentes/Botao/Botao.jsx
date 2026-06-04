import "./Botao.css";

export default function Botao({
  children,
  variante = "primario",
  tamanho = "normal",
  tipo = "button",
  onClick,
  desabilitado = false,
  larguraTotal = false,
}) {
  const classes = [
    "botao",
    `botao-${variante}`,
    tamanho === "pequeno" ? "botao-pequeno" : "",
    tamanho === "grande"  ? "botao-grande"  : "",
    larguraTotal          ? "botao-largo"   : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={tipo}
      className={classes}
      onClick={onClick}
      disabled={desabilitado}
    >
      {children}
    </button>
  );
}
