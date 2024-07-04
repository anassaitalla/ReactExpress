const express = require("express");
const router = express.Router();
const connection = require("../db");

// Liste des rôles autorisés
const allowedRoles = ["admin", "user", "guest"];




// GET USERS
// ###########################################################################333############################

router.get("/", (req, res) => {
  connection.query("SELECT * FROM user", (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Server error");
      return;
    }
    res.json(results);
  });
});




// POST USERS INSERT#
// ###########################################################################333############################

router.post("/", (req, res) => {
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
    (error, results) => {
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
        (error, results) => {
          if (error) {
            console.error(
              "Erreur lors de l'insertion de l'utilisateur :",
              error
            );
            return res
              .status(500)
              .json({ error: "Erreur lors de l'insertion de l'utilisateur." });
          }

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






module.exports = router;
