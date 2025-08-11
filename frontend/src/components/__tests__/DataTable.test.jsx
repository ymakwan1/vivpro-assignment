// /frontend/src/components/__tests__/DataTable.test.jsx
import { render, screen, fireEvent, within } from '@testing-library/react';
import DataTable from '../DataTable';

jest.mock('../RatingStars', () => {
  return function MockRatingStars({ song }) {
    return <span data-testid={`rating-${song.id}`}>{song.rating}</span>;
  };
});

const rows = [
  { id: '1', title: 'A Song', rating: 3, danceability: 0.5, energy: 0.7 },
  { id: '2', title: 'B Song', rating: 5, danceability: 0.4, energy: 0.6 },
];

function renderTable() {
  return render(
    <DataTable
      rows={rows}
      page={1}
      perPage={10}
      onPageChange={() => {}}
      onPerPageChange={() => {}}
      onRate={() => {}}
    />
  );
}

test('renders table rows', () => {
  renderTable();
  expect(screen.getByText('A Song')).toBeInTheDocument();
  expect(screen.getByText('B Song')).toBeInTheDocument();
  expect(screen.getByTestId('rating-1')).toHaveTextContent('3');
  expect(screen.getByTestId('rating-2')).toHaveTextContent('5');
});

test('sorts by rating when clicking the header', () => {
  renderTable();

  const ratingHeader = screen.getByRole('button', { name: /rating/i });
  fireEvent.click(ratingHeader); 
  fireEvent.click(ratingHeader); 

  const rowsEls = screen.getAllByRole('row');
  const firstDataRow = rowsEls[1];
  expect(within(firstDataRow).getByText('B Song')).toBeInTheDocument();
});
