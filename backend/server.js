require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("./utils/passport");

// Importa le route
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comment");


const app = express();

const corsOptions = {
    origin: 'https://tuo-dominio-frontend.vercel.app', // Sostituisci con il dominio del tuo frontend
    credentials: true, // Se stai utilizzando cookie o autenticazione
  };


// Middleware per la sessione (corretto)
app.use(session({
    secret: process.env.SESSION_SECRET || "supersegreto",
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === "production",  // `true` in produzione con HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 // 1 ora
    }
}));

// Inizializzazione Passport (deve essere dopo express-session)
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Verifica se l'URL di MongoDB è caricato correttamente
if (!process.env.MONGO_URL) {
    console.error("❌ Errore: MONGO_URL non definito nel file .env");
    process.exit(1);
}

console.log("✅ MongoDB URL:", process.env.MONGO_URL);

// Connessione a MongoDB
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("✅ Connesso a MongoDB"))
    .catch((err) => {
        console.error("❌ Errore di connessione a MongoDB:", err.message);
        process.exit(1);
    });

// Ascolta eventi sulla connessione MongoDB
mongoose.connection.on("error", (err) => {
    console.error("❌ Errore di connessione a MongoDB:", err.message);
});

// Usa le route
app.use("/auth", authRoutes); // Associa le route di autenticazione al prefisso /auth
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// Gestione degli errori 404
app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});

// Gestione degli errori generali (500)
app.use((err, req, res, next) => {
    console.error("❌ Errore interno:", err);
    res.status(500).json({ message: "Errore interno del server" });
});

// Avvio del server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`🚀 Server avviato sulla porta ${PORT}`);
});
