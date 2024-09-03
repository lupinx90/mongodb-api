const debug = require("debug")("app:module-products-services");
const { ObjectId } = require('mongodb');

const { Database } = require('../database');
const { ProductUtils } = require('./utils');

const COLLECTION = 'products';

const getAll = async () =>{
    const collection = await Database(COLLECTION);
    return await collection.find({}).toArray();
}

const getById = async (id) => {
    const collection = await Database(COLLECTION);
    if(id.toString().length !== 24) return null;
    return await collection.findOne({ _id:  new ObjectId(id)});
}

const create = async (product) => {
    const collection = await Database(COLLECTION);
    let result = await collection.insertOne(product);
    return result.insertedId;
}

// update
const update = async (product) => {
    const collection = await Database(COLLECTION);
    const productId = product._id;
    const filter = { _id: new ObjectId(productId) };
    delete product._id;
    return await collection.updateOne(filter, {$set: product});
}
// delete
const deleteProduct = async (id) => {
    const collection = await Database(COLLECTION);
    return await collection.findOneAndDelete({ _id:  new ObjectId(id)});
}

const generateReport = async (name, res) =>{
    let products = await getAll();
    ProductUtils.excelGenerator(products, name, res);
}

module.exports.ProductsService = {
    getAll,
    getById,
    create,
    update,
    deleteProduct,
    generateReport
}