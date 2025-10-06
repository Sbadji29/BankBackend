const Transaction = require('../models/Transaction');
const Utilisateur = require('../models/Utilisateur'); 

exports.creerDepot = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body); // <- debug
    const { idEnvoyeur, montant } = req.body;

    if (!idEnvoyeur || !montant || montant <= 0) {
      return res.status(400).json({ message: "Données invalides" });
    }

    const utilisateur = await Utilisateur.findById(idEnvoyeur);
    if (!utilisateur) return res.status(404).json({ message: "Utilisateur introuvable" });

    const transaction = new Transaction({
      idEnvoyeur,
      idRecepteur: req.body.idRecepteur, // ici tu peux récupérer le distributeur
      type_transaction: 'depot',
      montant
    });

    await transaction.save();
    return res.status(201).json({ message: "Dépôt créé avec succès", transaction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};



exports.annulerDepot = async (req, res) => {
  try {
    const { idTransaction } = req.params;

    const transaction = await Transaction.findById(idTransaction);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction non trouvée" });
    }

    // Vérifier que c'est bien un dépôt
    if (transaction.type_transaction !== 'depot') {
      return res.status(400).json({ message: "Seules les transactions de type dépôt peuvent être annulées" });
    }

    // Vérifier que ce n'est pas déjà annulé
    if (transaction.statut === 'annulee') {
      return res.status(400).json({ message: "Ce dépôt est déjà annulé" });
    }

    // ✅ Mettre à jour le statut
    transaction.statut = 'annulee';
    await transaction.save();

    res.status(200).json({ message: "Dépôt annulé avec succès", transaction });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'annulation", error: error.message });
  }
};


exports.listerTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('idEnvoyeur idRecepteur');
    res.status(200).json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
