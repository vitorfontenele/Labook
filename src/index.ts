import cors from "cors";
import express from "express";

// Configurando a instância do express
const app = express();
app.use(cors());
app.use(express.json());

// Porta
app.listen(3003, () => {
    console.log("Servidor rodando!");
})