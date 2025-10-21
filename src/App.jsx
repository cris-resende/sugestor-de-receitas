import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/authentication/Login";
import Register from "./pages/authentication/Register";
import AuthRedirect from "./pages/authentication/AuthRedirect";
import UpdatePassword from "./pages/authentication/UpdatePassword";
import Home from "./pages/Home";

import RecipeDetails from "./pages/RecipeDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota de padrão */}
        <Route path="/" element={<Login />} />

        {/* Rotas de Autenticação */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rotas de redirecionamento */}
        <Route path="/auth/redirect" element={<AuthRedirect />} />
        <Route path="/update-password" element={<UpdatePassword />} />

        {/* Rotas Principais */}
        <Route path="/home" element={<Home />} />
        <Route path="/receitas/:recipeId" element={<RecipeDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
