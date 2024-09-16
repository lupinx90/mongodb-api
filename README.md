# MongoDB API CRUD w/NodeJS
## Introducción

Esta API de prueba con MongoDB driver para NodeJS, implementa una simple API CRUD. Para ejecutar en local, nos descargamos el repositorio y si tenemos NodeJS y Node Package Manager instalados, ejecutamos los siguientes comandos en la carpeta base del proyecto:
```
npm i
npm run dev
```
Una vez nuestra aplicación en funcionamiento podremos interactuar con la API en los siguientes endpoints:

### products	"https://localhost:3000/api/products"

CREATE
```
POST "https://localhost:3000/api/products"
BODY EXAMPLE
{
  "name": "camisetas",
  "precio": 15,
  "cantidad": 179
}
```
READ
```
GET "https://localhost:3000/api/products/<id>"
```
UPDATE
```
PUT "https://localhost:3000/api/products/<id>"
BODY EXAMPLE
{
  "name": "camisetas deluxe",
  "precio": 18,
  "cantidad": 103
}
```
DELETE
```
DELETE "https://localhost:3000/api/products/<id>"
```
### users	"https://localhost:3000/api/users"

CREATE
```
POST "https://localhost:3000/api/users"
BODY EXAMPLE
{
  "name": "Luis Lupiáñez",
  "email": "luisg.lupi@gmail.com"
}
```
READ
```
GET "https://localhost:3000/api/users/<id>"
```
UPDATE
```
PUT "https://localhost:3000/api/users/<id>"
BODY EXAMPLE
{
  "name": "Luis Lupiáñez2",
  "email": "luisg.lupi@misitio.com"
}
```
DELETE
```
DELETE "https://localhost:3000/api/users/<id>"
```
### sales	"https://localhost:3000/api/sales"

CREATE
```
POST "https://localhost:3000/api/sales"
BODY EXAMPLE
{
  "products": [
  {
    "qty": 6,
    "product_id": "66be34f82a6a9aa1b1214a38"
  },
  {
    "qty": 1,
    "product_id": "66bf2c910c617ff3cb96a441"
  }
  ],
  "user_id": "66bf754a782d0adec28be1a0"
}
```
READ
```
GET "https://localhost:3000/api/sales/<id>"
```
UPDATE
```
PUT "https://localhost:3000/api/sales/<id>"
BODY EXAMPLE
{
  "user_id": "66bf754a782d0adec28be1a0",
  "products": [
  {
    "qty": 6,
    "product_id": "66be34f82a6a9aa1b1214a38"
  },
  {
    "qty": 1,
    "product_id": "66bf2c910c617ff3cb96a441"
  }
  ]
}
```
DELETE
```
DELETE "https://localhost:3000/api/sales/<id>"
```
