import * as LoanService from "../services/loan.service.js";

export const getLoans = async (req, res) => {
  try {
    const gameToFind = req.query?.gameId || null;
    const clientToFind = req.query?.clientId || null;
    const loans = await LoanService.getLoans(gameToFind, clientToFind);
    res.status(200).json(loans);
  } catch (err) {
    res.status(400).json({
      msg: err.toString("el error esta en controller"),
    });
  }
};

export const createLoan = async (req, res) => {
  try {
    const loan = await LoanService.createLoan(req.body);
    res.status(200).json({
      loan,
    });
  } catch (err) {
    res.status(400).json({
      msg: err.toString(),
    });
  }
};

export const updateLoan = async (req, res) => {
  const loanId = req.params.id;
  try {
    await LoanService.updateLoan(loanId, req.body);
    res.status(200).json(1);
  } catch (err) {
    res.status(400).json({
      msg: err.toString(),
    });
  }
};

export const deleteLoan = async (req, res) => {
  const loanId = req.params.id;
  try {
    const deleteLoan = await LoanService.deleteLoan(loanId);
    res.status(200).json({
      loan: deleteLoan,
    });
  } catch (err) {
    res.status(400).json({
      msg: err.toString(),
    });
  }
};
