const debug = require("debug")("app:module-users-services");
const { ObjectId } = require('mongodb');

const { Database } = require('../database');

const COLLECTION = 'users';

const getAll = async () =>{
    const collection = await Database(COLLECTION);
    return await collection.find({}).toArray();
}

const getById = async (id) => {
    const collection = await Database(COLLECTION);
    if(id.toString().length !== 24) return null;
    return await collection.findOne({ _id:  new ObjectId(id)});
}

const create = async (user) => {
    const collection = await Database(COLLECTION);
    let result = await collection.insertOne(user);
    return result.insertedId;
}

// update
const update = async (user) => {
    const collection = await Database(COLLECTION);
    const userId = user._id;
    const filter = { _id: new ObjectId(userId) };
    delete user._id;
    return await collection.findOneAndUpdate(filter, {$set: user}, {returnDocument: 'after'});
}
// delete
const deleteUser = async (id) => {
    const collection = await Database(COLLECTION);
    return await collection.findOneAndDelete({ _id:  new ObjectId(id)});
}

module.exports.UsersService = {
    getAll,
    getById,
    update,
    deleteUser,
    create
}