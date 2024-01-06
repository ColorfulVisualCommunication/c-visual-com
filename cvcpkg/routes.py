from flask import render_template

from cvcpkg import app
from cvcpkg.models import Product


@app.route("/")  
def home_page():
    return render_template('home.html')

@app.route("/product") 
def product_page():
    products=Product.query.all()
    return render_template('product.html', products=products)

@app.route("/login")
def login_page():
    return render_template('login.html')

@app.route("/register")
def register_page():
    return render_template('register.html')