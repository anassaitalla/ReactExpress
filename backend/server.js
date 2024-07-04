const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./db");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/users", (req, res) => {
  connection.query("SELECT * FROM user", (err, results) => {
    // Correction ici : "users" au lieu de "user"
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Server error");
      return;
    }
    res.json(results);
  });
});

// Route pour insérer un nouvel utilisateur avec tous les champs
app.post("/users", (req, res) => {
  const { fullName, mail, userName, password, role } = req.body;

  // Validation des données
  if (!fullName || !mail || !userName || !password || !role) {
    return res
      .status(400)
      .json({ error: "Tous les champs doivent être renseignés." });
  }

  // Vérification du rôle
  if (!allowedRoles.includes(role)) {
    return res
      .status(400)
      .json({ error: `Le rôle spécifié (${role}) n'est pas valide.` });
  }

  // Vérification si l'utilisateur existe déjà par email ou username
  connection.query(
    "SELECT * FROM user WHERE mail = ? OR username = ?",
    [mail, userName],
    (error, results, fields) => {
      if (error) {
        console.error(
          "Erreur lors de la vérification de l'utilisateur existant :",
          error
        );
        return res
          .status(500)
          .json({
            error: "Erreur lors de la vérification de l'utilisateur existant.",
          });
      }

      // Vérifie si l'utilisateur existe déjà
      if (results.length > 0) {
        // Utilisateur trouvé avec le même email ou username
        return res
          .status(400)
          .json({
            error: "Un utilisateur avec cet email ou ce username existe déjà.",
          });
      }

      // Insertion dans la base de données
      connection.query(
        "INSERT INTO user (fullName, mail, username, password, role) VALUES (?, ?, ?, ?, ?)",
        [fullName, mail, userName, password, role],
        (error, results, fields) => {
          if (error) {
            console.error(
              "Erreur lors de l'insertion de l'utilisateur :",
              error
            );
            return res
              .status(500)
              .json({ error: "Erreur lors de l'insertion de l'utilisateur." });
          }

          // Succès
          return res
            .status(201)
            .json({
              message: "Utilisateur inséré avec succès.",
              userId: results.insertId,
            });
        }
      );
    }
  );
});

// Liste des rôles autorisés
const allowedRoles = ["admin", "user", "guest"]; // Ajoutez d'autres rôles selon vos besoins

// Route pour insérer un nouvel utilisateur avec tous les champs
// Route pour insérer un nouvel utilisateur avec tous les champs
app.post("/users", (req, res) => {
  const { fullName, mail, userName, password, role } = req.body; // Utilise userName au lieu de username

  // Validation des données
  if (!fullName || !mail || !userName || !password || !role) {
    return res
      .status(400)
      .json({ error: "Tous les champs doivent être renseignés." });
  }

  // Vérification du rôle
  if (!allowedRoles.includes(role)) {
    return res
      .status(400)
      .json({ error: `Le rôle spécifié (${role}) n'est pas valide.` });
  }

  // Insertion dans la base de données
  connection.query(
    "INSERT INTO user (fullName, mail, username, password, role) VALUES (?, ?, ?, ?, ?)",
    [fullName, mail, userName, password, role], // Utilise userName au lieu de username
    (error, results, fields) => {
      if (error) {
        console.error("Erreur lors de l'insertion de l'utilisateur :", error);
        return res
          .status(500)
          .json({ error: "Erreur lors de l'insertion de l'utilisateur." });
      }

      // Succès
      return res.status(201).json({
        message: "Utilisateur inséré avec succès.",
        userId: results.insertId,
      });
    }
  );
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
