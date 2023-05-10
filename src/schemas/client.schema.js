import mongoose from "mongoose";
import normalize from "normalize-mongoose";

const { Schema, model } = mongoose;

const clientSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
});

clientSchema.plugin(normalize);

const ClientModel = model("Client", clientSchema);

export default ClientModel;
