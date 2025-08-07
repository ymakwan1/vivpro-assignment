// /frontend/src/components/SearchBar.jsx
import React, { useState } from 'react';
import { Box, TextField, Button, Stack } from '@mui/material';

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(q); // empty string triggers reset in App
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {/* Stretch children so they share the tallest height */}
      <Stack direction="row" spacing={2} alignItems="stretch">
        <TextField
          label="Song title"
          variant="outlined"
          size="small"       // small TextField height = ~40px
          value={q}
          onChange={(e) => setQ(e.target.value)}
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          // Match TextField small height (theme spacing unit is 8px → 5 * 8 = 40px)
          sx={{ height: (theme) => theme.spacing(5) }}
        >
          Get
        </Button>
      </Stack>
    </Box>
  );
}
