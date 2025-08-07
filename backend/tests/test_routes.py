#backend/tests/test_routes.py
from app import create_app
import pytest
from app.models import db, Song
from config import TestingConfig

@pytest.fixture
def client():
    app = create_app(config_class=TestingConfig)

    app_context = app.app_context()
    app_context.push()

    db.create_all()

    song = Song(
        id="test123",
        title="Test Song",
        danceability=0.7,
        energy=0.8,
        key=5,
        loudness=-5.0,
        mode=1,
        acousticness=0.1,
        instrumentalness=0.0,
        liveness=0.2,
        valence=0.6,
        tempo=120.0,
        duration_ms=210000,
        time_signature=4,
        num_bars=80,
        num_sections=5,
        num_segments=10,
        class_=1
    )

    db.session.add(song)
    db.session.commit()

    yield app.test_client()

    db.session.remove()
    db.drop_all()
    db.engine.dispose()      
    app_context.pop()   

def test_get_all_songs(client):
    response = client.get('/songs/')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert len(data) == 1
    assert data[0]['title'] == "Test Song"

def test_get_song_by_title(client):
    response = client.get('/songs/Test Song')
    assert response.status_code == 200
    data = response.get_json()
    assert data['id'] == 'test123'
    assert data['title'] == 'Test Song'

def test_song_not_found(client):
    response = client.get('/songs/Unknown')
    assert response.status_code == 404

def test_rate_song(client):
    response = client.post('/songs/test123/rate', json={'rating': 4.5})
    assert response.status_code == 200
    assert response.get_json()['rating'] == pytest.approx(4.5)

def test_rate_song_invalid(client):
    response = client.post('/songs/test123/rate', json={})
    assert response.status_code == 400

def test_get_song_by_title_not_found(client):
    response = client.get('/songs/NonExistentSong')
    assert response.status_code == 404
    assert response.get_json()['error'] == 'Song not found'


def test_rate_song_not_found(client):
    response = client.post('/songs/invalid_id/rate', json={'rating': 4.5})
    assert response.status_code == 404
    assert response.get_json()['error'] == 'Song not found'


def test_rate_song_invalid_rating_missing(client):
    response = client.post('/songs/test123/rate', json={})
    assert response.status_code == 400
    assert response.get_json()['error'] == 'Rating is required'


def test_rate_song_invalid_rating_non_numeric(client):
    response = client.post('/songs/test123/rate', json={'rating': 'bad'})
    assert response.status_code == 400
    assert response.get_json()['error'] == 'Rating must be a number between 0 and 5'


def test_rate_song_invalid_rating_out_of_bounds(client):
    response = client.post('/songs/test123/rate', json={'rating': 10})
    assert response.status_code == 400
    assert response.get_json()['error'] == 'Rating must be a number between 0 and 5'
