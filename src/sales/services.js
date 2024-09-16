const debug = require("debug")("app:module-sales-services");
const { ObjectId, DBRef } = require("mongodb");

const { Database } = require("../database");
const { Config } = require("../config");

const COLLECTION = "sales";
const USERS_COLLECTION = "users";
const PRODUCTS_COLLECTION = "products";

const getAll = async () => {
  const collection = await Database(COLLECTION);
  return await collection.find({}).toArray();
};

const getById = async (id) => {
  const collection = await Database(COLLECTION);
  if (id.toString().length !== Config.mongoIdLength) return null;
  return await collection.findOne({ _id: new ObjectId(id) });
};

const create = async (sale) => {
  const collection = await Database(COLLECTION);
  const usersCollection = await Database(USERS_COLLECTION);
  const productsCollection = await Database(PRODUCTS_COLLECTION);
  let userId = sale.user_id;
  delete sale.user_id;
  sale.user_id = new DBRef(USERS_COLLECTION, new ObjectId(userId));
  let products = sale.products;
  sale.total = 0;
  const promises = products.map(async (product, i) => {
    let productId = product.product_id;
    delete sale.products[i].product_id;
    sale.products[i].product_id = new DBRef(
      PRODUCTS_COLLECTION,
      new ObjectId(productId)
    );
    let item = await productsCollection.findOne({
      _id: new ObjectId(productId),
    });
    if (item) {
      const qty = product.qty;
      const price = item.precio;
      const line_total = qty * price;
      sale.products[i].line_total = line_total;
      sale.total += line_total;
      await productsCollection.updateOne(
        { _id: new ObjectId(productId) },
        { $inc: { cantidad: -qty } }
      );
    } else {
      sale.products.splice(i, 1);
    }
  });
  await Promise.all(promises);
  let result = null;
  if (sale.products) {
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $inc: { compras: 1 } }
    );
    result = await collection.insertOne(sale);
  }
  return result;
};

// update -- Actualizar cantidad de productos
const update = async (id, sale) => {
  const collection = await Database(COLLECTION);
  const usersCollection = await Database(USERS_COLLECTION);
  const productsCollection = await Database(PRODUCTS_COLLECTION);
  const filter = { _id: new ObjectId(id) };
  let origSale = await collection.findOne(filter);
  let modifiedSale = origSale;
  let products = sale.products;
  let uid = sale.user_id;
  if (products) {
    if (!modifiedSale.total) modifiedSale.total = 0;
    const promises = products.map(async (product) => {
      let productId = product.product_id;
      let item = await productsCollection.findOne({
        _id: new ObjectId(productId),
      });
      let qty = product.qty;
      let productIndex = origSale.products.findIndex(
        (product) => product.product_id.oid.toString() === productId
      );
      productsCollection.updateOne(
        { _id: new ObjectId(productId) },
        { $inc: { cantidad: origSale.products[productIndex].qty - qty } }
      );
      modifiedSale.products[productIndex].qty = qty;
      const old_line_total = origSale.products[productIndex].line_total;
      const new_line_total = qty * item.precio;
      const total_adjustment = new_line_total - old_line_total;
      modifiedSale.products[productIndex].line_total = new_line_total;
      modifiedSale.total = modifiedSale.total + total_adjustment;
    });
    await Promise.all(promises);
  }
  if (origSale.user_id.oid.toString() !== uid) {
    let user = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(uid) },
      { $inc: { compras: 1 } }
    );
    if (user) {
      await usersCollection.updateOne(
        { _id: origSale.user_id.oid },
        { $inc: { compras: -1 } }
      );
      modifiedSale.user_id = new DBRef(USERS_COLLECTION, new ObjectId(uid));
    }
  }
  return await collection.findOneAndUpdate(
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
  if (sale) {
    let userId = sale.user_id;
    let products = sale.products;
    const promises = products.map(async (product) => {
      let productId = product.product_id.oid;
      await productsCollection.updateOne(
        { _id: productId },
        { $inc: { cantidad: product.qty } }
      );
    });
    await Promise.all(promises);
    await usersCollection.updateOne(
      { _id: userId.oid },
      { $inc: { compras: -1 } }
    );
  }
  return await collection.findOneAndDelete({ _id: new ObjectId(id) });
};

module.exports.SalesService = {
  getAll,
  getById,
  update,
  deleteSale,
  create,
};
