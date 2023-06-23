import LoanModel from "../schemas/loan.schema.js";
import { getGames } from "./game.service.js";
import { getClients } from "./client.service.js";
import ClientModel from "../schemas/client.schema.js";
import GameModel from "../schemas/game.schema.js";

export const getAllLoans = async (game, client, date) => {
  try {
    const find = {};

    if (client || game || date) {
      if (client && game) {
        find.$and = [{ game: game }, { client: client }];
      } else if (client) {
        find.client = client;
      } else if (game) {
        find.game = game;
      }

      if (date) {
        find.$or = [
          { startingDate: date },
          { endingDate: date },
          {
            startingDate: { $lte: date },
            endingDate: { $gte: date },
          },
        ];
      }
    }

    return await LoanModel.find(find)
      .sort("id")
      .populate("client")
      .populate("game");
  } catch (e) {
    throw Error(e);
  }
};

export const getLoans = async (page, limit, sort, game, client, date) => {
  const sortObj = {
    [sort?.property || "name"]: sort?.direction === "DESC" ? "DESC" : "ASC",
  };

  const find = {};
  if (client || game || date) {
    if (client && game) {
      find.$and = [{ game: game }, { client: client }];
    } else if (client) {
      find.client = client;
    } else if (game) {
      find.game = game;
    }
    if (date) {
      find.$or = [
        { startingDate: date },
        { endingDate: date },
        {
          startingDate: { $lte: date },
          endingDate: { $gte: date },
        },
      ];
    }
  }

  try {
    const options = {
      page: parseInt(page) + 1,
      limit,
      sort: sortObj,
      populate: [
        {
          path: "client",
          model: ClientModel,
        },
        {
          path: "game",
          model: GameModel,
        },
      ],
    };

    return await LoanModel.paginate(find, options);
  } catch {
    throw Error("Error fetching loans page");
  }
};

export const createLoan = async (data) => {
  try {
    const game = await getGames(data.game.id);
    if (!game) {
      throw Error("There is no game with that Id");
    }
    const client = await getClients(data.client.id);
    if (!client) {
      throw Error("There is no author with Id");
    }

    const maxTwoLoans = await LoanModel.find({
      client: data.client.id,
      endingDate: { $gt: data.startingDate },
      startingDate: { $lte: data.startingDate },
    });

    if (maxTwoLoans.length >= 2) {
      throw Error(
        "The client can't have more than two games assigned to the same loan dates"
      );
    }

    const gameLoanedOnes = await LoanModel.find({
      game: data.game.id,
      endingDate: { $gt: data.startingDate },
      startingDate: { $lte: data.startingDate },
    });

    if (gameLoanedOnes.length >= 1) {
      throw Error("This game has been already loaned");
    }

    const difOnDate = new Date(data.endingDate) - new Date(data.startingDate);
    const dif14Days = difOnDate / (1000 * 60 * 60 * 24);
    if (dif14Days > 14 || dif14Days < 0) {
      throw Error(
        "The return date cannot be more than 14 days after the loan date or less than 0"
      );
    }

    const loan = new LoanModel({
      game: data.game.id,
      client: data.client.id,
      startingDate: data.startingDate,
      endingDate: data.endingDate,
    });
    return await loan.save();
  } catch (error) {
    throw Error(error);
  }
};

export const updateLoan = async (id, data) => {
  try {
    const loan = await LoanModel.findById(id);
    if (!loan) {
      throw Error("There is no loan with that Id");
    }

    const game = await getGames(data.game.id);
    if (!game) {
      throw Error("There is no game with that Id");
    }

    const client = await getClients(data.client.id);
    if (!client) {
      throw Error("There is no client with that Id");
    }

    const maxTwoLoans = await LoanModel.find({
      client: data.client.id,
      endingDate: { $gt: data.startingDate },
      startingDate: { $lte: data.startingDate },
    });

    if (maxTwoLoans.length >= 2) {
      throw Error(
        "The client can't have more than two games assigned to the same loan dates"
      );
    }

    const gameLoanedOnes = await LoanModel.find({
      game: data.game.id,
      endingDate: { $gt: data.startingDate },
      startingDate: { $lte: data.startingDate },
    });

    if (gameLoanedOnes.length >= 1) {
      throw Error("This game has been already loaned");
    }

    const difOnDate = new Date(data.endingDate) - new Date(data.startingDate);
    const dif14Days = difOnDate / (1000 * 60 * 60 * 24);
    if (dif14Days > 14 || dif14Days < 0) {
      throw Error(
        "The return date cannot be more than 14 days after the loan date or less than 0"
      );
    }

    const loanToUpdate = {
      game: data.game.id,
      client: data.client.id,
      startingDate: data.startingDate,
      endingDate: data.endingDate,
    };
    return await LoanModel.findByIdAndUpdate(id, loanToUpdate, { new: false });
  } catch (e) {
    throw Error(e);
  }
};

export const deleteLoan = async (id) => {
  try {
    const loan = await LoanModel.findById(id);
    if (!loan) {
      throw Error("There is no loan with that Id");
    }
    return await LoanModel.findByIdAndDelete(id);
  } catch (e) {
    throw Error(e);
  }
};
