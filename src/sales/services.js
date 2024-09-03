const debug = require("debug")("app:module-sales-services");
const { ObjectId, DBRef } = require("mongodb");

const { Database } = require("../database");

const COLLECTION = "sales";
const USERS_COLLECTION = "users";
const PRODUCTS_COLLECTION = "products";

const getAll = async () => {
  const collection = await Database(COLLECTION);
  return await collection.find({}).toArray();
};

const getById = async (id) => {
  const collection = await Database(COLLECTION);
  if (id.toString().length !== 24) return null;
  return await collection.findOne({ _id: new ObjectId(id) });
};

const create = async (sale) => {
  const collection = await Database(COLLECTION);
  const usersCollection = await Database(USERS_COLLECTION);
  const productsCollection = await Database(PRODUCTS_COLLECTION);
  let userId = sale.user_id;
  delete sale.user_id;
  sale.user_id = new DBRef(USERS_COLLECTION, new ObjectId(userId) );
  let products = sale.products;
  products.forEach(async (product, i) => {
    let productId = product.product_id;
    await productsCollection.findOne({ _id: new ObjectId(productId) });
    let qty = product.qty;
    await productsCollection.updateOne({ _id: new ObjectId(productId) }, { $inc: { cantidad: -qty } });
    delete sale.products[i].product_id;
    sale.products[i].product_id = new DBRef(PRODUCTS_COLLECTION, new ObjectId(productId) );
  });
  await usersCollection.updateOne({ _id: new ObjectId(userId) }, { $inc: { compras: 1 } });
  let result = await collection.insertOne(sale);
  return result.insertedId;
};

// update -- Actualizar cantidad de productos
const update = async (sale) => {
  const collection = await Database(COLLECTION);
  const productsCollection = await Database(PRODUCTS_COLLECTION);
  const saleId = sale._id;
  const filter = { _id: new ObjectId(saleId) };
  let origSale = await collection.findOne(filter);
  let modifiedSale = origSale;
  delete sale._id;
  let products = sale.products;
  products.forEach(async (product) => {
    let productId = product.product_id;
    await productsCollection.findOne({ _id: new ObjectId(productId) });
    let qty = product.qty;
    let productIndex = origSale.products.findIndex( (product) => product.product_id.oid.toString() === productId );
    await productsCollection.updateOne({ _id: new ObjectId(productId) }, { $inc: { cantidad: origSale.products[productIndex].qty - qty } });
    modifiedSale.products[productIndex].qty = qty;
  });
  return await collection.updateOne(
    filter,
    { $set: modifiedSale },
    { returnDocument: "after" }
  );
};
// delete -- Reponer cantidad de productos de la venta eliminada, decrementar el número de compras del usuario
const deleteSale = async (id) => {
  const collection = await Database(COLLECTION);
  const usersCollection = await Database(USERS_COLLECTION);
  const productsCollection = await Database(PRODUCTS_COLLECTION);
  const filter = { _id: new ObjectId(id) };
  let sale = await collection.findOne(filter);
  let userId = sale.user_id;
  let products = sale.products;
  products.forEach(async (product) => {
    let productId = product.product_id.oid;
    await productsCollection.updateOne({ _id: productId }, { $inc: { cantidad: product.qty } });
  });
  await usersCollection.updateOne({ _id: userId.oid }, { $inc: { compras: -1 } });
  return await collection.findOneAndDelete({ _id: new ObjectId(id) });
};

module.exports.SalesService = {
  getAll,
  getById,
  update,
  deleteSale,
  create,
};
