import React, { useState } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import { Card, CardContent, CardActions, Button, TextField, Typography, Snackbar, Avatar, Grid, Stack, Modal } from '../../components';
import Authentication from '../../services/Authentication';
import ForgotPasswordModal from './ForgotPasswordModal';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginAttempts(prev => prev + 1);

    try {
      await Authentication.login(email, password);

      setSnackbarMsg('Login realizado com sucesso!');
      setShowSnackbar(true);
            setTimeout(() => {
        navigate('/home');
      }, 500);

    } catch (error) {
      console.error('Erro ao fazer login:', error);
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
            <form style={{ width: '100%' }} onSubmit={handleLogin}>
              <Stack direction="column" alignItems="center" spacing={2}>
                <Stack direction="column" alignItems="center" spacing={1}>
                  <Avatar style={{ width: 64, height: 64, background: '#1976d2' }} />
                  <Typography variant="h5" style={{ fontWeight: 700, marginBottom: 8 }}>
                    Login
                  </Typography>
                </Stack>
                <Stack spacing={2} style={{ width: '100%' }}>
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
                </Stack>
                <Stack style={{ width: '100%' }}>
                  <CardActions style={{ justifyContent: 'center', padding: 0 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      style={{ width: '100%' }}
                      disabled={loading}
                    >
                      {loading ? 'Entrando...' : 'Entrar'}
                    </Button>
                  </CardActions>
                </Stack>
                <Typography variant="body2" style={{ marginTop: 16 }}>
                  Não tem uma conta? <Link to="/register">Cadastre-se aqui</Link>
                </Typography>

                {loginAttempts >= 3 && (
                  <Typography variant="body2" style={{ marginTop: 8, textAlign: 'center' }}>
                    <a
                      href="#"
                      onClick={() => setShowForgotPasswordModal(true)}
                      style={{ textDecoration: 'underline' }}
                    >
                      Esqueceu a senha?
                    </a>
                  </Typography>
                )}

              </Stack>
            </form>
          </CardContent>
        </Card>
      </Grid>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        message={snackbarMsg}
      />

      <Modal open={showForgotPasswordModal} onClose={() => setShowForgotPasswordModal(false)}>
        <ForgotPasswordModal email={email} onConfirm={() => setShowForgotPasswordModal(false)} />
      </Modal>
    </Grid>
  );
};

export default Login;