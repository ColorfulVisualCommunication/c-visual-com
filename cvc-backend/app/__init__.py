from flask import Flask
from .extensions import db, migrate, jwt, mail, limiter
from config import Config
from .extensions_cloudinary import init_cloudinary

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

# # Initialize the extensions with the app instance 
    db.init_app(app) # Initialize Flask-SQLAlchemy
    migrate.init_app(app, db) # Initialize Flask-Migrate
    jwt.init_app(app) # Initialize Flask-JWT-Extended
    mail.init_app(app) # Initialize Flask-Mail
    init_cloudinary(app) # Initialize Cloudinary
    limiter.init_app(app) # Initialize the rate limiter

# # Register blueprints for different routes
    from app.routes.auth_routes import auth_bp
    from app.routes.user_routes import user_bp
    from app.routes.product_routes import product_bp
    from app.routes.order_routes import order_bp
    from app.routes.portfolio_routes import portfolio_bp
    from app.routes.blog_routes import blog_bp
    from app.routes.mpesa_routes import mpesa_bp
    from app.routes.newsletter_routes import newsletter_bp

    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
    app.register_blueprint(user_bp, url_prefix='/api/v1/user')
    app.register_blueprint(product_bp, url_prefix='/api/v1/products')
    app.register_blueprint(order_bp, url_prefix='/api/v1/orders')
    app.register_blueprint(portfolio_bp, url_prefix='/api/v1/projects')
    app.register_blueprint(blog_bp, url_prefix='/api/v1/blogs')
    app.register_blueprint(mpesa_bp, url_prefix='/api/v1/mpesa')
    app.register_blueprint(newsletter_bp, url_prefix='/api/v1/newsletter')
    
    return app
# # To run the application, use the command: python main.py
# # To run the application with Gunicorn, use the command: gunicorn -w 4 -k gthread -b