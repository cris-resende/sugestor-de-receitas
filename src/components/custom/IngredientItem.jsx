import React from "react";
// O caminho de importação está bom, assumindo que "../index.js" funciona
import { Card, Typography, Stack, Avatar } from "../index.js";

const IngredientItem = ({ name, icon, isSelected, onClick }) => {
  // A função handleClick é removida. Usamos o onClick diretamente.

  return (
    <Card
      style={{
        padding: "12px 8px",
        borderRadius: "12px",
        // ESTILO CONDICIONAL PARA FEEDBACK VISUAL
        boxShadow: isSelected
          ? "0 0 0 2px #1976d2"
          : "0 1px 4px rgba(0,0,0,0.1)",
        cursor: "pointer",
        transition: "all 0.2s",
        backgroundColor: isSelected ? "#e3f2fd" : "#ffffff", // FEEDBACK VISUAL
        textAlign: "center",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
      // Apenas passa a função onClick diretamente para o Card
      onClick={onClick}
    >
      <Stack direction="column" spacing={0.5} alignItems="center">
        <Avatar
          style={{
            width: 44,
            height: 44,
            // FEEDBACK VISUAL DO AVATAR
            backgroundColor: isSelected ? "#1976d2" : "#9e9e9e",
            fontSize: "20px",
          }}
        >
          {icon || name[0]}
        </Avatar>
        <Typography
          variant="caption"
          style={{ fontWeight: 500, color: isSelected ? "#1976d2" : "#333" }}
        >
          {name}
        </Typography>
      </Stack>
    </Card>
  );
};

export default IngredientItem;
