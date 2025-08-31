// lib/leads-storage.ts
import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";

export interface Lead {
  _id?: ObjectId; // Mongo will store this
  id?: string; // convenience field for frontend
  name: string;
  email: string;
  phone?: string;
  source: "comment" | "newsletter" | "contact";
  postId?: string;
  postTitle?: string;
  commentId?: string;
  createdAt: string;
  expiresAt: string;
}

// Create new lead
export async function createLead(leadData: Omit<Lead, "id" | "createdAt" | "expiresAt" | "_id">): Promise<Lead> {
  const client = await clientPromise;
  const db = client.db("myDatabase"); // change to your DB name
  const leads = db.collection<Lead>("leads");

  // Check duplicate email
  const existing = await leads.findOne({ email: leadData.email });
  if (existing) {
    throw new Error("Email already exists");
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week

  const lead: Lead = {
    ...leadData,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  const result = await leads.insertOne(lead);
  return { ...lead, id: result.insertedId.toString() };
}

// Get all leads
export async function getAllLeads(): Promise<Lead[]> {
  const client = await clientPromise;
  const db = client.db("myDatabase");
  const leads = db.collection<Lead>("leads");

  const data = await leads.find().toArray();
  return data.map((l) => ({ ...l, id: l._id?.toString() }));
}

// Get leads by source
export async function getLeadsBySource(source: Lead["source"]): Promise<Lead[]> {
  const client = await clientPromise;
  const db = client.db("myDatabase");
  const leads = db.collection<Lead>("leads");

  const data = await leads.find({ source }).toArray();
  return data.map((l) => ({ ...l, id: l._id?.toString() }));
}

// Get leads by post
export async function getLeadsByPost(postId: string): Promise<Lead[]> {
  const client = await clientPromise;
  const db = client.db("myDatabase");
  const leads = db.collection<Lead>("leads");

  const data = await leads.find({ postId }).toArray();
  return data.map((l) => ({ ...l, id: l._id?.toString() }));
}

// Delete lead
export async function deleteLead(id: string): Promise<boolean> {
  const client = await clientPromise;
  const db = client.db("myDatabase");
  const leads = db.collection<Lead>("leads");

  const res = await leads.deleteOne({ _id: new ObjectId(id) });
  return res.deletedCount === 1;
}
