// /frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/songs',
});

export async function getSongs(page = 1, perPage = 10) {
  const res = await api.get('/', { params: { page, per_page: perPage } });
  return res.data; 
}

export async function getSongByTitle(title) {
  const res = await api.get(`/${encodeURIComponent(title)}`);
  return res.data; 
}

export async function rateSong(songId, rating) {
  const res = await api.post(`/${encodeURIComponent(songId)}/rate`, { rating });
  return res.data; 
}
