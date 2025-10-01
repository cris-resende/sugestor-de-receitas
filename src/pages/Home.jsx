import { Card, CardContent, Button, Typography, Stack, Grid } from '../components';

const Home = () => {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: '16px' }}
    >
      <Grid item xs={12} sm={8} md={6}>
        <Card style={{ padding: 24, borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <CardContent>
            <Stack spacing={4} alignItems="center">
              <Typography variant="h4" style={{ fontWeight: 700, color: '#333' }}>
                Bem-vindo ao Sugestor de Receitas!
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Descubra receitas deliciosas com os ingredientes que você já tem em casa.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                style={{ width: '100%', maxWidth: '300px' }}
              >
                Começar
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Home;