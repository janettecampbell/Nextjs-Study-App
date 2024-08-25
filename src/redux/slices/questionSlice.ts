import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Question {
  _id: string;
  question: string;
  answer: string;
  difficulty: "beginner" | "intermediate" | "expert";
  summary?: string;
  notes?: string;
}

interface QuestionsState {
  items: Question[];
  status: "idle" | "loading" | "succeeded" | "failed";
  loading: boolean;
  error: string | null;
}

const initialState: QuestionsState = {
  items: [],
  status: "idle",
  loading: false,
  error: null,
};

// Async thunk to fetch questions based on difficulty
export const fetchQuestions = createAsyncThunk(
  "questions/fetchQuestions",
  async (difficulty: string) => {
    const response = await axios.get(`/api/questions?difficulty=${difficulty}`);
    return response.data;
  }
);

// Async thunk to add a new question
export const addQuestion = createAsyncThunk<Question, Omit<Question, "_id">>(
  'questions/addQuestion',
  async (newQuestion) => {
    const response = await axios.post('/api/questions', newQuestion);
    return response.data; // Ensure your API returns the newly added question
  }
);

const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    updateQuestion: (state, action) => {
      const index = state.items.findIndex((q) => q._id === action.payload._id);
      state.items[index] = action.payload;
    },
    deleteQuestion: (state, action) => {
      state.items = state.items.filter((q) => q._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Add fetched questions to the state
        state.items = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch questions";
      })
      .addCase(addQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload); // Add the new question to the state
      })
      .addCase(addQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add question';
      });
  },
});

export const { updateQuestion, deleteQuestion } = questionsSlice.actions;

export default questionsSlice.reducer;
