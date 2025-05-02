const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve index.html for GET /
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// MongoDB connection
const mongoURI =
  "mongodb+srv://adminharry:MySecurePass123!@analyticswithharry.tlxrjvr.mongodb.net/squid_registration_database?retryWrites=true&w=majority&appName=analyticswithharry";
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Schema
const inquirySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  streetAddress: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: String,
  country: { type: String, required: true },
  message: String,
  services: { type: [String], required: true },
  consent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Inquiry = mongoose.model("Inquiry", inquirySchema);

// Route to handle form submission
app.post("/submit", async (req, res) => {
  try {
    const {
      companyName,
      firstName,
      lastName,
      email,
      phone,
      streetAddress,
      city,
      postalCode,
      country,
      message,
      services,
      consent,
    } = req.body;

    // Validate required fields
    if (
      !companyName ||
      !firstName ||
      !lastName ||
      !email ||
      !streetAddress ||
      !city ||
      !country ||
      !services ||
      services.length === 0
    ) {
      return res
        .status(400)
        .json({
          message:
            "All required fields must be filled, and at least one service must be selected",
        });
    }

    // Create new inquiry
    const inquiry = new Inquiry({
      companyName,
      firstName,
      lastName,
      email,
      phone,
      streetAddress,
      city,
      postalCode,
      country,
      message,
      services,
      consent,
    });

    // Save to MongoDB
    await inquiry.save();
    res.status(201).json({ message: "Inquiry saved successfully" });
  } catch (error) {
    console.error("Error saving inquiry:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
