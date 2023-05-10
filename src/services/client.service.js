import ClientModel from "../schemas/client.schema";

export const getClients = async function () {
  try {
    return await ClientModel.find();
  } catch (e) {
    throw Error("Error ferching categories");
  }
};

export const getClient = async function (id) {
  try {
    return await ClientModel.findById(id);
  } catch (e) {
    throw Error("There is no client with this Id");
  }
};

export const createClient = async function (name) {
  try {
    const client = new ClientModel({ name });
    return await client.save();
  } catch (e) {
    throw Error("Error creating client");
  }
};

export const updateClient = async function (id, name) {
  try {
    const client = await ClientModel.findById(id);
    if (!client) {
      throw Error("There is no client with that Id");
    }
    return await ClientMode.findByIdAndUpdate(id, { name });
  } catch (e) {
    throw Error(e);
  }
};

export const deleteClient = async function (id) {
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
