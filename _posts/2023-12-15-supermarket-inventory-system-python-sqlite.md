---
title: "Building a Simple Supermarket Inventory System with Python and SQLite"
date: 2023-12-15
type: post
topic: scraping
tags: [Python]
origin: medium
medium_url: https://levelup.gitconnected.com/building-a-simple-supermarket-inventory-system-with-python-and-sqlite-4382fbd6c596
image: /images/medium_images/sqlite_market_inventory.png
image_color: true
description: "Building a small inventory system end to end with Python and SQLite — schema, CRUD and the CLI around it."
---

## Building a Simple Supermarket Inventory System with Python and SQLite

<figure>
  <img src="{{ '/images/medium_posts/supermarket-inventory-system-python-sqlite-01.png' | relative_url }}" alt="created with Dall-E 3 by author with ❤" loading="lazy">
  <figcaption>created with Dall-E 3 by author with ❤</figcaption>
</figure>

## What is SQL and SQLite ?

SQL, or Structured Query Language, is a standard programming language specifically designed for managing and manipulating data in relational database management systems (RDBMS). It’s used for a variety of operations such as querying, updating, and managing databases. SQL is known for its simplicity and effectiveness in handling structured data, which is organized into tables.

SQL’s ability to manage large volumes of data efficiently and its wide adoption across various database systems like MySQL, PostgreSQL, Oracle, and Microsoft SQL Server, make it a fundamental skill for database administrators, data analysts, and anyone working with data-driven applications. Its role is critical in fields ranging from web development to data science, underlining its importance in the tech industry.

## Purpose and Functionality:

SQL is used to insert, search, update, and delete database records. It doesn’t just manage the data itself; it also helps to manage the database schema and database objects, like tables and views.

## Relational Model:

The foundation of SQL is based on the relational model of data. This means that data is organized into tables (known as relations), which consist of rows and columns. Each row in a table represents a data record, and each column represents a data field within that record.

## Operations:

Data Query: The ‘SELECT’ query is used to fetch data from a database. You can specify criteria to filter the data you want.

```
SELECT * FROM supermarket
```

This query retrieves all the records from the `supermarket` table. It's a straightforward way to get a complete view of the inventory.

```
SELECT * FROM supermarket WHERE price This query selects all products from the `supermarket` table where the price is less than or equal to $10.00. It's useful for finding more affordable items or for promotions targeting lower-priced products. I used this in the project to filter items between two selected range which is taken from user.

```
SELECT * FROM supermarket WHERE quantity BETWEEN 50 AND 100;
```

This query fetches products whose quantity is between 50 and 100. It’s helpful for inventory management, especially when you need to identify products with moderate stock levels for restocking or for special deals.

Data Manipulation: INSERT, UPDATE, and DELETE commands are used to modify data in the database.

```
INSERT INTO supermarket (name, price, quantity) VALUES ('Bananas', 0.99, 150);
```

This command adds a new product to the `supermarket` table. In this example, we're adding "Bananas" with a price of $0.99 per unit and a quantity of 150.

```
UPDATE supermarket SET price = 1.99, quantity = 200 WHERE name = 'Bananas';
```

This command updates the price and quantity of an existing product. Here, it changes the price of “Bananas” to $1.99 and the quantity to 200. This is useful for adjusting inventory details as prices change or as new stock comes in.

```
DELETE FROM supermarket WHERE name = 'Bananas';
```

This command removes a product from the `supermarket` table. In this example, it deletes the record for "Bananas." This is used when a product is no longer available or carried in the supermarket.

## Variations and Extensions:

While the core of SQL is standardized, many database systems, like MySQL, PostgreSQL, Microsoft SQL Server, and Oracle, have their own extensions and variations, adding additional features and functionalities unique to their platforms.

## SQLite3

SQLite3 is a lightweight, self-contained SQL database engine known for its simplicity and minimal setup requirements. Unlike traditional client-server database systems, SQLite3 embeds right into applications, running as an integral part of the program accessing the database. This makes it an ideal choice for environments where simplicity and minimal configuration are essential, such as in mobile applications, small to medium-sized web applications, and standalone software.

<figure>
  <img src="{{ '/images/medium_posts/supermarket-inventory-system-python-sqlite-02.png' | relative_url }}" alt="created with Dall-E 3 by author with ❤" loading="lazy">
  <figcaption>created with Dall-E 3 by author with ❤</figcaption>
</figure>

## SuperMarket Project

The Supermarket Project is a virtual simulation of a supermarket’s inventory management system. It’s designed to replicate the essential functions of tracking and maintaining a supermarket’s product stock. Users can interact with the system to add new products, update existing ones, remove items no longer in stock, and search or filter products based on specific criteria like price.

I intend to approach the development of the project in two distinct phases. Initially, in Phase 1, I’ll lay the groundwork by constructing a streamlined and organized database for the supermarket. Following this, Phase 2 will be dedicated to elevating the system with user interface and user experience design.

> PHASE 1 ==> Basic Structure

PHASE 1 ==> Basic Structure

To begin with, I structured my code as follows:

## Get Yavuz ERTUĞRUL’s stories in your inbox

Join Medium for free to get updates from this writer.

Remember me for faster sign in

First of all I imported required modules for my project:

```
import sqlite3import time
```

2 Classes: first one for product and second one for Supermarket Operations

## Product Class

I planned as my Product class will have `name, price, quantity `parameters.

- `self` in Python is used to refer to the instance of the class. It allows us to access the attributes and methods of the class in other methods within the class.
- `__init__` is a special method in Python, known as a constructor. It is automatically called when you create a new instance of a class.
- In the `Product` class, `__init__` is used to initialize the new `Product` object with specific attributes - `name`, `price`, and `quantity`.
- `__str__` is another special method in Python, used to provide a human-readable representation of the object. When you print an instance of the `Product` class or use the `str()` function on it, this method is called. It returns a formatted string that includes the product’s name, price, and quantity, making it easier to understand what the product object represents when printed.

```
class Product():    def __init__(self, name, price, quantity):        self.name = name        self.price = price        self.quantity = quantity    def __str__(self):        return "Product Name: {}\nPrice: {}\nNumber: {}".format(self.name, self.price, self.quantity)
```

## SuperMarket Class

> Creating a Connection in SuperMarket Class:

Creating a Connection in SuperMarket Class:

- The `create_connection` method in the `SuperMarket` class sets up a connection to the SQLite database. This is essential for executing SQL commands and managing the supermarket database.
- `sqlite3.connect('supermarket.db')` creates (or opens, if it already exists) a file named `supermarket.db` which serves as the SQLite database. All the data of the supermarket will be stored in this file.

> Creating a Table with SQL Command:

Creating a Table with SQL Command:

In the `create_connection` method, the line `query="Create Table if not exists supermarket(name TEXT, price FLOAT, quantity INT)"`is an SQL command that creates a new table named `supermarket` in the database if it doesn’t already exist. This table is designed to store product information with columns for name, price, and quantity.

> Committing Changes with self.conn.commit():

Committing Changes with self.conn.commit():

Whenever you execute a command that changes the data in the database (like adding, updating, or deleting a product), you need to commit these changes. `self.conn.commit()` ensures that these changes are saved in the database file.

```
class SuperMarket():    def __init__(self):        self.create_connection()
```

- To see my database and table I am currently using DB Browser for SQLite but in the past I used extensions for VsCode to see from inside VsCode without another application.

<figure>
  <img src="{{ '/images/medium_posts/supermarket-inventory-system-python-sqlite-03.png' | relative_url }}" alt="DB Browser for SQLite — Database Structure" loading="lazy">
  <figcaption>DB Browser for SQLite — Database Structure</figcaption>
</figure>

<figure>
  <img src="{{ '/images/medium_posts/supermarket-inventory-system-python-sqlite-04.png' | relative_url }}" alt="DB Browser for SQLite — Browse Data" loading="lazy">
  <figcaption>DB Browser for SQLite — Browse Data</figcaption>
</figure>

## Methods

> add_product()

add_product()

The `add_product` method is adding new products into our store. When I have a new item to place on our virtual shelves, this method takes a `Product` object, gently unpacks its details, and places them into the `supermarket` table of our `supermarket.db` database. It's like telling our digital inventory, 'Hey, here's something new for you!

```
def add_product(self, product):        query = "INSERT INTO supermarket values(?, ?, ?)"        self.cursor.execute(query,(product.name, product.price, product.quantity))        self.conn.commit()
```

> remove_product()

remove_product()

Think of `remove_product` as the method that helps to take item from shelves. Whenever a product is no longer available or needed, this method steps in. I just give it the name of the product, and it carefully removes all traces of that product from our database. It’s our way of keeping things tidy and up-to-date.

```
def remove_product(self,name):        query = "DELETE FROM supermarket WHERE name =?"        self.cursor.execute(query,(name,))        self.conn.commit()
```

> list_product()

list_product()

The `list_product` function is showing all the products we have in the store. It fetches the entire list of products from our database and displays them. This is incredibly handy when I need to quickly check what’s in stock and get an overview of our inventory.

```
def list_products(self):        query = "SELECT * FROM supermarket"        self.cursor.execute(query)        rows = self.cursor.fetchall()        if rows:             for row in rows:                print("Product Name: {}\nProduct Price: {} $\nProduct Quantity: {}\n ".format(row[0],row[1],row[2]))        else:            print("No products in the supermarket")
```

> update_product()

update_product()

Whenever a product’s details need a refresh — maybe the price has changed, or we got a new batch with different quantities — I turn to `update_product`. This method lets me update the existing details of a product in our database, ensuring our inventory is always accurate and current.

```
def update_product(self, product):        query = "UPDATE supermarket SET price =?, quantity =? WHERE name =?"        self.cursor.execute(query, (product.price, product.quantity, product.name))        self.conn.commit()
```

> search_product()

search_product()

When I need to find a specific product, `search_product` is my go-to method. I just provide the product's name, and it dives into our database, and fetching all information about that product.

```
def search_product(self, name):        query = "SELECT * FROM supermarket WHERE name =?"        self.cursor.execute(query,(name,))        rows = self.cursor.fetchall()        if rows:            for row in rows:                print("Product Name: {}\nProduct Price: {} $\nProduct Quantity: {}\n ".format(row[0],row[1],row[2]))        else:            print("Product not found")
```

> filter_product()

filter_product()

For times when I need to view products within a certain price range — maybe to plan a sale or analyze our stock — I use `filter_products`.

```
def filter_products(self,min_price,max_price):        query = "SELECT * FROM supermarket WHERE price >=? AND price  create_connection() & close_connection()

create_connection() & close_connection()

These two methods are the essential start and end points of our interaction with the database. `create_connection` opens up the pathway to our database for any action we need to take. And once we’re done, `close_connection` neatly wraps things up, ensuring everything is left in order.

```
def create_connection(self):        self.conn = sqlite3.connect('supermarket.db')        self.cursor = self.conn.cursor()        query = "Create Table if not exists supermarket(name TEXT, price FLOAT, quantity INT)"        self.cursor.execute(query)        self.conn.commit()    def close_connection(self):        self.conn.close()
```

## The Loop

> Choice table

`Choice` table

```
print("""           1.Add product           2.Remove product          3.List All Products          4.Update Product          5.Search Product          6.Filter Product by price          7.Exit          """)supermarket = SuperMarket()
```

> While loop

`While` loop

```
while True:    choice = int(input("Enter your choice: "))        if choice == 1:        name = input("Enter product name: ")        price = float(input("Enter product price: "))        quantity = int(input("Enter product quantity: "))        new_product = Product(name, price, quantity)        print("{} is being added".format(name))        time.sleep(2)        supermarket.add_product(new_product)        print("{} is added".format(name))    elif choice == 2:        name = input("Enter product name: ")        print("{} is being removed\n".format(name))        time.sleep(2)        supermarket.remove_product(name)        print("{} is removed\n".format(name))    elif choice == 3:        print("Listing products...")        time.sleep(2)        supermarket.list_products()        print("Products are listed")    elif choice == 4:        name = input("Enter product name to update: ")        price = float(input("Enter product price to update: "))        quantity = int(input("Enter product quantity to update: "))        new_product = Product(name, price, quantity)        print("{} is being updated\n".format(name))        time.sleep(2)        supermarket.update_product(new_product)        print("{} is updated\n".format(name))    elif choice == 5:        name = input("Enter item name for searching products")         print("{} is being searched\n".format(name))        time.sleep(2)        supermarket.search_product(name)        print("{} are listed\n".format(name))    elif choice == 6:        print("Please select filter range for product you want to see")        min_price = int(input("Enter minimum price: "))        max_price = int(input("Enter maximum price: "))        supermarket.filter_products(min_price,max_price)    elif choice == 7:        break    else:        print("Invalid choice")
```

<figure>
  <img src="{{ '/images/medium_posts/supermarket-inventory-system-python-sqlite-06.png' | relative_url }}" alt="created with Dall-E 3 by author with ❤" loading="lazy">
  <figcaption>created with Dall-E 3 by author with ❤</figcaption>
</figure>

## The Complete Code & Summary

I made this Supermarket Project to show how you can manage a store’s products with a computer program. It’s like a digital list of everything in the store.

- Two Main Parts — `Product` and `SuperMarket`:

- I made a `Product` class. Think of it like a form that has spaces for a product's name, price, and how many we have. Every time we add a new item, we fill out this form.
- The `SuperMarket` class is where all the action happens. It uses the SQLite3 database to store our product information. Here, I wrote functions to add new products, change their details, remove them, or find specific items.

2. Why SQLite3:

- I chose SQLite3 because it’s simple. It doesn’t need a big setup like other databases, and it saves everything in one file. This makes my project easier to use and move around.

3. Easy to Use:

- The program works in a command line (like where you type commands in a computer). You get options like ‘Add a product’ or ‘Remove a product’. You choose what you want to do by typing a number. It’s made to be easy for anyone to use.

4. Using Classes for Better Organization:

- Using classes, like `Product` and `SuperMarket`, helps keep the program organized. This way, everything has its place, and if I want to add new features later, it's easier.

## The Code

```
import sqlite3import timeclass Product():    def __init__(self, name, price, quantity):        self.name = name        self.price = price        self.quantity = quantity    def __str__(self):        return "Product Name: {}\nPrice: {}\nNumber: {}".format(self.name, self.price, self.quantity)class SuperMarket():    def __init__(self):        self.create_connection()    def create_connection(self):        self.conn = sqlite3.connect('supermarket.db')        self.cursor = self.conn.cursor()        query = "Create Table if not exists supermarket(name TEXT, price FLOAT, quantity INT)"        self.cursor.execute(query)        self.conn.commit()    def close_connection(self):        self.conn.close()    def add_product(self, product):        query = "INSERT INTO supermarket values(?, ?, ?)"        self.cursor.execute(query,(product.name, product.price, product.quantity))        self.conn.commit()        def remove_product(self,name):        query = "DELETE FROM supermarket WHERE name =?"        self.cursor.execute(query,(name,))        self.conn.commit()         def list_products(self):        query = "SELECT * FROM supermarket"        self.cursor.execute(query)        rows = self.cursor.fetchall()        if rows:             for row in rows:                print("Product Name: {}\nProduct Price: {} $\nProduct Quantity: {}\n ".format(row[0],row[1],row[2]))        else:            print("No products in the supermarket")        def update_product(self, product):        query = "UPDATE supermarket SET price =?, quantity =? WHERE name =?"        self.cursor.execute(query, (product.price, product.quantity, product.name))        self.conn.commit()     def search_product(self, name):        query = "SELECT * FROM supermarket WHERE name =?"        self.cursor.execute(query,(name,))        rows = self.cursor.fetchall()        if rows:            for row in rows:                print("Product Name: {}\nProduct Price: {} $\nProduct Quantity: {}\n ".format(row[0],row[1],row[2]))        else:            print("Product not found")    def filter_products(self,min_price,max_price):        query = "SELECT * FROM supermarket WHERE price >=? AND price Thank you for taking the time to read through this piece. I’m glad to share these insights and hope they’ve been informative. If you enjoyed this article and are looking forward to more content like this, feel free to stay connected by following my Medium profile. Your support is greatly appreciated. Until the next article, take care and stay safe! For all my links in one place, including more articles, projects, and personal interests, check out.

## yavuzertugrul || Linktree

## METU grad, ex-ACROME Robotics Engineer, Drawing Pixel_art, Gaming, Writing.

linktr.ee

> Lately, I’ve been listening to a lot of Infected Mushroom, and it has a special effect on me. Their music reminds me of my humble university years. I particularly enjoy this track — I’m ending this writing with a recommendation for your ears. Hope you enjoy it as much as I do.

Lately, I’ve been listening to a lot of Infected Mushroom, and it has a special effect on me. Their music reminds me of my humble university years. I particularly enjoy this track — I’m ending this writing with a recommendation for your ears. Hope you enjoy it as much as I do.
