import { useCallback, useEffect, useState } from "react";

const KEY = "smartbus:favoritos";
const EVENT = "smartbus:favoritos:changed";

function read() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  // Pré-carrega 2 favoritos no primeiro acesso, para demonstração.
  return ["210", "330"];
}

function write(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    // Notifica TODOS os hooks na mesma aba — o evento "storage" nativo
    // só dispara entre abas diferentes.
    window.dispatchEvent(new CustomEvent(EVENT, { detail: list }));
  } catch {}
}

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setFavorites(read());
    const onChange = (e) => setFavorites(e.detail || read());
    const onStorage = (e) => { if (e.key === KEY) setFavorites(read()); };
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const toggle = useCallback((id) => {
    const atual = read();
    const proximo = atual.includes(id) ? atual.filter((f) => f !== id) : [...atual, id];
    write(proximo);
  }, []);

  const remove = useCallback((id) => {
    write(read().filter((f) => f !== id));
  }, []);

  return {
    favorites,
    toggle,
    remove,
    isFavorite: (id) => favorites.includes(id),
  };
}
