import mongoose from "mongoose";

const finalSummarySchema = new mongoose.Schema(
  {
    score: { type: Number, min: 0, max: 10, required: true },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    missing_points: { type: [String], default: [] },
    verdict: {
      type: String,
      enum: ["pass", "borderline", "fail"],
      required: true,
    },
  },
  { _id: false }
);

const interviewSchema = new mongoose.Schema(
  {
    interview_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    topic: {
      type: String,
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required:true
    },

    final_summary: {
      type: finalSummarySchema,
      required: true,
    },

    signed_at: {
      type: Date,
      required: true,
    },

    signature: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Interview", interviewSchema);
