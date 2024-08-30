"use client"
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const QuestionDetails = ({ params }: { params: { id: string } }) => {
  const [question, setQuestion] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const userId = useSelector((state: RootState) => state.user.user?._id);
  console.log("questions/[id]", userId);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch(`/api/questions/${params.id}`);
        if (!response.ok) {
          throw new Error('Question not found');
        }
        const data = await response.json();
        console.log(data)
        setQuestion(data);
      } catch (error) {
        console.error(error);
        setQuestion(null);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!question) {
    return <div>Question not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{question.question}</h1>
      <p><strong>Answer:</strong> {question.answer}</p>
      <p><strong>Difficulty:</strong> {question.difficulty}</p>
      <p><strong>Summary:</strong> {question.summary}</p>
    </div>
  );
};

export default QuestionDetails;
