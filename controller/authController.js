const Utilisateur = require("../models/Utilisateur");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { nom, prenom, numero_telephone, email, mot_de_passe, type } = req.body;
    console.log(numero_telephone);
    console.log(type);

    if (!nom || !prenom || !email || !mot_de_passe) {
      return res.status(400).json({ error: "Champs obligatoires manquants !" });
    }

    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    const newUser = new Utilisateur({
      ...req.body,
      mot_de_passe: hashedPassword,
      photo: req.file ? req.file.path : null,
    });

    await newUser.save();

    res.status(201).json({ message: "Utilisateur inscrit avec succès", user: newUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



exports.login = async (req, res) => {
  try {
    const { identifiant, mot_de_passe } = req.body; 

    const user = await Utilisateur.findOne({
      $or: [{ numero_compte: identifiant }, { numero_telephone: identifiant }]
    });

    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    if (user.status === 1) {
      return res.status(403).json({ message: "Compte bloqué, veuillez contacter l'administration" });
    }

    const validPassword = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!validPassword) return res.status(401).json({ message: "Mot de passe incorrect" });

    if (user.type !== "agent") {
      return res.status(403).json({ message: "Seuls les agents peuvent se connecter" });
    }

    const token = jwt.sign(
      { id: user._id, type: user.type },
      "SECRET_KEY", 
      { expiresIn: "2h" }
    );

    res.status(200).json({ message: "Connexion réussie", token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Déconnexion réussie (côté client, supprimez le token)" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token manquant" });

    const decoded = jwt.verify(token, "SECRET_KEY");
    const user = await Utilisateur.findById(decoded.id).select("-mot_de_passe");
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

