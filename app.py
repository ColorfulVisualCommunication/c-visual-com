from flask import Flask, render_template, jsonify


from models import load_products_from_db, load_product_from_db


app = Flask(__name__)


@app.route("/")  
def home_page():
    return render_template('home.html')

@app.route("/products") 
def product_page():
    products = load_products_from_db()
    return render_template('products.html', products=products)

@app.route("/api/products")
def list_products():
    products = load_products_from_db()
    return jsonify(products)

@app.route("/product/<id>")
def show_product(id):
    product = load_product_from_db(id)
    return jsonify(product)
  

@app.route("/login")
def login_page():
    return render_template('login.html')

@app.route("/register")
def register_page():
    return render_template('register.html')

if __name__ == '__main__':
  app.run(host='0.0.0.0', debug=True)