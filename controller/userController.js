const Utilisateur = require("../models/Utilisateur");

exports.createUser = async (req, res) => {
  try {
    const newUser = new Utilisateur(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await Utilisateur.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await Utilisateur.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const body = req.body || {};
    const prenom = body.prenom;
    const nom = body.nom;
    const email = body.email;
    const numero_telephone = body.numero_telephone;
    const mot_de_passe = body.mot_de_passe;

    let photo = null;
    if (req.file) photo = req.file.path;

    const updateData = { prenom, nom, email, numero_telephone };
    
    // ✅ Hacher le mot de passe avant de le sauvegarder
    if (mot_de_passe) {
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
      updateData.mot_de_passe = hashedPassword;
    }
    
    if (photo) updateData.photo = photo;

    const user = await Utilisateur.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json({ message: "Profil mis à jour", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};






exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await Utilisateur.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.countUsersByType = async (req, res) => {
  try {
    const clients = await Utilisateur.countDocuments({ type: "client" });
    const distributeurs = await Utilisateur.countDocuments({ type: "distributeur" });
    const agents = await Utilisateur.countDocuments({ type: "agent" });
    const total = await Utilisateur.countDocuments();

    res.json({
      total,
      clients,
      distributeurs,
      agents
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.switchStatut = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Utilisateur.findById(id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    user.statut = user.statut === 0 ? 1 : 0;
    await user.save();
    res.json({ message: "Statut mis à jour avec succès", statut: user.statut });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.deleteMultipleUsers = async (req, res) => {
  try {
    const { userIds } = req.body;
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: "Aucun utilisateur sélectionné" });
    }

    const result = await Utilisateur.deleteMany({ _id: { $in: userIds } });
    res.json({ message: `${result.deletedCount} utilisateur(s) supprimé(s)` });
  } catch (err) {
    res.status(500).json({ error: err.message }); 
  }
};


exports.switchStatutMultiple = async (req, res) => {
  try {
    const { userIds } = req.body;
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: "Aucun utilisateur sélectionné" });
    }

    const result = await Utilisateur.updateMany(
      { _id: { $in: userIds } },
      [{ $set: { statut: { $cond: [{ $eq: ["$statut", 0] }, 1, 0] } } }]
    );

    res.json({ message: `${result.modifiedCount} utilisateur(s) mis à jour avec succès` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
