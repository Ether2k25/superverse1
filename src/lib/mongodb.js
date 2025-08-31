import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!uri) {
  throw new Error("Please add your Mongo URI to Environment Variables");
}

if (process.env.NODE_ENV === "development") {
  // In dev, use a global variable so it doesn’t re-init every time
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In prod, create a new connection each time
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
