'use client';
import React, { useState } from 'react';
import { 
  Container, Typography, TextField, Button, Box, Paper, Link, 
  Alert, IconButton, InputAdornment, Grid, Card, CardContent 
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LinkIcon from '@mui/icons-material/Link';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import BarChartIcon from '@mui/icons-material/BarChart';

export default function Home() {
  const [url, setUrl] = useState('');
  const [password, setPassword] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShortUrl('');
    setCopied(false);
    
    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      
      setShortUrl(data.shortUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const features = [
    { icon: <SpeedIcon color="primary" />, title: 'Fast', description: 'Instant shortening and redirection.' },
    { icon: <SecurityIcon color="primary" />, title: 'Secure', description: 'HTTPS encryption for all links.' },
    { icon: <BarChartIcon color="primary" />, title: 'Analytics', description: 'Track clicks and engagement.' },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #EEF2FF 0%, #F8FAFC 100%)' 
    }}>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ display: 'inline-flex', p: 1.5, borderRadius: 3, bgcolor: 'primary.main', color: 'white', mb: 2 }}>
            <LinkIcon sx={{ fontSize: 40 }} />
          </Box>
          <Typography variant="h2" component="h1" gutterBottom color="textPrimary" sx={{ letterSpacing: '-0.02em' }}>
            Shorty<Box component="span" sx={{ color: 'primary.main' }}>.</Box>
          </Typography>
          <Typography variant="h5" color="textSecondary" sx={{ fontWeight: 400, maxWidth: 600, mx: 'auto' }}>
            The simple way to shorten your long URLs and track their performance.
          </Typography>
        </Box>
        
        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, mb: 8 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 9 }}>
                <TextField
                  fullWidth
                  label="Paste your long URL"
                  variant="outlined"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  placeholder="https://example.com/very/long/path/to/something"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
                <TextField
                  fullWidth
                  label="Password (optional)"
                  variant="outlined"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Protect your link"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  size="large"
                  disabled={loading}
                  sx={{ height: '56px', borderRadius: 3, fontSize: '1rem' }}
                >
                  {loading ? 'Shortening...' : 'Shorten'}
                </Button>
              </Grid>
            </Grid>
          </form>

          {error && (
            <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {shortUrl && (
            <Box sx={{ 
              mt: 4, p: 3, 
              bgcolor: 'primary.50', 
              borderRadius: 3, 
              border: '1px dashed', 
              borderColor: 'primary.200' 
            }}>
              <Typography variant="subtitle2" color="primary.dark" gutterBottom fontWeight="bold">
                Success! Your shortened link is ready:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={shortUrl}
                  slotProps={{
                    input: {
                      readOnly: true,
                      sx: { bgcolor: 'white', borderRadius: 2 },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={copyToClipboard} edge="end" color={copied ? "success" : "primary"}>
                            <ContentCopyIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="textSecondary">
                  {copied ? 'Copied to clipboard!' : 'Click the icon to copy'}
                </Typography>
                <Link href={shortUrl} target="_blank" rel="noopener" sx={{ fontWeight: 600, textDecoration: 'none' }}>
                  Open Link &rarr;
                </Link>
              </Box>
            </Box>
          )}
        </Paper>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Card variant="outlined" sx={{ height: '100%', borderRadius: 4, border: 'none', bgcolor: 'transparent' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box component="footer" sx={{ py: 4, mt: 'auto', textAlign: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="body2" color="textSecondary">
          &copy; {new Date().getFullYear()} Shorty URL Shortener. Built with Next.js & MUI.
        </Typography>
      </Box>
    </Box>
  );
}
