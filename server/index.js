// imports
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import dataModel from "./model/datamodel.js";
import { data } from "./data/data.js";
//Configuration
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// mongoose setup
// make sure PORT and MONGO_URL are available in .env file
const PORT = process.env.PORT || 9000;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server port: ${PORT}`);
      // This command to be run only once
      // dataModel.insertMany(data);
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", async (req, res) => {
  const data = await dataModel.find({});
  console.log(data);
  res.status(200).json(data);
});
