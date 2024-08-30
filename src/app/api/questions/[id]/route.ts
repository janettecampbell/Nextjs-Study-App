import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Question from "@/models/Question";

// Connect to the database
const connectToDatabase = async () => {
  await dbConnect();
};

// Handle POST request
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

// Handle GET request
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  await connectToDatabase();

  try {
    const question = await Question.findById(id);
    if (!question)
      return NextResponse.json(
        { message: "Question not found." },
        { status: 404 }
      );
    return NextResponse.json(question);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}

// Handle PUT request
export async function PUT(
  req: Request,
  { params }: { params: { _id: string } }
) {
  const { _id } = params;

  await connectToDatabase();

  try {
    const payload = await req.json();
    const { _id, question, answer, difficulty, summary } = payload;

    console.log("Parsed payload:", {
      _id:
      question,
      answer,
      difficulty,
      summary
    });

    

    // Find the existing question
    const existingQuestion = await Question.findById(_id);
    if (!existingQuestion) {
      return NextResponse.json(
        { message: "Question not found" },
        { status: 404 }
      );
    }

    // Update other fields if provided
    if (question) existingQuestion.question = question;
    if (answer) existingQuestion.answer = answer;
    if (difficulty) existingQuestion.difficulty = difficulty;
    if (summary) existingQuestion.summary = summary;

    // Save the updated question document
    const updatedQuestion = await existingQuestion.save();

    return NextResponse.json(updatedQuestion);
  } catch (error: any) {
    console.error("Error updating question:", error.message);
    return NextResponse.json(
      { message: "Error updating question", error: error.message },
      { status: 500 }
    );
  }
}

// Handle DELETE request
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  await connectToDatabase();

  try {
    const deletedQuestion = await Question.findByIdAndDelete(id);
    if (!deletedQuestion)
      return NextResponse.json(
        { message: "Question not found." },
        { status: 404 }
      );
    return NextResponse.json({ message: "Question deleted." }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
