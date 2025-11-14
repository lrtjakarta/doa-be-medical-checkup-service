const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config();
const db = require("./database").mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,PATCH,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/repo", express.static(path.join(__dirname, "repo")));

const profileRoute = require("./routes/checkupRoute");
const categoryRoute = require("./routes/categoryRoute");
const masterRoute = require("./routes/masterRoute");
const diagnosisRoute = require("./routes/diagnosisRoute");
const pharmacologyRoute = require("./routes/pharmacologyRoute");
const monthlyRoute = require("./routes/monthlyRoute");
const masterBMIRoute = require("./routes/masterBMIRoute");

app.use("/checkup", profileRoute);
app.use("/category", categoryRoute);
app.use("/master", masterRoute);
app.use("/diagnosis", diagnosisRoute);
app.use("/pharmacology", pharmacologyRoute);
app.use("/monthly", monthlyRoute);
app.use("/masterBMI", masterBMIRoute);

const PORT = process.env.PORT || 4024;
app.listen(PORT, () => {
  console.log(`LRT Jakarta Akda Medical Check Up on PORT ${PORT} is connected`);
});

app.get("/", (req, res) => {
  res.send("LRT Jakarta Akda Medical Check Up is connected");
});
