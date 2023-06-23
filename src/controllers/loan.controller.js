import * as LoanService from "../services/loan.service.js";

export const getAllLoans = async (req, res) => {
  try {
    const gameToFind = req.query?.gameId || null;
    const clientToFind = req.query?.clientId || null;
    const dateToFind = req.query?.date || null;
    const loans = await LoanService.getAllLoans(
      gameToFind,
      clientToFind,
      dateToFind
    );
    res.status(200).json(loans);
  } catch (err) {
    res.status(400).json({
      msg: err.toString("el error esta en controller"),
    });
  }
};

export const getLoans = async (req, res) => {
  const page = req.body.pageable.pageNumber || 0;
  const limit = req.body.pageable.pageSize || 5;
  const sort = req.body.pageable.sort || null;
  const gameToFind = req.query?.gameId || null;
  const clientToFind = req.query?.clientId || null;
  const dateToFind = req.query?.date || null;

  try {
    const response = await LoanService.getLoans(
      page,
      limit,
      sort,
      gameToFind,
      clientToFind,
      dateToFind
    );
    res.status(200).json({
      content: response.docs,
      pageable: {
        pageNumber: response.page - 1,
        pageSize: response.limit,
      },
      totalElements: response.totalDocs,
    });
  } catch (err) {
    res.status(400).json({
      msg: err.toString(),
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
    const errorMsg = err.toString().replace("Error: Error: ", "");
    res.status(400).json({
      msg: errorMsg,
    });
  }
};

export const updateLoan = async (req, res) => {
  const loanId = req.params.id;
  try {
    await LoanService.updateLoan(loanId, req.body);
    res.status(200).json(1);
  } catch (err) {
    const errorMsg = err.toString().replace("Error: Error: ", "");
    res.status(400).json({
      msg: errorMsg,
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
