"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import QuestionCard from "@/components/QuestionCard";
import QuestionForm from "@/components/QuestionForm";

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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const onAddQuestion = (newQuestion: Question) => {
    console.log("New question added:", newQuestion);
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions, newQuestion];
      console.log("Updated questions array:", updatedQuestions);
      return updatedQuestions;
    }); // Add new question to the state
  };

  // Fetch questions on component mount
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

  // Function to add a new question to the state
  // const addNewQuestion = (newQuestion: Question) => {
  //   setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
  // };

  return (
    <div className="container mx-auto p-4">
      <button
        type="button"
        onClick={openModal}
        className="p-2 bg-blue-500 text-white"
      >
        Add Question
      </button>
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
        {questions.map((question: any) => (
          <QuestionCard key={question._id} question={question} />
        ))}
      </div>
    </div>
  );
};

export default Home;
