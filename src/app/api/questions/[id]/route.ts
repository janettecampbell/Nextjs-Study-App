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
  { params }: { params: { id: string } }
) {
  const { id } = params;

  await connectToDatabase();

  try {
    const { question, answer, difficulty, summary, userId, note } =
      await req.json();

    // Update the question document
    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      {
        question,
        answer,
        difficulty,
        summary,
        notes: { userId, note },
      },
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ message: "Error updating question", error });
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
