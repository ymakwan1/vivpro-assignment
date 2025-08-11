// /frontend/src/components/RatingStars.jsx
import React, { useState } from 'react';
import { Rating, Tooltip } from '@mui/material';
import { rateSong } from '../services/api';

export default function RatingStars({ song, onRated }) {
  const [value, setValue] = useState(song.rating ?? 0);
  const [loading, setLoading] = useState(false);

  const handleChange = async (_e, newValue) => {
    const safe = typeof newValue === 'number' ? newValue : 0;
    setValue(safe);
    setLoading(true);
    try {
      await rateSong(song.id, safe);
      onRated?.(song.id, safe);
    } catch (e) {
      setValue(song.rating ?? 0);
      alert('Failed to save rating');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip title={loading ? 'Saving...' : 'Click to rate (0–5)'}>
      <span>
        <Rating
          value={Number(value)}
          precision={1}
          max={5}
          disabled={loading}
          onChange={handleChange}
        />
      </span>
    </Tooltip>
  );
}
