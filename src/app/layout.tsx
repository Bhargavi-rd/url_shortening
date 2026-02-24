import * as React from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import { AppBar, Toolbar, Typography, Container, Box, Button, Stack } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import Link from 'next/link';
import { Providers } from '@/components/Providers';

export const metadata = {
  title: 'Shorty | Modern URL Shortener',
  description: 'Shorten your long URLs quickly and securely',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'white' }}>
                <Container maxWidth="lg">
                  <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                    <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <LinkIcon color="primary" sx={{ fontSize: 28 }} />
                      <Typography
                        variant="h6"
                        noWrap
                        sx={{
                          fontWeight: 800,
                          letterSpacing: '-0.02em',
                          color: 'text.primary',
                        }}
                      >
                        Shorty<Box component="span" sx={{ color: 'primary.main' }}>.</Box>
                      </Typography>
                    </Link>
                    
                    <Stack direction="row" spacing={2}>
                      <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                        <Button color="inherit" sx={{ fontWeight: 600 }}>
                          Dashboard
                        </Button>
                      </Link>
                      <Link href="/login" style={{ textDecoration: 'none' }}>
                        <Button variant="contained" sx={{ fontWeight: 600, borderRadius: 2 }}>
                          Login
                        </Button>
                      </Link>
                    </Stack>
                  </Toolbar>
                </Container>
              </AppBar>
              {children}
            </ThemeProvider>
          </AppRouterCacheProvider>
        </Providers>
      </body>
    </html>
  );
}
