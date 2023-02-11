import cors from "cors";
import express from "express";
import { postRouter } from "./router/postRouter";

// Configurando a instância do express
const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use("/posts", postRouter);

// Porta
app.listen(3003, () => {
    console.log("Servidor rodando!");
})