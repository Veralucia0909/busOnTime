// imports de bibliotecas externas, instaladas via npm
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// imports de arquivos de estilos (CSS)
import "./App.css";
// imports de componentes/paginas internas do projeto React (arquivos .jsx)
import ValidarAutenticacao from "./componentes/ValidarAutenticacao/ValidarAutenticacao";
import AppContextProvider from "./contexto/AppContext";
// imports de páginas
import Login from "./paginas/Login/Login";
import Cadastro from "./paginas/Cadastro/Cadastro";
import Home from "./paginas/Home/Home";
import Mapa from "./paginas/Mapa/Mapa";
import Carteira from "./paginas/Carteira/Carteira";
import Perfil from "./paginas/Perfil/Perfil";
import Notificacoes from "./paginas/Notificacoes/Notificacoes";
import Admin from "./paginas/Admin/Admin";
import Isencao from "./paginas/Isencao/Isencao";
import Ajuda from "./paginas/Ajuda/Ajuda";

const roteador = createBrowserRouter([
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "cadastro",
    element: <Cadastro />,
  },
  {
    path: "",
    element: <ValidarAutenticacao />,
    children: [
      // Rotas privadas ao app, ou seja, só podem ser acessadas por usuários autenticados
      {
        path: "",
        element: <Home />,
      },
      {
        path: "mapa",
        element: <Mapa />,
      },
      {
        path: "carteira",
        element: <Carteira />,
      },
      {
        path: "perfil",
        element: <Perfil />,
      },
      {
        path: "notificacoes",
        element: <Notificacoes />,
      },
      {
        path: "admin",
        element: <Admin />,
      },
      {
        path: "isencao",
        element: <Isencao />,
      },
      {
        path: "ajuda",
        element: <Ajuda />,
      },
    ],
  },
  {
    path: "*", //
    element: <h3 style={{ padding: "2rem", textAlign: "center" }}>Página não encontrada!!</h3>,
  },
]);

function App() {
  return (
    <>
      <AppContextProvider>
        <RouterProvider router={roteador} />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="dark"
        />
      </AppContextProvider>
    </>
  );
}

export default App;
