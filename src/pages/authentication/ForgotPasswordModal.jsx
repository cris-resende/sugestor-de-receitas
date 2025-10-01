import React, { useState } from 'react';
import { Card, CardContent, Button, TextField, Typography, Stack, Grid } from '../../components';
import Authentication from '../../services/Authentication';

const ForgotPasswordModal = ({ onConfirm }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await Authentication.resetPassword(email);
      setMessage('Verifique seu e-mail para o link de redefinição de senha.');
    } catch (error) {
      console.error('Erro ao redefinir a senha:', error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid 
      container 
      justifyContent="center" 
      alignItems="center" 
      style={{ minHeight: '100vh' }}
    >
      <Grid item xs={12} sm={8} md={4}>
        <Card style={{ padding: 24, borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <CardContent>
            <form onSubmit={handleResetPassword}>
              <Stack spacing={2} style={{ width: '100%' }}>
                <Typography variant="h5" style={{ fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>
                  Esqueceu a senha?
                </Typography>
                <Typography variant="body2" color="textSecondary" style={{ textAlign: 'center' }}>
                  Digite seu e-mail para receber um link de redefinição.
                </Typography>
                <TextField
                  label="E-mail"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {message && (
                  <Typography variant="body2" style={{ color: message.includes('Verifique') ? 'green' : 'red', textAlign: 'center' }}>
                    {message}
                  </Typography>
                )}
                <Stack direction="row" spacing={2} justifyContent="center" style={{ marginTop: 16, width: '100%' }}>
                  <Button onClick={onConfirm} color="secondary" style={{ width: '50%' }}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="contained" color="primary" disabled={loading} style={{ width: '50%' }}>
                    {loading ? 'Enviando...' : 'Enviar Link'}
                  </Button>
                </Stack>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ForgotPasswordModal;