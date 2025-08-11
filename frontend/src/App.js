// frontend/src/App.js
import React, { useEffect, useState, useCallback } from 'react';
import { Container, Typography, Stack, Divider, Alert, CircularProgress, Paper } from '@mui/material';
import { getSongs, getSongByTitle } from './services/api';
import SearchBar from './components/SearchBar';
import DataTable from './components/DataTable';
import Charts from './components/Charts';

export default function App() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPage = useCallback(async (p = page, pp = perPage) => {
    setLoading(true);
    setError('');
    try {
      const data = await getSongs(p, pp);
      if (!Array.isArray(data)) throw new Error('Unexpected shape from /songs; expected an array');
      setRows(data);
    } catch (e) {
      setError(e?.response?.data?.error || e.message || 'Failed to load songs');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [page, perPage]);

  useEffect(() => { fetchPage(page, perPage); }, [page, perPage, fetchPage]);

  const handleSearch = async (title) => {
  const trimmed = (title || '').trim();

  if (!trimmed) {
    setError('');
    setPage(1);
    try {
      setLoading(true);
      await fetchPage(1, perPage);
    } finally {
      setLoading(false);
    }
    return;
  }

  setLoading(true);
  setError('');
  try {
    const song = await getSongByTitle(trimmed);
    setRows([song]);
    setPage(1);
  } catch (e) {
    setError(e?.response?.data?.error || 'Song not found');
    setRows([]);
  } finally {
    setLoading(false);
  }
};


  const handleRated = (songId, rating) => {
    setRows(prev =>
      prev.map(r =>
        r.id === songId ? { ...r, rating: Number(rating) } : r
      )
    );
  };


  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>Songs Dashboard</Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <SearchBar onSearch={handleSearch} />
      </Stack>

      <Divider sx={{ my: 2 }} />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress />
        </Paper>
      ) : (
        <>
          <DataTable
            rows={rows}
            page={page}
            perPage={perPage}
            onPageChange={(p) => setPage(p)}
            onPerPageChange={(pp) => { setPerPage(pp); setPage(1); }}
            onRate={handleRated}
          />

          <Divider sx={{ my: 3 }} />
          <Typography variant="h5" gutterBottom>Visualizations</Typography>
          <Charts rows={rows} />
        </>
      )}
    </Container>
  );
}
