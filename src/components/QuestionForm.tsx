import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addQuestion } from "@/redux/slices/questionSlice";
import { AppDispatch } from "@/redux/store";

interface QuestionFormProps {
  onClose: () => void;
  onAddQuestion: (newQuestion: any) => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  onClose,
  onAddQuestion,
}) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [difficulty, setDifficulty] = useState<
    "beginner" | "intermediate" | "expert"
  >("beginner");
  const [summary, setSummary] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newQuestion = {
      question,
      answer,
      difficulty,
      summary,
    };

    try {
      const actionResult = await dispatch(addQuestion(newQuestion)).unwrap();
      onAddQuestion(actionResult); 
      onClose(); // Close the modal after submitting
    } catch (error) {
      console.error("Failed to add question: ", error);
    }
  };

  return (
    <div className="modal-content">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 p-4 bg-white rounded shadow-md"
      >
        <input
          type="text"
          placeholder="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
          className="p-2 border"
        />
        <input
          type="text"
          placeholder="Answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
          className="p-2 border"
        />
        <select
          value={difficulty}
          onChange={(e) =>
            setDifficulty(
              e.target.value as "beginner" | "intermediate" | "expert"
            )
          }
          className="p-2 border"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="expert">Expert</option>
        </select>
        <textarea
          placeholder="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
          className="p-2 border"
        />
        <div className="flex justify-between">
          <button type="submit" className="p-2 bg-blue-500 text-white">
            Add Question
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-2 bg-gray-300 text-black"
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;
