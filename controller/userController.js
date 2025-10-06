const Utilisateur = require("../models/Utilisateur");
const bcrypt = require("bcryptjs"); 
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
    const { prenom, nom, email, numero_telephone, mot_de_passe } = req.body;

    const user = await Utilisateur.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const updateData = {};
    if (prenom) updateData.prenom = prenom;
    if (nom) updateData.nom = nom;
    if (email) updateData.email = email;
    if (numero_telephone) updateData.numero_telephone = numero_telephone;

    if (mot_de_passe) {
      const bcrypt = require('bcrypt');
      updateData.mot_de_passe = await bcrypt.hash(mot_de_passe, 10);
    }

    const updatedUser = await Utilisateur.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-mot_de_passe");

    res.status(200).json({ message: "Profil mis à jour avec succès", user: updatedUser });
  } catch (err) {
    console.error("Erreur lors de la mise à jour:", err);
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
