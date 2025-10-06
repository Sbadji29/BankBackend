const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");        
const transactionRoutes = require("./routes/transactionRoutes"); 

const app= express();
app.use(express.json());
const cors = require("cors");
app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true
}));
mongoose.connect("mongodb+srv://Sbadji9:Bissextile29@cluster0.dz7tijz.mongodb.net/minibank",{
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Connecté à MongoDB"))
  .catch(err => console.error("Erreur connexion MongoDB :", err));

app.use("/api/utilisateurs", userRoutes);
app.use("/api/auth", authRoutes);                
app.use("/api/transactions", transactionRoutes);
app.use("/api/uploads", express.static("uploads"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Serveur lancé sur le port ${PORT}`));