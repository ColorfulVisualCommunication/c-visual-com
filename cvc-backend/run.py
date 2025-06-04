from app import create_app
from werkzeug.middleware.proxy_fix import ProxyFix
import os

app = create_app()
if os.environ.get("FLASK_ENV") == "production":
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_host=1, x_port=1, x_proto=1)
# Define the root route
@app.route("/")
def home():
    return {"message": "Welcome to Kamaru Backend API"}

if __name__ == "__main__":
    app.run(debug=True)
# To run the application, use the command: python main.py
# To run the application with Gunicorn, use the command: gunicorn -w 4 -k gthread -b