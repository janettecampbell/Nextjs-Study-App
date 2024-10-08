"use client";

import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import UpdateQuestionForm from "./UpdateQuestionForm";
import { RootState, AppDispatch } from "@/redux/store";
import { updateQuestionThunk } from "@/redux/slices/questionSlice";

interface QuestionCardProps {
  question: {
    _id: string;
    question: string;
    answer: string;
    difficulty: "beginner" | "intermediate" | "expert";
    summary: string;
  };
  onDelete: (id: string) => void;
  onEdit: (question: any) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onDelete,
  onEdit,
}) => {
  const [flipped, setFlipped] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userId = useSelector((state: RootState) => state.auth.user?._id);

  // Function to open the update modal
  const handleOpenModal = () => {
    onEdit(question);
    setIsModalOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      setFlipped(!flipped);
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

      onDelete(question._id);
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  return (
    <>
      <div
        className={`card ${flipped ? "flipped" : ""}`}
        onClick={() => setFlipped(!flipped)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        aria-label="flip card"
      >
        <div className="card-inner">
          <div className="card-front p-4 bg-white border rounded shadow">
            <h2 className="text-lg font-bold">{question.question}</h2>
          </div>
          <div className="card-back p-4 bg-gray-100 border rounded shadow">
            <p>{question.answer}</p>
            <Link href={`/questions/${question._id}`} className="text-blue-900">
              More
            </Link>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent card flip when clicking the Edit button
                handleOpenModal();
              }}
              className="mt-2 ml-5 text-blue-900"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent card flip when clicking the Delete button
                handleDelete();
              }}
              className="mt-2 ml-5 text-blue-900"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionCard;
