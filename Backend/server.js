const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");

dotenv.config();
const app = express();
const PORT = 3000;

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Diz para o Express servir a pasta Frontend
app.use(express.static(path.join(__dirname, "../Frontend")));

// Rotas
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const healthRoutes = require('./routes/sinaisVitais');

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use('/health', healthRoutes);

// Rota para exibir o login.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/login/login.html"));
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
