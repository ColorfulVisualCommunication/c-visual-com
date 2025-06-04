from app import create_app
from app.extensions_celery import make_celery

flask_app = create_app()
celery = make_celery(flask_app)

import app.services.email_service