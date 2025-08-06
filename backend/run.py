from app import create_app
from app.utils.normalize import normalize_and_insert_song_data

app = create_app()

if __name__ == "__main__":
    with app.app_context():
        try:
            normalize_and_insert_song_data()
        except Exception as e:
            print(f"Error occurred: {e}")
            
    app.run(debug = True)