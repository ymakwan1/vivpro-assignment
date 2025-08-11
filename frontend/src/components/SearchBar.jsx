// /frontend/src/components/SearchBar.jsx
import React, { useState } from 'react';
import { Box, TextField, Button, Stack } from '@mui/material';

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(q);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack direction="row" spacing={2} alignItems="stretch">
        <TextField
          label="Song title"
          variant="outlined"
          size="small"      
          value={q}
          onChange={(e) => setQ(e.target.value)}
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ height: (theme) => theme.spacing(5) }}
        >
          Get
        </Button>
      </Stack>
    </Box>
  );
}
