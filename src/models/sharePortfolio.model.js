import mongoose from "mongoose";

const sharePortfolioSchema = new mongoose.Schema({
  selectedFreelancers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

export default mongoose.model("SharePortfolio", sharePortfolioSchema);
