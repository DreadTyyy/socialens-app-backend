import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import routes from "./routes";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.use("/api", routes);

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to SociaLens 🐱‍🏍");
});

app.listen(port, () => {
    console.log(`Server is running in port ${port}`);
});