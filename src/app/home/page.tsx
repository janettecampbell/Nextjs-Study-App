"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import QuestionCard from "@/components/QuestionCard";
import QuestionForm from "@/components/QuestionForm";
import UpdateQuestionForm from "@/components/UpdateQuestionForm";

interface Question {
  _id: string;
  question: string;
  answer: string;
  difficulty: "beginner" | "intermediate" | "expert";
  summary: string;
}

const Home = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [difficultyFilter, setDifficultyFilter] = useState<
    "beginner" | "intermediate" | "expert" | ""
  >("");

  const handleDifficultyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDifficultyFilter(
      event.target.value as "beginner" | "intermediate" | "expert" | ""
    );
  };

  const filteredQuestions = difficultyFilter
    ? questions.filter((question) => question.difficulty === difficultyFilter)
    : questions;

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedQuestion(null); // Clear selected question when closing the add question modal
  };

  const openUpdateModal = (question: Question) => {
    console.log("Opening update modal for:", question);
    setSelectedQuestion(question);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    console.log("Closing update modal");
    setIsUpdateModalOpen(false);
    setSelectedQuestion(null); // Clear selected question when closing the update modal
  };

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      if (isModalOpen) {
        closeModal();
      } else if (isUpdateModalOpen) {
        closeUpdateModal();
      }
    }
  };

  const handleDeleteQuestion = (id: any) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((question) => question._id !== id)
    );
  };

  const onAddQuestion = (newQuestion: Question) => {
    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
  };

  const onUpdateQuestion = (updatedQuestion: Question) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question._id === updatedQuestion._id ? updatedQuestion : question
      )
    );
    closeUpdateModal();
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await axios.get("/api/questions");
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <button
        type="button"
        onClick={openModal}
        className="p-2 bg-blue-500 text-white"
      >
        Add Question
      </button>
      <label htmlFor="difficulty" className="ml-5">
        Choose difficulty level:{" "}
      </label>
      <select
        className="border"
        id="difficulty"
        value={difficultyFilter}
        onChange={handleDifficultyChange}
      >
        <option value="">All</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="expert">Expert</option>
      </select>

      {/* Add Question Modal */}
      {isModalOpen && (
        <div
          className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={handleClickOutside}
        >
          <div className="modal-container relative bg-white p-4 rounded shadow-lg z-20">
            <QuestionForm onClose={closeModal} onAddQuestion={onAddQuestion} />
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">All Questions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuestions.map((question: Question) => (
          <QuestionCard
            key={question._id}
            question={question}
            onDelete={handleDeleteQuestion}
            onEdit={openUpdateModal}
          />
        ))}
      </div>

      {/* Update Question Modal */}
      {isUpdateModalOpen && selectedQuestion && (
        <div
          className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={handleClickOutside}
        >
          <div className="modal-container relative bg-white p-4 rounded shadow-lg z-20">
            <UpdateQuestionForm
              question={selectedQuestion}
              onClose={closeUpdateModal}
              onUpdateQuestion={onUpdateQuestion}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
