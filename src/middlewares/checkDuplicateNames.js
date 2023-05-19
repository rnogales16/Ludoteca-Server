import ClientModel from "../schemas/client.schema.js";

const checkDuplicateName = async (req, res, next) => {
  const { name } = req.body;

  try {
    const existingClient = await ClientModel.findOne({ name });

    if (existingClient) {
      return res
        .status(400)
        .json({ error: "Ya hay un usuario con el nombre " + name });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "Error de servidor" });
  }
};

export default checkDuplicateName;
