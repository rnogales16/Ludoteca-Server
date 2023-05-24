import LoanModel from "../schemas/loan.schema.js";
import { getGames } from "./game.service.js";
import { getClients } from "./client.service.js";

export const getLoans = async (game, client) => {
  try {
    const find = client
      ? { $and: [{ game: game }, { client: client }] }
      : { game: game };
    return await LoanModel.find(find)
      .sort("id")
      .populate("client")
      .populate("game");
  } catch (e) {
    throw Error(e);
  }
};

export const createLoan = async (data) => {
  try {
    const game = await getGames(data.game.id);
    console.log("Game:", data.game.id);
    if (!game) {
      throw Error("There is no game with that Id");
    }
    const client = await getClients(data.client.id);
    console.log("Client:", data.client.id);
    if (!client) {
      throw Error("There is no author with Id");
    }

    const loan = new LoanModel({
      ...data,
      game: data.game.id,
      client: data.client.id,
    });
    console.log(game);
    console.log(loan);
    return await loan.save();
  } catch (e) {
    throw Error(e);
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
