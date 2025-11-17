import { Card, Typography, Stack, Avatar } from "../index.js";

const IngredientItem = ({ name, icon, isSelected, onClick }) => {
  return (
    <Card
      style={{
        padding: "12px 8px",
        borderRadius: "12px",
        boxShadow: isSelected
          ? "0 0 0 2px #1976d2"
          : "0 1px 4px rgba(0,0,0,0.1)",
        cursor: "pointer",
        transition: "all 0.2s",
        backgroundColor: isSelected ? "#e3f2fd" : "#ffffff",
        textAlign: "center",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
      onClick={onClick}
    >
      <Stack direction="column" spacing={0.5} alignItems="center">
        <Avatar
          style={{
            width: 44,
            height: 44,
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
