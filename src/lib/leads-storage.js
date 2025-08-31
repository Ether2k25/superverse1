// lib/leads-storage.ts (or .js if not using TypeScript)
import clientPromise from "./mongodb";

export async function createLead({ name, email, phone, source }) {
  const client = await clientPromise;
  const db = client.db("myDatabase"); // change to your DB name
  const leads = db.collection("leads");

  // check if email already exists
  const existing = await leads.findOne({ email });
  if (existing) {
    throw new Error("Email already exists");
  }

  const result = await leads.insertOne({
    name,
    email,
    phone,
    source,
    createdAt: new Date(),
  });

  return result;
}
