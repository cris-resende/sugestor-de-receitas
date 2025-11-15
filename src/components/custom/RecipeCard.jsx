import { Card, CardContent, Typography, Stack, Grid, Avatar } from "../index";
import { useNavigate } from "react-router-dom";

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();

  // Dados que virão da API da Spoonacular
  const { id, title, image, missedIngredientCount, usedIngredientCount } =
    recipe;

  const handleCardClick = () => {
    navigate(`/receitas/${id}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      style={{
        padding: 0,
        borderRadius: 16,
        cursor: "pointer",
        height: "100%",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        transition: "transform 0.2s",
      }}
    >
      <div
        style={{
          height: "150px", // Altura fixa para mobile
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
        }}
      />

      <CardContent>
        <Stack spacing={1}>
          <Typography
            variant="subtitle1"
            style={{ fontWeight: 700, minHeight: "40px" }}
          >
            {title}
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Avatar
                style={{
                  width: 24,
                  height: 24,
                  backgroundColor: "#4CAF50",
                  fontSize: "12px",
                }}
              >
                ✅
              </Avatar>
              <Typography
                variant="caption"
                color="textSecondary"
                style={{ fontWeight: 600 }}
              >
                {usedIngredientCount} USADOS
              </Typography>
            </Stack>

            <Stack direction="row" spacing={0.5} alignItems="center">
              <Avatar
                style={{
                  width: 24,
                  height: 24,
                  backgroundColor: "#F44336",
                  fontSize: "12px",
                }}
              >
                ❌
              </Avatar>
              <Typography variant="caption" color="textSecondary">
                {missedIngredientCount} FALTANDO
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
