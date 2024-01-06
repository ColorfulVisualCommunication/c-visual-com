from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cvc.db'
db = SQLAlchemy(app)

from cvcpkg import routes #type: ignore
