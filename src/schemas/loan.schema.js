import mongoose from "mongoose";
import normalize from "normalize-mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const { Schema, model } = mongoose;

const loanSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  game: {
    type: Schema.Types.ObjectId,
    ref: "Game",
    required: true,
  },
  startingDate: {
    type: Date,
    require: true,
  },
  endingDate: {
    type: Date,
    require: true,
  },
});

loanSchema.plugin(normalize);
loanSchema.plugin(mongoosePaginate);

const LoanModel = model("Loan", loanSchema);

export default LoanModel;
