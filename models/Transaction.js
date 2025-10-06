const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  idEnvoyeur: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
  idRecepteur: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
  type_transaction: { 
    type: String, 
    enum: ['depot', 'retrait', 'transfert'], 
    required: true 
  },
  montant: { type: Number, required: true },
  frais: { type: Number, default: 0.0 },
  dateOperation: { type: Date, default: Date.now },
  statut: { type: String, enum: ['validee', 'annulee'], default: 'validee' },
  bonus: { type: Number, default: 0.0 }
});

module.exports = mongoose.model('Transaction', transactionSchema);
