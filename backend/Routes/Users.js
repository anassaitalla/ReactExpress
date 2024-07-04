const express = require("express");
const router = express.Router();
const connection = require("../db");

// Liste des rôles autorisés
const allowedRoles = ["admin", "user", "guest"];

// GET USERS
// ###########################################################################333############################
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
        return res.status(500).json({
          error: "Erreur lors de la vérification de l'utilisateur existant.",
        });
      }

      // Vérifie si l'utilisateur existe déjà
      if (results.length > 0) {
        return res.status(400).json({
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

          return res.status(201).json({
            message: "Utilisateur inséré avec succès.",
            userId: results.insertId,
          });
        }
      );
    }
  );
});

// PUT USER UPDATE
// ###########################################################################333############################
// ###########################################################################333############################

router.put("/:username", (req, res) => {
  const username = req.params.username;
  const { fullName, mail, password, role } = req.body;

  // Validation des données
  if (!fullName || !mail || !password || !role) {
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

  // Vérification si l'email existe déjà
  connection.query(
    "SELECT * FROM user WHERE (mail = ? OR username = ?) AND username != ?",
    [mail, username, username], // Exclure l'utilisateur actuel de la vérification
    (error, results) => {
      if (error) {
        console.error(
          "Erreur lors de la vérification de l'utilisateur existant :",
          error
        );
        return res.status(500).json({
          error: "Erreur lors de la vérification de l'utilisateur existant.",
        });
      }

      // Vérifie si l'email existe déjà pour un autre utilisateur
      if (results.length > 0) {
        const existingUser = results.find((user) => user.username !== username);
        if (existingUser && existingUser.mail === mail) {
          return res
            .status(400)
            .json({ error: "Un autre utilisateur a déjà cet email." });
        }
        if (existingUser && existingUser.username === username) {
          return res.status(400).json({
            error: "Cet email est déjà utilisé par un autre utilisateur.",
          });
        }
      }

      // Mise à jour dans la base de données
      connection.query(
        "UPDATE user SET fullName = ?, mail = ?, password = ?, role = ? WHERE username = ?",
        [fullName, mail, password, role, username],
        (error, results) => {
          if (error) {
            console.error(
              "Erreur lors de la mise à jour de l'utilisateur :",
              error
            );
            return res.status(500).json({
              error: "Erreur lors de la mise à jour de l'utilisateur.",
            });
          }

          return res
            .status(200)
            .json({ message: "Utilisateur mis à jour avec succès." });
        }
      );
    }
  );
});

// DELETE USER
// ###########################################################################333############################
// ###########################################################################333############################
router.delete("/:username", (req, res) => {
  const username = req.params.username;

  // Vérification si l'utilisateur existe par username
  connection.query(
    "SELECT * FROM user WHERE username = ?",
    [username],
    (error, results) => {
      if (error) {
        console.error(
          "Erreur lors de la vérification de l'utilisateur existant :",
          error
        );
        return res.status(500).json({
          error: "Erreur lors de la vérification de l'utilisateur existant.",
        });
      }

      // Vérifie si l'utilisateur existe
      if (results.length === 0) {
        return res.status(404).json({ error: "Utilisateur non trouvé." });
      }

      // Suppression dans la base de données
      connection.query(
        "DELETE FROM user WHERE username = ?",
        [username],
        (error, results) => {
          if (error) {
            console.error(
              "Erreur lors de la suppression de l'utilisateur :",
              error
            );
            return res.status(500).json({
              error: "Erreur lors de la suppression de l'utilisateur.",
            });
          }

          return res
            .status(200)
            .json({ message: "Utilisateur supprimé avec succès." });
        }
      );
    }
  );
});

// LOGIN
// ###########################################################################333############################
// ###########################################################################333############################
router.post("/login", (req, res) => {
  const { userName, password } = req.body;

  // Validation des données
  if (!userName || !password) {
    return res
      .status(400)
      .json({
        error: "Veuillez saisir votre nom d'utilisateur et mot de passe.",
      });
  }

  // Vérification de l'utilisateur dans la base de données
  connection.query(
    "SELECT * FROM user WHERE username = ? AND password = ?",
    [userName, password],
    (error, results) => {
      if (error) {
        console.error(
          "Erreur lors de la vérification des identifiants :",
          error
        );
        return res
          .status(500)
          .json({ error: "Erreur lors de la vérification des identifiants." });
      }

      // Vérifie si l'utilisateur est trouvé
      if (results.length === 0) {
        return res
          .status(400)
          .json({ error: "Nom d'utilisateur ou mot de passe incorrect." });
      }

      // Succès
      return res.status(200).json({ message: "Authentification réussie." });
    }
  );
});

module.exports = router;
