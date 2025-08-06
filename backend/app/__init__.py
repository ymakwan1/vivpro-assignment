from flask import Flask
from flask_cors import CORS
from app.models import db
from app.routes import songs_bp

def create_app():
    app = Flask(__name__)

    CORS(app)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///songs.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    with app.app_context():
        db.create_all()

    app.register_blueprint(songs_bp, url_prefix='/songs')

    return app