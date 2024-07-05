const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require("./db");
const usersRouter = require("./routes/users");
const cors = require('cors');  // Add this line

const app = express();
const port = 5000;

// Add this line to enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000',  // Allow only your frontend URL
  credentials: true,  // Allow cookies to be sent
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use("/users", usersRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});