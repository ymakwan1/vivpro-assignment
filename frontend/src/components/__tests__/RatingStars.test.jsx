// /frontend/src/components/__tests__/RatingStars.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RatingStars from '../RatingStars';

jest.mock('../../services/api', () => ({
  rateSong: jest.fn(),
}));

import { rateSong } from '../../services/api';

beforeEach(() => {
  jest.clearAllMocks();
});

test('clicking a star calls rateSong and onRated', async () => {
  rateSong.mockResolvedValue({ message: 'OK', rating: 4 });

  const onRated = jest.fn();
  render(<RatingStars song={{ id: '1', title: '3AM', rating: 0 }} onRated={onRated} />);

  const radios = screen.getAllByRole('radio'); 
  fireEvent.click(radios[3]); 

  await waitFor(() => {
    expect(rateSong).toHaveBeenCalledWith('1', 4);
    expect(onRated).toHaveBeenCalledWith('1', 4);
  });
});

test('handles API error gracefully', async () => {
  rateSong.mockRejectedValue(new Error('API Error'));

  const onRated = jest.fn();
  render(<RatingStars song={{ id: '1', title: '3AM', rating: 0 }} onRated={onRated} />);

  const radios = screen.getAllByRole('radio');
  fireEvent.click(radios[3]); 

  await waitFor(() => {
    expect(onRated).not.toHaveBeenCalled();
  });
});

test('allows resetting rating to 0 (click "Empty")', async () => {
  rateSong.mockResolvedValue({ message: 'OK', rating: 0 });

  const onRated = jest.fn();
  render(<RatingStars song={{ id: '1', title: '3AM', rating: 4 }} onRated={onRated} />);

  const emptyRadio = screen.getByLabelText(/empty/i);
  fireEvent.click(emptyRadio);

  await waitFor(() => {
    expect(rateSong).toHaveBeenCalledWith('1', 0);
    expect(onRated).toHaveBeenCalledWith('1', 0);
  });
});
