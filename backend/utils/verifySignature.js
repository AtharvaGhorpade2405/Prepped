import crypto from "crypto";

export function verifySignature({ payloadString, signature }) {
  const secret = process.env.INTERVIEW_SIGNING_SECRET;
  if (!secret) throw new Error("INTERVIEW_SIGNING_SECRET not set");

  const expected = crypto
    .createHmac("sha256", secret)
    .update(payloadString, "utf8")
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature,"hex"),
    Buffer.from(expected,"hex")
  );
  }

