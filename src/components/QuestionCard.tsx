"use client";
import { useState } from "react";
import Link from "next/link";

interface QuestionCardProps {
  question: {
    _id: string;
    question: string;
    answer: string;
    difficulty: "beginner" | "intermediate" | "expert";
    summary: string;
  };
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const [flipped, setFlipped] = useState(false);

  return (
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
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
