// /frontend/src/components/Charts.jsx
import React, { useMemo } from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, BarChart, Bar } from 'recharts';

function makeHistogram(data, accessor, binSize = 10) {
  const counts = new Map();
  data.forEach(d => {
    const v = accessor(d);
    if (v == null || isNaN(v)) return;
    const bin = Math.floor(v / binSize) * binSize;
    counts.set(bin, (counts.get(bin) || 0) + 1);
  });
  return Array.from(counts.entries())
    .sort((a,b)=>a[0]-b[0])
    .map(([bin, count]) => ({ bin, count }));
}

export default function Charts({ rows }) {
  const danceScatter = useMemo(
    () => rows.map(r => ({ x: Number(r.danceability), y: Number(r.energy), name: r.title })),
    [rows]
  );

  const durationHist = useMemo(() => {
    return makeHistogram(rows, r => Number(r.duration_ms) / 1000, 10)
      .map(d => ({ binLabel: `${d.bin}-${d.bin + 9}s`, count: d.count }));
  }, [rows]);

  const topAcoustic = useMemo(() => {
    return [...rows]
      .filter(r => r.acousticness != null)
      .sort((a,b)=>Number(b.acousticness)-Number(a.acousticness))
      .slice(0, 15)
      .map(r => ({ name: r.title, value: Number(r.acousticness) }));
  }, [rows]);

  const topTempo = useMemo(() => {
    return [...rows]
      .filter(r => r.tempo != null)
      .sort((a,b)=>Number(b.tempo)-Number(a.tempo))
      .slice(0, 15)
      .map(r => ({ name: r.title, value: Number(r.tempo) }));
  }, [rows]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Scatter: Danceability vs Energy</Typography>
            <ScatterChart width={520} height={320}>
              <CartesianGrid />
              <XAxis dataKey="x" name="Danceability" />
              <YAxis dataKey="y" name="Energy" />
              <RTooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={danceScatter} />
            </ScatterChart>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Histogram: Duration (seconds, bins=10s)</Typography>
            <BarChart width={520} height={320} data={durationHist}>
              <CartesianGrid />
              <XAxis dataKey="binLabel" />
              <YAxis />
              <RTooltip />
              <Bar dataKey="count" />
            </BarChart>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Top Acousticness (15)</Typography>
            <BarChart width={520} height={320} data={topAcoustic}>
              <CartesianGrid />
              <XAxis dataKey="name" hide />
              <YAxis />
              <RTooltip />
              <Bar dataKey="value" />
            </BarChart>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Top Tempo (15)</Typography>
            <BarChart width={520} height={320} data={topTempo}>
              <CartesianGrid />
              <XAxis dataKey="name" hide />
              <YAxis />
              <RTooltip />
              <Bar dataKey="value" />
            </BarChart>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
