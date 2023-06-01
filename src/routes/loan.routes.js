import { Router } from "express";
import { check } from "express-validator";
import validateFields from "../middlewares/validateFields.js";
import {
  createLoan,
  getLoans,
  updateLoan,
  deleteLoan,
  getLoansPageable,
} from "../controllers/loan.controller.js";
const loanRouter = Router();

loanRouter.put(
  "/:id",
  [
    check("client.id").not().isEmpty(),
    check("game.id").not().isEmpty(),
    check("startingDate").not().isEmpty(),
    check("endingDate").not().isEmpty(),
    validateFields,
  ],
  updateLoan
);

loanRouter.put(
  "/",
  [
    check("client.id").not().isEmpty(),
    check("game.id").not().isEmpty(),
    check("startingDate").not().isEmpty(),
    check("endingDate").not().isEmpty(),
    validateFields,
  ],
  createLoan
);

loanRouter.delete("/:id", deleteLoan);
loanRouter.get("/", getLoans);

loanRouter.post(
  "/",
  [
    check("pageable").not().isEmpty(),
    check("pageable.pageSize").not().isEmpty(),
    check("pageable.pageNumber").not().isEmpty(),
    validateFields,
  ],
  getLoansPageable
);

export default loanRouter;
