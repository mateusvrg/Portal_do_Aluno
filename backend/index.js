import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import AdminRouter from "./routes/AdminRoutes.js";
import AuthRouter from "./routes/authRoutes.js";
import ProfessorRouter from "./routes/professorRoutes.js";
import StudentRouter from "./routes/studentRoutes.js";

dotenv.config();
const app = express();

const port_server = process.env.PORT_SERVER;
const port_app = process.env.PORT_APP;

app.use(express.json());

app.use(cors({ credentials: true, origin: `http://localhost:${port_app}` }));

//Routes
app.use("/users", AdminRouter);
app.use("/", AuthRouter);
app.use('/student', StudentRouter)
app.use('/professor', ProfessorRouter)

app.listen(port_server);
