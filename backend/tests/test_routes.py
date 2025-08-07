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

    song1 = Song(
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

    song2 = Song(
        id="test124",
        title="Another Song",
        danceability=0.65,
        energy=0.9,
        key=3,
        loudness=-6.5,
        mode=0,
        acousticness=0.2,
        instrumentalness=0.1,
        liveness=0.3,
        valence=0.4,
        tempo=130.0,
        duration_ms=180000,
        time_signature=3,
        num_bars=60,
        num_sections=4,
        num_segments=12,
        class_=2
    )

    db.session.add_all([song1, song2])
    db.session.commit()

    yield app.test_client()

    db.session.remove()
    db.drop_all()
    db.engine.dispose()      
    app_context.pop()   

# GET /songs
def test_get_all_songs(client):
    response = client.get('/songs/')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert len(data) == 2
    assert data[0]['title'] == "Test Song"
    assert data[1]['title'] == "Another Song"

def test_get_all_songs_with_pagination(client):
    response = client.get('/songs/?page=1&per_page=2')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert len(data) == 2
    
def test_get_all_songs_invalid_page_param(client):
    response = client.get('/songs/?page=abc&per_page=1')
    assert response.status_code == 400  # Flask will likely return 400 for bad query param type

def test_get_all_songs_invalid_per_page_param(client):
    response = client.get('/songs/?page=1&per_page=xyz')
    assert response.status_code == 400

def test_get_all_songs_negative_page(client):
    response = client.get('/songs/?page=-1&per_page=1')
    assert response.status_code == 400
    assert response.get_json()['error'] == 'Invalid pagination parameters. Must be positive integers.'


def test_get_all_songs_negative_per_page(client):
    response = client.get('/songs/?page=1&per_page=-5')
    assert response.status_code == 400 or response.status_code == 200  # Depends on app config

def test_get_all_songs_zero_per_page(client):
    response = client.get('/songs/?per_page=0')
    assert response.status_code == 400 or response.status_code == 200

def test_get_all_songs_out_of_bounds_page(client):
    response = client.get('/songs/?page=9999&per_page=10')
    assert response.status_code == 200
    assert response.get_json() == []  # Should return empty list when no results

# GET /songs/<title>
def test_get_song_by_title_exact(client):
    response = client.get('/songs/Test Song')
    assert response.status_code == 200
    data = response.get_json()
    assert data['title'] == 'Test Song'

def test_get_song_by_title_case_insensitive(client):
    response = client.get('/songs/test song')
    assert response.status_code == 200
    data = response.get_json()
    assert data['title'] == 'Test Song'

def test_get_song_by_title_not_found(client):
    response = client.get('/songs/NonExistent')
    assert response.status_code == 404
    assert response.get_json()['error'] == 'Song not found'

# POST /songs/<id>/rate
def test_rate_song_valid(client):
    response = client.post('/songs/test123/rate', json={'rating': 4.5})
    assert response.status_code == 200
    data = response.get_json()
    assert "Rating updated" in data['message']
    assert data['rating'] == pytest.approx(4.5)

def test_rate_song_not_found(client):
    response = client.post('/songs/invalid_id/rate', json={'rating': 4})
    assert response.status_code == 404
    assert response.get_json()['error'] == 'Song not found'

def test_rate_song_rating_missing(client):
    response = client.post('/songs/test123/rate', json={})
    assert response.status_code == 400
    assert response.get_json()['error'] == 'Rating is required'

def test_rate_song_rating_non_numeric(client):
    response = client.post('/songs/test123/rate', json={'rating': 'five'})
    assert response.status_code == 400
    assert response.get_json()['error'] == 'Rating must be a number between 0 and 5'

def test_rate_song_rating_below_zero(client):
    response = client.post('/songs/test123/rate', json={'rating': -1})
    assert response.status_code == 400
    assert response.get_json()['error'] == 'Rating must be a number between 0 and 5'

def test_rate_song_rating_above_five(client):
    response = client.post('/songs/test123/rate', json={'rating': 6})
    assert response.status_code == 400
    assert response.get_json()['error'] == 'Rating must be a number between 0 and 5'

def test_rate_song_decimal(client):
    response = client.post('/songs/test123/rate', json={'rating': 3.75})
    assert response.status_code == 200
    assert response.get_json()['rating'] == pytest.approx(3.75)
