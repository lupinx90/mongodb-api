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
GET "https://localhost:3000/api/products"
```
UPDATE
```
POST "https://localhost:3000/api/products/update"
BODY EXAMPLE
{
  "_id": "66be34f82a6a9aa1b1214a38",
  "name": "camisetas deluxe",
  "precio": 18,
  "cantidad": 103
}
```
DELETE
```
GET "https://localhost:3000/api/products/delete/<id>"
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
GET "https://localhost:3000/api/users"
```
UPDATE
```
POST "https://localhost:3000/api/users/update"
BODY EXAMPLE
{
  "_id": "66bf754a782d0adec28be1a0",
  "name": "Luis Lupiáñez2",
  "email": "luisg.lupi@misitio.com"
}
```
DELETE
```
GET "https://localhost:3000/api/users/delete/<id>"
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
GET "https://localhost:3000/api/sales"
```
UPDATE
```
POST "https://localhost:3000/api/sales/update"
BODY EXAMPLE
{
  "_id": "66d6e35bf10435eadcfbe5f2",
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
GET "https://localhost:3000/api/sales/delete/<id>"
```
