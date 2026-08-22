const mongoose = require("mongoose");
const dns = require("dns");

// Ensure reliable DNS resolution for MongoDB Atlas SRV connection strings
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (dnsErr) {
  // Ignore DNS override errors on restricted environments
}

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.warn("⚠️ [MongoDB] MONGO_URI is missing in server/.env. Running in fallback mode.");
    return;
  }

  console.log("[MongoDB] Connecting to database...");

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000 // Fast 5s timeout
    });

    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.warn("\n------------------------------------------------------------");
    console.warn("⚠️ [MongoDB Atlas Connection Notice]");
    console.warn("Could not connect to MongoDB Atlas cluster.");
    console.warn("\n👉 HOW TO FIX (MongoDB Atlas Setup):");
    console.warn("1. Log in to MongoDB Atlas (https://cloud.mongodb.com)");
    console.warn("2. Go to Security -> Network Access");
    console.warn("3. Click 'Add IP Address' -> Select 'Allow Access from Anywhere' (0.0.0.0/0)");
    console.warn("4. Click 'Confirm' and wait 1 minute for rules to update.");
    console.warn("5. Ensure your database password in server/.env is correct.\n");
    console.warn("ℹ️ The backend server remains running smoothly on port 5000 in fallback mode.");
    console.warn("------------------------------------------------------------\n");
  }
};

module.exports = connectDB;