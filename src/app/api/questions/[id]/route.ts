import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from "next/server"; 
import dbConnect from '@/lib/mongodb';
import Question from '@/models/Question';

export async function POST(req: Request) {
  try {
    const { question, answer, difficulty, summary } = await req.json();

    await dbConnect();
    const newQuestion = new Question({
      question,
      answer,
      difficulty,
      summary,
    });

    const savedQuestion = await newQuestion.save(); // Save and get the newly created question

    return NextResponse.json(savedQuestion, { status: 201 }); // Return the saved question
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to add question", error },
      { status: 500 }
    );
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const question = await Question.findById(id);
        if (!question) return res.status(404).json({ message: 'Question not found.' });
        res.status(200).json(question);
      } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
      }
      break;

    case 'PUT':
      try {
        const { question, answer, difficulty, summary } = req.body;
        const updatedQuestion = await Question.findByIdAndUpdate(id, { question, answer, difficulty, summary }, { new: true });
        if (!updatedQuestion) return res.status(404).json({ message: 'Question not found.' });
        res.status(200).json(updatedQuestion);
      } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
      }
      break;

    case 'DELETE':
      try {
        const deletedQuestion = await Question.findByIdAndDelete(id);
        if (!deletedQuestion) return res.status(404).json({ message: 'Question not found.' });
        res.status(200).json({ message: 'Question deleted.' });
      } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
      }
      break;

    default:
      res.status(405).end();
      break;
  }
}
