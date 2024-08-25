"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import UpdateQuestionForm from "./UpdateQuestionForm";
import { RootState } from "@/redux/store";

interface QuestionCardProps {
  question: {
    _id: string;
    question: string;
    answer: string;
    difficulty: "beginner" | "intermediate" | "expert";
    summary: string;
    note: string;
  };
  onDelete: (id: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onDelete }) => {
  const [flipped, setFlipped] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userId = useSelector((state: RootState) => {
    return state.user.user?.userId;
  });

  // Function to open the update modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const onUpdateQuestion = async (newQuestion: any) => {
    if (!userId) {
      console.error("User is not logged in. Cannot update question.");
      return;
    }

    try {
      const response = await fetch(`/api/questions/${newQuestion.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: newQuestion.question,
          answer: newQuestion.answer,
          difficulty: newQuestion.difficulty,
          summary: newQuestion.summary,
          note: newQuestion.notes.note, // Pass the note here
          userId: userId,
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Failed to update question");
      }

      const updatedQuestion = await response.json();
      // Update the question state if needed
      setIsModalOpen(false); // Close modal after updating
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  const handleDelete = async () => {
    if (!userId) {
      console.error("User is not logged in. Cannot delete question.");
      return;
    }

    try {
      const response = await fetch(`/api/questions/${question._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }), // Include userId for authorization
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Failed to delete question");
      }

      onDelete(question._id)

    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  return (
    <>
      <div
        className={`card ${flipped ? "flipped" : ""}`}
        onClick={() => setFlipped(!flipped)}
      >
        <div className="card-inner">
          <div className="card-front p-4 bg-white border rounded shadow">
            <h2 className="text-lg font-bold">{question.question}</h2>
          </div>
          <div className="card-back p-4 bg-gray-100 border rounded shadow">
            <p>{question.answer}</p>
            <Link href={`/questions/${question._id}`} className="text-blue-500">
              More
            </Link>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent card flip when clicking the Edit button
                handleOpenModal();
              }}
              className="mt-2 ml-5 text-blue-500"
            >
              Edit
            </button>
            <button onClick={(e) => {
                e.stopPropagation(); // Prevent card flip when clicking the Edit button
                handleDelete()}} className="mt-2 ml-5 text-blue-500">
              Delete
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <UpdateQuestionForm
          question={{
            id: question._id, // Map _id to id
            question: question.question,
            answer: question.answer,
            difficulty: question.difficulty,
            summary: question.summary,
            notes: { userId: userId || "", note: question.note },
          }}
          onClose={handleCloseModal}
          onUpdateQuestion={onUpdateQuestion}
        />
      )}
    </>
  );
};

export default QuestionCard;
