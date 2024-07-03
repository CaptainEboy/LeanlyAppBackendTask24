❤Test API:(GET)  http://127.0.0.1:3000/

........
❤Register (POST): http://127.0.0.1:3000/register
{
  "username": "string",
  "email": "string",
  "password": "string"
}
.........

.........
❤Login (POST): http://127.0.0.1:3000/login
{
  "email": "string",
  "password": "string"
}
.........

.........
❤Create Products (POST): http://127.0.0.1:3000/products
{headers:} { x-auth-token: "string"}
{
  "name": "string",
  "description": "string",
  "price": number,
  "imageURL": "string"
}
.........

.........
❤Get Products by name (POST): http://127.0.0.1:3000/api/products/:name
{headers:} { x-auth-token: "string"}
.........

.........
❤Get all Products (GET): http://127.0.0.1:3000/products
{headers:} { x-auth-token: "string"}
.........

.........
❤Get a Product by id (GET): http://127.0.0.1:3000/products/:id
{headers:} { x-auth-token: "string"}
.........

.........
❤Delete a Product by id (DELETE): http://127.0.0.1:3000/products/:id
{headers:} { x-auth-token: "string"}
.........
