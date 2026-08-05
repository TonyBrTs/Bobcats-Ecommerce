/**
 * @file services/mongodb.js
 * @description MongoDB client connection management module.
 * Exports a reusable Promise resolving to the MongoDB Atlas database client connection.
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