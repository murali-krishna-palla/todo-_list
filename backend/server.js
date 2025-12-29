const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const todoRoutes = require("./routes/todoRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/todos", todoRoutes);
app.get("/test", (req, res) => {
  res.json({ message: "CORS working" });
});

// DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () =>
      console.log("Server running on port 5000")
    );
  })
  .catch(err => console.log(err));
