import { createContext, useContext, useState, useEffect } from "react";
import {
  buscarUsuarioLogado,
  logout,
  buscarConfiguracoes,
  atualizarConfiguracao,
} from "../services/localStorageService";

const AppContext = createContext();

// Aplica ou remove data-theme no <html> — escuro é o padrão (sem atributo)
function aplicarTema(modoEscuro) {
  if (modoEscuro) {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  }
}

/**
 * Provider do contexto global da aplicação.
 * Exportado como default (AppContextProvider) seguindo a convenção do professor.
 */
export default function AppContextProvider({ children }) {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [modoEscuro, setModoEscuroState] = useState(true);

  useEffect(() => {
    const usuario = buscarUsuarioLogado();
    setUsuarioLogado(usuario);

    // Carrega preferência de tema salva no localStorage e aplica imediatamente
    const config = buscarConfiguracoes();
    setModoEscuroState(config.modoEscuro);
    aplicarTema(config.modoEscuro);

    setCarregando(false);
  }, []);

  function fazerLogout() {
    logout();
    setUsuarioLogado(null);
  }

  // Chamada pelo toggle no Perfil — muda o tema na hora e salva
  function alternarModoEscuro(valor) {
    setModoEscuroState(valor);
    atualizarConfiguracao("modoEscuro", valor);
    aplicarTema(valor);
  }

  return (
    <AppContext.Provider
      value={{
        usuarioLogado,
        setUsuarioLogado,
        fazerLogout,
        carregando,
        modoEscuro,
        alternarModoEscuro,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Hook para consumir o contexto em qualquer componente filho.
export function useApp() {
  return useContext(AppContext);
}
