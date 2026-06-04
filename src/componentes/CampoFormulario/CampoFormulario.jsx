import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./CampoFormulario.css";

export default function CampoFormulario({
  rotulo,
  tipo = "text",
  valor,
  aoMudar,
  placeholder = "",
  autoCompleto,
}) {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const ehSenha = tipo === "password";

  return (
    <div className="campo-formulario">
      {rotulo && <label className="campo-rotulo">{rotulo}</label>}
      <div className="campo-wrap">
        <input
          type={ehSenha && mostrarSenha ? "text" : tipo}
          value={valor}
          onChange={(e) => aoMudar(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoCompleto}
          className="input-field"
        />
        {ehSenha && (
          <button
            type="button"
            className="campo-toggle-senha"
            onClick={() => setMostrarSenha((v) => !v)}
          >
            {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}
