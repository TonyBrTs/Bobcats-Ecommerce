/**
 * @file services/mongodb.js
 * @description Conexión y gestión del cliente de MongoDB.
 * Exporta una Promesa reutilizable de la conexión a la base de datos MongoDB Atlas.
 */

const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable in .env");
}

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, {});
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, {});
  clientPromise = client.connect();
}

module.exports = clientPromise;