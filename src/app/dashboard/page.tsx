'use client';
import React, { useEffect, useState } from 'react';
import { 
  Container, Typography, Box, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, IconButton, 
  Link, Chip, Button 
} from '@mui/material';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LockIcon from '@mui/icons-material/Lock';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

interface UrlEntry {
  id: number;
  original: string;
  shortCode: string;
  clicks: number;
  password?: string | null;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [links, setLinks] = useState<UrlEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchLinks();
    }
  }, [status, router]);

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/user-links');
      const data = await res.json();
      if (res.ok) {
        setLinks(data.links);
      }
    } catch (err) {
      console.error('Error fetching links:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (shortCode: string) => {
    const url = `${window.location.origin}/${shortCode}`;
    navigator.clipboard.writeText(url);
  };

  if (status === 'loading' || loading) {
    return <Typography sx={{ p: 4 }}>Loading...</Typography>;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider', py: 2 }}>
        <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight="bold" color="primary">
            Shorty Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="textSecondary">
              {session?.user?.email}
            </Typography>
            <Button 
              size="small" 
              variant="outlined" 
              color="error" 
              startIcon={<ExitToAppIcon />}
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              Logout
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight="bold">
            Your Links
          </Typography>
          <Button variant="contained" onClick={() => router.push('/')}>
            Create New Link
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead sx={{ bgcolor: 'grey.50' }}>
              <TableRow>
                <TableCell><Typography fontWeight="bold">Short Code</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Original URL</Typography></TableCell>
                <TableCell align="center"><Typography fontWeight="bold">Clicks</Typography></TableCell>
                <TableCell align="center"><Typography fontWeight="bold">Status</Typography></TableCell>
                <TableCell align="right"><Typography fontWeight="bold">Actions</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {links.map((link) => (
                <TableRow key={link.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Link href={`/${link.shortCode}`} target="_blank" sx={{ fontWeight: 600 }}>
                        {link.shortCode}
                      </Link>
                      <IconButton size="small" onClick={() => copyToClipboard(link.shortCode)}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {link.original}
                  </TableCell>
                  <TableCell align="center">
                    <Chip label={link.clicks} size="small" color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell align="center">
                    {link.password ? (
                      <Chip 
                        icon={<LockIcon sx={{ fontSize: '14px !important' }} />} 
                        label="Protected" 
                        size="small" 
                        color="warning" 
                        variant="outlined" 
                      />
                    ) : (
                      <Chip label="Public" size="small" color="success" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" onClick={() => window.open(link.original, '_blank')}>
                      Visit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {links.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                    <Typography color="textSecondary">
                      You haven't created any links yet.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
}
