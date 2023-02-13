import cors from "cors";
import express from "express";
import { postRouter } from "./router/postRouter";
import { userRouter } from "./router/userRouter";

// Configurando a instância do express
const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use("/posts", postRouter);
app.use("/users", userRouter);

// Porta
app.listen(3003, () => {
    console.log("Servidor rodando!");
})