import cors from "cors";
import express from "express";
import { postRouter } from "./router/postRouter";
import { userRouter } from "./router/userRouter";
import dotenv from "dotenv";

dotenv.config();

// Configurando a instância do express
const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use("/posts", postRouter);
app.use("/users", userRouter);

// Porta
app.listen(Number(process.env.PORT || 3003), () => {
    console.log(`Servidor rodando na porta ${process.env.PORT}`);
})