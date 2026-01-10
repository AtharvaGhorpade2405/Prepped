import Interview from "../models/Interview.js";
import { verifySignature } from "../utils/verifySignature.js";
import stringify from "fast-json-stable-stringify";

const MAX_AGE_SECONDS = 60 * 10;

export async function createInterview(req, res) {
  try {
    const { interview_id, timestamp, summary, signature, topic } = req.body;

    if (!interview_id || !timestamp || !summary || !signature || !topic) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 1. Reconstruct the payload string exactly as the Python server did it
    // (Ensure your verifySignature function matches the python logic)
    const payloadString =
      `${interview_id}|${timestamp}|` +
      stringify(summary);

    const valid = verifySignature({
      payloadString,
      signature,
    });

    if (!valid) {
      return res.status(401).json({ error: "Invalid signature" });
    }

    const now = Math.floor(Date.now() / 1000);

    // 2. Check if the payload is too old (e.g., prevent replay attacks)
    if (Math.abs(now - timestamp) > MAX_AGE_SECONDS) {
      return res.status(400).json({ error: "Expired payload" });
    }

    const exists = await Interview.findOne({ interview_id });
    if (exists) {
      return res.status(409).json({ error: "Interview already stored" });
    }

    // 3. Create the Record
    const interview = await Interview.create({
      user: req.userId, // 👈 CHANGED: Uses the ID extracted by your JWT middleware
      interview_id,
      topic,
      final_summary: summary,
      signed_at: new Date(timestamp * 1000),
      signature,
    });

    return res.status(201).json({
      status: "stored",
      id: interview.interview_id,
    });
  } catch (err) {
    console.error("Create interview error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getMyInterviews(req, res) {
  const interviews = await Interview.find({ user: req.userId }).sort({
    createdAt: -1,
  });
  res.json(interviews);
}
