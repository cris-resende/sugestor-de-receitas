import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// Importação de Componentes MUI com Alias e utilitários
import {
  BottomNavigation as MuiBottomNavigation,
  BottomNavigationAction as MuiBottomNavigationAction,
  Paper,
} from "@mui/material";
// Importação de Ícones
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState(0);

  // Mapeia o caminho da URL para o valor do estado
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/home") || path === "/") setValue(0);
    // Rota principal /home ou / (que redireciona para login/home)
    else if (path.includes("/receitas")) setValue(1); // Resultados/Detalhes
    else if (path.includes("/profile")) setValue(2); // Perfil
    else setValue(0);
  }, [location.pathname]);

  const handleNavigation = (event, newValue) => {
    setValue(newValue);
    if (newValue === 0) navigate("/home"); // Busca/Home
    else if (newValue === 1) navigate("/home"); // Receitas/Resultados
    else if (newValue === 2) navigate("/profile"); // Perfil
  };

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: "#f9f9f9",
        borderTop: "1px solid #ddd",
      }}
      elevation={5}
    >
      <MuiBottomNavigation
        value={value}
        onChange={handleNavigation}
        showLabels
        sx={{ backgroundColor: "transparent" }}
      >
        <MuiBottomNavigationAction
          label="Busca"
          icon={<SearchIcon />}
          sx={{ color: value === 0 ? "#388e3c" : "#888" }}
        />
        <MuiBottomNavigationAction
          label="Receitas"
          icon={<HomeIcon />}
          sx={{ color: value === 1 ? "#388e3c" : "#888" }}
        />
        <MuiBottomNavigationAction
          label="Perfil"
          icon={<PersonIcon />}
          sx={{ color: value === 2 ? "#388e3c" : "#888" }}
        />
      </MuiBottomNavigation>
    </Paper>
  );
};

export default BottomNavigation;
