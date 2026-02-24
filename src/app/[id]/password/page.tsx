'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Container, Typography, TextField, Button, Box, Paper, Alert 
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

export default function PasswordPage() {
  const params = useParams();
  const id = params.id as string;
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/verify-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shortCode: id, password }),
      });

      const data = await res.json();

      if (res.ok) {
        window.location.href = data.originalUrl;
      } else {
        setError(data.error || 'Incorrect password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      bgcolor: 'background.default' 
    }}>
      <Container maxWidth="xs">
        <Paper sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
          <Box sx={{ 
            display: 'inline-flex', 
            p: 2, 
            borderRadius: '50%', 
            bgcolor: 'primary.50', 
            color: 'primary.main', 
            mb: 3 
          }}>
            <LockIcon fontSize="large" />
          </Box>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Password Protected
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
            This link is protected by a password. Please enter it below to proceed.
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              type="password"
              label="Password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 3 }}
            />
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}
            <Button
              fullWidth
              variant="contained"
              type="submit"
              size="large"
              disabled={loading}
              sx={{ py: 1.5, borderRadius: 3 }}
            >
              {loading ? 'Verifying...' : 'Access Link'}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
