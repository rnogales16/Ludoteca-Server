import { Router } from "express";
import { check } from "express-validator";
import validateFields from "../middlewares/validateFields.js";
import checkDuplicateNames from "../middlewares/checkDuplicateNames.js";
import {
  createClient,
  getClients,
  updateClient,
  deleteClient,
} from "../controllers/client.controller.js";

const clientRouter = Router();
clientRouter.put(
  "/",
  [check("name").not().isEmpty(), validateFields, checkDuplicateNames],
  createClient
);
clientRouter.put(
  "/:id",
  [check("name").not().isEmpty(), validateFields, checkDuplicateNames],
  updateClient
);
clientRouter.get("/", getClients);
clientRouter.delete("/:id", deleteClient);

export default clientRouter;
