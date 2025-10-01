import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardActions, Button, TextField, Typography, Snackbar, Avatar, Grid, Stack } from '../../components';
import Authentication from '../../services/Authentication';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      setSnackbarMsg('Preencha todos os campos!');
      setShowSnackbar(true);
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setSnackbarMsg('As senhas não coincidem!');
      setShowSnackbar(true);
      setLoading(false);
      return;
    }

    try {
      await Authentication.register(email, password);

      setSnackbarMsg('Cadastro realizado com sucesso! Verifique seu e-mail para confirmar a conta.');
      setShowSnackbar(true);

      // Limpar os campos do formulário
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

    } catch (error) {
      console.error('Erro ao registrar:', error);
      setSnackbarMsg(error.message);
      setShowSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: '16px' }}
    >
      <Grid item xs={12} sm={8} md={4}>
        <Card style={{ padding: 24, borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <CardContent>
            <form style={{ width: '100%' }} onSubmit={handleRegister}>
              <Stack direction="column" alignItems="center" spacing={2}>
                <Stack direction="column" alignItems="center" spacing={1}>
                  <Avatar style={{ width: 64, height: 64, background: '#1976d2' }} />
                  <Typography variant="h5" style={{ fontWeight: 700, marginBottom: 8 }}>
                    Cadastro
                  </Typography>
                </Stack>
                <Stack spacing={2} style={{ width: '100%' }}>
                  <TextField
                    label="Nome"
                    type="text"
                    fullWidth
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                  <TextField
                    label="E-mail"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                  <TextField
                    label="Senha"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <TextField
                    label="Confirmar Senha"
                    type="password"
                    fullWidth
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                  />
                </Stack>
                <Stack style={{ width: '100%' }}>
                  <CardActions style={{ justifyContent: 'center', padding: 0 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      style={{ width: '100%' }}
                      onClick={handleRegister}
                      disabled={loading}
                    >
                      {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </Button>
                  </CardActions>
                </Stack>
                <Typography variant="body2" style={{ marginTop: 16 }}>
                  Já tem uma conta? <Link to="/login">Entre aqui</Link>
                </Typography>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Grid>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar(false)}
        message={snackbarMsg}
      />
    </Grid>
  );
};

export default Register;