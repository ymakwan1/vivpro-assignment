#backend/app/__init__.py
from flask import Flask
from flask_cors import CORS
from app.models import db
from app.routes import songs_bp
import logging
from config import DevelopmentConfig

def create_app(config_class=DevelopmentConfig):
    app = Flask(__name__)

    CORS(app)

    app.config.from_object(config_class)

    db.init_app(app)

    with app.app_context():
        db.create_all()

    app.register_blueprint(songs_bp, url_prefix='/songs')

    logging.basicConfig(level=logging.INFO)
    app.logger.setLevel(logging.INFO)

    return app