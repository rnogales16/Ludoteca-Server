import LoanModel from "../schemas/loan.schema.js";
import { getGames } from "../services/game.service.js";
import { getClients } from "../services/client.service.js";

// Función para validar si el cliente tiene más de dos préstamos en las mismas fechas
export const validateMaxTwoLoans = async (req, res, next) => {
  try {
    const data = req.body;
    const game = await getGames(data.game.id);
    const client = await getClients(data.client.id);

    const maxTwoLoans = await LoanModel.find({
      client: data.client.id,
      endingDate: { $gt: data.startingDate },
      startingDate: { $lte: data.startingDate },
    });

    if (maxTwoLoans.length >= 2) {
      throw Error(
        "One client can't have more than two games assigned to the same loan dates"
      );
    }

    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Función para validar si el juego ya ha sido prestado
export const validateGameAlreadyLoaned = async (req, res, next) => {
  try {
    const data = req.body;

    const gameLoanedOnes = await LoanModel.find({
      game: data.game.id,
      endingDate: { $gt: data.startingDate },
      startingDate: { $lte: data.startingDate },
    });

    if (gameLoanedOnes.length >= 1) {
      throw Error("This game has already been loaned");
    }

    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Función para validar la diferencia de fechas
export const validateLoanDuration = (req, res, next) => {
  try {
    const data = req.body;
    const difOnDate = new Date(data.endingDate) - new Date(data.startingDate);
    const dif14Days = difOnDate / (1000 * 60 * 60 * 24);

    if (dif14Days > 14 || dif14Days < 0) {
      throw Error(
        "The return date cannot be more than 14 days after the loan date or less than 0"
      );
    }

    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default {
  validateMaxTwoLoans,
  validateGameAlreadyLoaned,
  validateLoanDuration,
};
