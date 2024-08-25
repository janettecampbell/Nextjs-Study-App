// src/app/api/questions/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Question from "@/models/Question";

// Handle POST requests to add a new question
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

    await newQuestion.save(); 

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to add question", error },
      { status: 500 }
    );
  }
}

// Handle GET requests to fetch questions
export async function GET(req: Request) {
  try {
    await dbConnect();

    const url = new URL(req.url); // Parse the request URL
    const difficulty = url.searchParams.get("difficulty"); // Get the difficulty parameter from the URL

    // Query the database based on the difficulty parameter if provided
    const questions = difficulty
      ? await Question.find({ difficulty }) // Fetch questions based on difficulty
      : await Question.find(); // Fetch all questions if no difficulty is specified

    return NextResponse.json(questions); // Return the fetched questions
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching questions", error },
      { status: 500 }
    );
  }
}