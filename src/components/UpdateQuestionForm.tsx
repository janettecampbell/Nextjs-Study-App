import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface QuestionFormProps {
  question: {
    _id: string;
    question: string;
    answer: string;
    difficulty: "beginner" | "intermediate" | "expert";
    summary: string;
  };
  onClose: () => void;
  onUpdateQuestion: (newQuestion: any) => void;
}

const UpdateQuestionForm: React.FC<QuestionFormProps> = ({
  question,
  onClose,
  onUpdateQuestion,
}) => {
  const [updatedQuestion, setUpdatedQuestion] = useState(question.question);
  const [updatedAnswer, setUpdatedAnswer] = useState(question.answer);
  const [updatedDifficulty, setUpdatedDifficulty] = useState(
    question.difficulty
  );
  const [updatedSummary, setUpdatedSummary] = useState(question.summary);

  const userId = useSelector((state: RootState) => state.user.user?._id);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      console.error("User ID is not available");
      return;
    }

    const payload = {
      _id: question._id,
      question: updatedQuestion,
      answer: updatedAnswer,
      difficulty: updatedDifficulty,
      summary: updatedSummary,
      userId: userId,
    };

    try {
      const response = await fetch(`/api/questions/${question._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update question");
      }

      const updatedQuestion = await response.json();
      onUpdateQuestion(updatedQuestion); // Pass the updated question back to the parent component
      onClose(); // Close the form
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Update Question</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          placeholder="Question"
          value={updatedQuestion}
          onChange={(e) => setUpdatedQuestion(e.target.value)}
          required
          className="p-2 border w-full"
        />
        <input
          type="text"
          placeholder="Answer"
          value={updatedAnswer}
          onChange={(e) => setUpdatedAnswer(e.target.value)}
          required
          className="p-2 border w-full"
        />
        <select
          value={updatedDifficulty}
          onChange={(e) =>
            setUpdatedDifficulty(
              e.target.value as "beginner" | "intermediate" | "expert"
            )
          }
          className="p-2 border w-full"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="expert">Expert</option>
        </select>
        <textarea
          placeholder="Summary"
          value={updatedSummary}
          onChange={(e) => setUpdatedSummary(e.target.value)}
          required
          className="p-2 border w-full"
        />
        <div className="flex justify-between">
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">
            Update Question
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-2 bg-gray-300 text-black rounded"
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateQuestionForm;
