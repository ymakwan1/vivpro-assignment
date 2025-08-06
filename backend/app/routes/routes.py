from flask import Blueprint, jsonify, request
from app.models import db, Song

songs_bp = Blueprint('songs', __name__)

@songs_bp.route('/', methods=['GET'])
def get_all_songs():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    songs = Song.query.paginate(page, per_page, error_out=False)

    result = []

    for song in songs.items:
        result.append({
            'id': song.id,
            'title': song.title,
            'danceability': song.danceability,
            'energy': song.energy,
            'key': song.key,
            'loudness': song.loudness,
            'mode': song.mode,
            'acousticness': song.acousticness,
            'instrumentalness': song.instrumentalness,
            'liveness': song.liveness,
            'valence': song.valence,
            'tempo': song.tempo,
            'duration_ms': song.duration_ms,
            'time_signature': song.time_signature,
            'num_bars': song.num_bars,
            'num_sections': song.num_sections,
            'num_segments': song.num_segments,
            'class': song.class_,
            'rating': song.rating
        })

    return jsonify(result), 200

@songs_bp.route('/<string:title>', methods=['GET'])
def get_song_by_title(title):
    song = Song.query.filter(Song.title.ilike(title)).first()

    if not song:
        return jsonify({'error': 'Song not found'}), 404
    
    return jsonify({
        'id': song.id,
        'title': song.title,
        'danceability': song.danceability,
        'energy': song.energy,
        'key': song.key,
        'loudness': song.loudness,
        'mode': song.mode,
        'acousticness': song.acousticness,
        'instrumentalness': song.instrumentalness,
        'liveness': song.liveness,
        'valence': song.valence,
        'tempo': song.tempo,
        'duration_ms': song.duration_ms,
        'time_signature': song.time_signature,
        'num_bars': song.num_bars,
        'num_sections': song.num_sections,
        'num_segments': song.num_segments,
        'class': song.class_,
        'rating': song.rating
    }), 200

@songs_bp.route('/<string:song_id>/rate', methods=['POST'])
def rate_song(song_id):
    song = Song.query.get(song_id)

    if not song:
        return jsonify({'error': 'Song not found'}), 404

    data = request.get_json()
    rating = data.get('rating')

    if not rating:
        return jsonify({'error': 'Rating is required'}), 400
    
    if not isinstance(rating, (int, float)) or not (0 <= rating <= 5):
        return jsonify({'error': 'Rating must be a number between 0 and 5'}), 400

    song.rating = rating
    db.session.commit()

    return jsonify({
        "message": f"Rating updated for song '{song.title}'",
        "rating": song.rating
    }), 200