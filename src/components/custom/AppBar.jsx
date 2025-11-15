import React from "react";
import { useNavigate } from "react-router-dom";
import { AppBar as MuiAppBar, Toolbar as MuiToolbar } from "@mui/material";
import { Typography, Button, Stack } from "../";

const AppBar = () => {
  const navigate = useNavigate();

  return (
    <MuiAppBar position="static" sx={{ background: "#388e3c" }}>
      <MuiToolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            flexGrow: 1,
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
          }}
          onClick={() => navigate("/home")}
        >
          Sugestor de Receitas
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button
            color="inherit"
            onClick={() => navigate("/home")}
            sx={{ fontWeight: "bold" }}
          >
            Busca
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate("/profile")}
            sx={{ fontWeight: "bold" }}
          >
            Perfil
          </Button>
        </Stack>
      </MuiToolbar>
    </MuiAppBar>
  );
};

export default AppBar;
