import ClientModel from "../schemas/client.schema.js";

export const createClient = async function (name) {
  try {
    const client = new ClientModel({ name });
    return await client.save();
  } catch (e) {
    throw Error(e);
  }
};

export const getClients = async function () {
  try {
    return await ClientModel.find().sort("name");
  } catch (e) {
    throw Error("Error fetching clients");
  }
};

export const updateClient = async (id, name) => {
  try {
    const client = await ClientModel.findById(id);
    if (!client) {
      throw Error("There is no client with that Id");
    }
    return await ClientModel.findByIdAndUpdate(id, { name });
  } catch (e) {
    throw Error(e);
  }
};

export const deleteClient = async (id) => {
  try {
    const client = await ClientModel.findById(id);
    if (!client) {
      throw Error("There is no client with that Id");
    }
    return await ClientModel.findByIdAndDelete(id);
  } catch (e) {
    throw Error(e);
  }
};
