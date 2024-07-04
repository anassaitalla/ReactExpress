const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require("./db");
const usersRouter = require("./routes/users");

const app = express();
// const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "your-secret-key", // Remplacez par une clé secrète sécurisée
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Utilisez true si vous utilisez HTTPS
  })
);

app.use("/users", usersRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
