import mongoose, { model, models } from "mongoose";

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "expert"],
    required: true,
  },
  summary: { type: String, required: true },
});

const Question = models.Question || model("Question", QuestionSchema);

export default Question;
