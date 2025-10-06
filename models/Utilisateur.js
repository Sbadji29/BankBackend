const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    maxlength: 100,
  },
  prenom: {
    type: String,
    required: true,
    maxlength: 100,
  },
  numero_telephone: {
    type: String,
    required: true,
    unique: true,
  },
  photo: {
    type: String, 
  },
  date_de_naissance: {
    type: Date,
  },
  adresse: {
    type: String,
    maxlength: 255,
  },
  numero_compte: {
    type: String,
    unique: true,
    sparse: true, 
  },
  numero_identite: {
    type: String,
    unique: true,
    sparse: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    match: [/.+\@.+\..+/, "Email invalide"],
  },
  mot_de_passe: {
    type: String,
    required: true,
  },
  solde: {
    type: mongoose.Decimal128, 
    default: 0.00,
  },
  type: {
    type: String,
    enum: ["client", "distributeur", "agent"],
    required: true
  },
  statut: {
    type: Number,
    enum: [0, 1],   
    default: 0
  }
}, {
  timestamps: true 
});

userSchema.pre("save", async function (next) {
  if (!this.numero_compte) {
    let prefix = "C"; 
    if (this.type === "distributeur") prefix = "D";
    if (this.type === "agent") prefix = "A";

    const randomNum = Math.floor(100000 + Math.random() * 900000); 
    this.numero_compte = prefix + randomNum;
  }
  next();
});

module.exports = mongoose.model("Utilisateur", userSchema);
