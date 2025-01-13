import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema(
  {
    tweet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Tweet = mongoose.model("Tweet", tweetSchema);