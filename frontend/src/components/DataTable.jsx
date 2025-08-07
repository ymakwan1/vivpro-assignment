// /frontend/src/components/DataTable.jsx
import React, { useMemo, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableSortLabel, Paper, TablePagination, IconButton, Tooltip
} from '@mui/material';
import GetAppIcon from '@mui/icons-material/Download';
import Papa from 'papaparse';
import RatingStars from './RatingStars';

// Updated comparator to handle null/undefined as 0
function descendingComparator(a, b, orderBy) {
  const aVal = Number(a[orderBy] ?? 0);
  const bVal = Number(b[orderBy] ?? 0);
  if (bVal < aVal) return -1;
  if (bVal > aVal) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export default function DataTable({
  rows,
  page, perPage,
  onPageChange, onPerPageChange,
  onRate
}) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('title');

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedRows = useMemo(() => {
    const comp = getComparator(order, orderBy);
    return [...rows].sort(comp);
  }, [rows, order, orderBy]);

  const handleDownloadCsv = () => {
    const csv = Papa.unparse(sortedRows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'songs_page.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const columns = [
    { id: 'title', label: 'Title' },
    { id: 'danceability', label: 'Dance' },
    { id: 'energy', label: 'Energy' },
    { id: 'key', label: 'Key' },
    { id: 'loudness', label: 'Loud' },
    { id: 'mode', label: 'Mode' },
    { id: 'acousticness', label: 'Acoustic' },
    { id: 'instrumentalness', label: 'Instr' },
    { id: 'liveness', label: 'Live' },
    { id: 'valence', label: 'Valence' },
    { id: 'tempo', label: 'Tempo' },
    { id: 'duration_ms', label: 'Dur (ms)' },
    { id: 'time_signature', label: 'TSig' },
    { id: 'num_bars', label: 'Bars' },
    { id: 'num_sections', label: 'Secs' },
    { id: 'num_segments', label: 'Segs' },
   // { id: 'class', label: 'Class' },
    { id: 'rating', label: 'Rating' } // Now sortable
  ];

  return (
    <Paper>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map(col => (
                <TableCell key={col.id}>
                  <TableSortLabel
                    active={orderBy === col.id}
                    direction={orderBy === col.id ? order : 'asc'}
                    onClick={() => handleSort(col.id)}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell align="right" padding="checkbox">
                <Tooltip title="Download current page CSV">
                  <IconButton onClick={handleDownloadCsv} size="small">
                    <GetAppIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedRows.map((row) => (
              <TableRow key={row.id} hover>
                {columns.map(col => (
                  <TableCell key={col.id}>
                    {col.id === 'rating' ? (
                      <RatingStars song={row} onRated={onRate} />
                    ) : (
                      row[col.id]
                    )}
                  </TableCell>
                ))}
                <TableCell />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Unknown total mode: next/prev only */}
      <TablePagination
        component="div"
        count={-1}
        page={page - 1}
        onPageChange={(_e, newPageIndex) => onPageChange(newPageIndex + 1)}
        rowsPerPage={perPage}
        onRowsPerPageChange={(e) => onPerPageChange(parseInt(e.target.value, 10))}
        rowsPerPageOptions={[10, 25, 50, 100]}
        labelDisplayedRows={({ from, to }) => `${from}-${to}`}
        nextIconButtonProps={{ 'aria-label': 'Next Page' }}
        backIconButtonProps={{ 'aria-label': 'Previous Page' }}
      />
    </Paper>
  );
}
