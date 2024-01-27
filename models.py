import os
from sqlalchemy import create_engine, text


engine = create_engine(os.environ['DB_CONNECTION_STRING'])

#this method is running a SQL query to select all rows from a table called "products" 
#by iterating the index of rows in the table using range() and len()

def load_products_from_db():
  with engine.connect() as conn:
    result = conn.execute(text("select * from products"))
    rows = result.all()
    products = []
    # Iterating the index of rows in the table using range() and len()
    for i in range(len(rows)):
      val = rows[i]
      products.append(dict(zip(result.keys(), val, strict=False)))
    return products


#this method is running a SQL query to select rows from a table called "products" 
#where the "id" column matches the value passed in as id.dynamically fetching a product 
#from db using route"

def load_product_from_db(id):
  with engine.connect() as conn:
    result = conn.execute(text("select * from public.products where id = :val"),
                          {"val": id}
                         )
    rows = result.all()
    if len(rows) == 0:
      return None
    else:
      #return dict(rows[0])
      return dict(zip(result.keys(), rows[0], strict=False))
