import { Schema, model, models } from "mongoose";

// User Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  notes: [
    {
      questionId: { type: Schema.Types.ObjectId, ref: "Question" },
      note: String,
    },
  ],
});

const User = models.User || model("User", UserSchema);

export default User;