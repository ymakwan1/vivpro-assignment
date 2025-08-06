import json, os
from app.models.song import Song
from app import db

def normalize_and_insert_song_data(json_path = 'data/playlist.json'):

    if not os.path.exists(json_path):
        print(f"File {json_path} does not exist.")
        return
    
    with open(json_path, 'r') as file:
        try:
            raw_data = json.load(file)
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
            return

    if not isinstance(raw_data, list):
        print("JSON data is not a list.")
        return
    
    if Song.query.first() is not None:
        print("Songs already exist in the database.")
        return
    
    song_objects = []
    for item in raw_data:
        try:
            song = Song(
                id = item['id'],
                title=item['title'],
                danceability=item['danceability'],
                energy=item['energy'],
                key=item['key'],
                loudness=item['loudness'],
                mode=item['mode'],
                acousticness=item['acousticness'],
                instrumentalness=item['instrumentalness'],
                liveness=item['liveness'],
                valence=item['valence'],
                tempo=item['tempo'],
                duration_ms=item['duration_ms'],
                time_signature=item['time_signature'],
                num_bars=item['num_bars'],
                num_sections=item['num_sections'],
                num_segments=item['num_segments'],
                class_=item['class'],
                rating=item.get('rating', 0.0)
            )
            song_objects.append(song)
        except KeyError as e:
            print(f"Missing key in item {item}: {e}")
            continue
        except Exception as e:
            print(f"Error creating Song object from item {item}: {e}")
            continue

    if song_objects:
        try:
            db.session.bulk_save_objects(song_objects)
            db.session.commit()
            print(f"Inserted {len(song_objects)} songs into the database.")
        except Exception as e:
            db.session.rollback()
            print(f"Error inserting songs into the database: {e}")
        else:
            print("No valid song entries found to insert.")