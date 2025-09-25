// import { MongoClient } from "mongodb";

// const url = "mongodb+srv://nitin:nitin@cluster0.kbnly1e.mongodb.net/";
// const dbName = "t10exchange";

// let client;

// export async function connect() {
//   if (!client) {
//     client = new MongoClient(url,{ serverSelectionTimeoutMS: 10000});
//     await client.connect();
//     console.log("✅ Connected to MongoDB");
//   }
//   return client.db(dbName);
// }

import { MongoClient } from "mongodb";

let _db;

/**
 * Connect once to MongoDB and reuse the connection for the lifetime of the app.
 * @param {Function} callback - called after successful connection
 */
export const MongoConnect = async (callback) => {
  try {
    const client = await MongoClient.connect(
      "mongodb+srv://nitin:nitin@cluster0.kbnly1e.mongodb.net/t10exchange",
      { useUnifiedTopology: true } // required for driver 5.x / 6.x
    );

    console.log("✅ Connected to MongoDB (t10exchange)");
    _db = client.db("t10exchange"); // explicitly select DB
    callback(); // start server after DB is ready

  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    throw err;
  }
};

/**
 * Get the shared DB instance.
 * Throws if MongoConnect has not been called yet.
 */
export const getDB = () => {
  if (!_db) throw new Error("❌ No DB found. Call MongoConnect() first.");
  return _db;
};
