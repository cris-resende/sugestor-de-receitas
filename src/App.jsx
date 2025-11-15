import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/authentication/Login";
import Register from "./pages/authentication/Register";
import AuthRedirect from "./pages/authentication/AuthRedirect";
import UpdatePassword from "./pages/authentication/UpdatePassword";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import SiteLayout from "./pages/SiteLayout";

import RecipeDetails from "./pages/RecipeDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota de padrão */}
        <Route path="/" element={<AuthRedirect />} />

        {/* Rotas de Autenticação */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/update-password" element={<UpdatePassword />} />

        {/* Rotas de redirecionamento */}
        <Route path="/auth/callback" element={<AuthRedirect />} />

        {/* Rotas Principais */}
        <Route element={<SiteLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/receitas/:recipeId" element={<RecipeDetails />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
