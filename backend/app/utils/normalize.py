#backend/app/utils/normalize.py
import json, os, logging
from app.models import Song
from app import db

def normalize_and_insert_song_data(json_path = 'app/data/playlist.json'):
    if not os.path.exists(json_path):
        logging.warning(f"File {json_path} does not exist.")
        return
    
    with open(json_path, 'r') as file:
        try:
            raw_data = json.load(file)
        except json.JSONDecodeError as e:
            logging.error(f"Error decoding JSON: {e}")
            return

    if not isinstance(raw_data, dict):
        logging.error("Expected a column-wise JSON dictionary.")
        return
    
    try:
        num_items = len(next(iter(raw_data.values())))
        normalized_data = [
            {key: value[str(i)] for key, value in raw_data.items()}
            for i in range(num_items)
        ]
    except Exception as e:
        logging.error(f"Error normalizing data: {e}")
        return
    
    if Song.query.first() is not None:
        logging.info("Songs already exist in the database.")
        return
    
    song_objects = []
    for item in normalized_data:
        try:
            song = Song(
                id=item['id'],
                title=item['title'],
                danceability=float(item.get('danceability', 0)),
                energy=float(item.get('energy', 0)),
                key=int(item.get('key', 0)),
                loudness=float(item.get('loudness', 0)),
                mode=int(item.get('mode', 0)),
                acousticness=float(item.get('acousticness', 0)),
                instrumentalness=float(item.get('instrumentalness', 0)),
                liveness=float(item.get('liveness', 0)),
                valence=float(item.get('valence', 0)),
                tempo=float(item.get('tempo', 0)),
                duration_ms=int(item.get('duration_ms', 0)),
                time_signature=int(item.get('time_signature', 0)),
                num_bars=int(item.get('num_bars', 0)),
                num_sections=int(item.get('num_sections', 0)),
                num_segments=int(item.get('num_segments', 0)),
                class_=int(item.get('class', 0))
            )
            song_objects.append(song)
        except KeyError as e:
            logging.error(f"Missing key in item {item}: {e}")
            continue
        except Exception as e:
            logging.error(f"Error creating Song object from item {item}: {e}")
            continue

    if song_objects:
        try:
            db.session.bulk_save_objects(song_objects)
            db.session.commit()
            logging.info(f"Inserted {len(song_objects)} songs into the database.")
        except Exception as e:
            db.session.rollback()
            logging.error(f"Error inserting songs into the database: {e}")
    else:
        logging.info("No valid song entries found to insert.")