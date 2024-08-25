import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface QuestionFormProps {
  question: {
    id: string;
    question: string;
    answer: string;
    difficulty: "beginner" | "intermediate" | "expert";
    summary: string;
    notes: { [userId: string]: string | null };
  };
  onClose: () => void;
  onUpdateQuestion: (newQuestion: any) => void;
}

const UpdateQuestionForm: React.FC<QuestionFormProps> = ({
  question,
  onClose,
  onUpdateQuestion,
}) => {
  const [note, setNote] = useState("");
  const [updatedQuestion, setUpdatedQuestion] = useState(question.question);
  const [updatedAnswer, setUpdatedAnswer] = useState(question.answer);
  const [updatedDifficulty, setUpdatedDifficulty] = useState(
    question.difficulty
  );
  const [updatedSummary, setUpdatedSummary] = useState(question.summary);

  const userId = useSelector((state: RootState) => {
    return state.user.user?.userId; 
  });

  useEffect(() => {
    if (userId) {
      setNote(question.notes.note || "");
    } else {
      setNote("");
    }
  }, [question, userId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      console.error("User ID is not available");
      return;
    }

    onUpdateQuestion({
      ...question,
      notes: { userId: question.notes.userId, note },
    });

    onClose();
  };

  // Close modal when user clicks outside of it
  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    const modalContainer = e.currentTarget.querySelector(
      ".update-modal-container"
    );
    if (!modalContainer || modalContainer.contains(e.target as Node)) return; // Only close if clicked outside
    onClose();
  };

  return (
    <div className="update-modal-overlay" onClick={handleClickOutside}>
      <div className="update-modal-container">
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
          <textarea
            placeholder="Notes"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            required
            className="p-2 border w-full"
          />
          <div className="flex justify-between">
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded"
            >
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
    </div>
  );
};

export default UpdateQuestionForm;
