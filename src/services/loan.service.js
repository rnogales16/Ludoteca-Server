import LoanModel from "../schemas/loan.schema.js";
import { getGames } from "./game.service.js";
import { getClients } from "./client.service.js";
import ClientModel from "../schemas/client.schema.js";
import GameModel from "../schemas/game.schema.js";

export const getLoans = async (game, client, date) => {
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

export const getLoansPageable = async (
  page,
  limit,
  sort,
  game,
  client,
  date
) => {
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

    const loan = new LoanModel({
      ...data,
      game: data.game.id,
      client: data.client.id,
    });
    return await loan.save();
  } catch (e) {
    throw Error("error", e);
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

    const loanToUpdate = {
      ...data,
      game: data.game.id,
      client: data.client.id,
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
