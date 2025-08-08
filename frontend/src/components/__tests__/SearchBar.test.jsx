// /frontend/src/components/__tests__/SearchBar.test.jsx

import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../SearchBar';


test('calls onSearch with the input value (and empty string)', () => {
  const onSearch = jest.fn();
  render(<SearchBar onSearch={onSearch} />);

  const input = screen.getByLabelText(/song title/i);
  fireEvent.change(input, { target: { value: '3AM' } });
  fireEvent.click(screen.getByRole('button', { name: /get/i }));
  expect(onSearch).toHaveBeenCalledWith('3AM');

  fireEvent.change(input, { target: { value: '' } });
  fireEvent.click(screen.getByRole('button', { name: /get/i }));
  expect(onSearch).toHaveBeenCalledWith('');
});


test('calls onSearch with case-insensitive input', () => {
  const onSearch = jest.fn();
  render(<SearchBar onSearch={onSearch} />);
  
  const input = screen.getByLabelText(/song title/i);
  fireEvent.change(input, { target: { value: '3am' } });
  fireEvent.click(screen.getByRole('button', { name: /get/i }));
  
  expect(onSearch).toHaveBeenCalledWith('3am');
});

test('handles invalid input gracefully', () => {
  const onSearch = jest.fn();
  render(<SearchBar onSearch={onSearch} />);
  
  const input = screen.getByLabelText(/song title/i);
  fireEvent.change(input, { target: { value: '@#$%' } });
  fireEvent.click(screen.getByRole('button', { name: /get/i }));
  
  expect(onSearch).toHaveBeenCalledWith('@#$%');
});

