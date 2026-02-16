const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable in .env");
}

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // Use a global variable in development to prevent multiple connections
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, {});
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new client for each connection
  client = new MongoClient(uri, {});
  clientPromise = client.connect();
}

module.exports = clientPromise;