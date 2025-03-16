const express = require("express");
const router = express.Router();
const Feedback = require("../Model/feedbackModel");
// const Admin = require("../Model/adminModel");
// const Seller = require("../Model/sellerModel");

// Submit Feedback
router.post("/feedback", async (req, res) => {
    const { subject, message,  submittedBy,} = req.body;

    if (!subject || !message ) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    try {
      const feedbackData = {
        subject,
        message,
        submittedBy,
        
      };
  
  
      const feedback = new Feedback(feedbackData);
      const savedFeedback = await feedback.save();
  
      
      res.status(201).json({ message: "Feedback submitted successfully" });
    } catch (error) {
        console.error("Error saving feedback:", error.message); // Log the error
        res.status(500).json({ error: "Internal server error" });
      }
});

// Fetch Feedbacks
router.get("/feedbacks", async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
    //   .populate("submittedBy", "name email storeName")
      .sort({ createdAt: -1 });

    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
