#backend/run.py
from app import create_app
from app.utils.normalize import normalize_and_insert_song_data
import logging

app = create_app()

if __name__ == "__main__":
    with app.app_context():
        try:
            normalize_and_insert_song_data()
        except Exception as e:
            app.logger.error(f"Error normalizing and inserting song data: {e}")
            
    app.run(host="0.0.0.0", port=5001)