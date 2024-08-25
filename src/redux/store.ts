import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import userReducer from './slices/userSlice';
import questionReducer from './slices/questionSlice';
import authReducer from './slices/authSlice';

// Create the Redux store
const store = configureStore({
  reducer: {
    user: userReducer,
    question: questionReducer,
    auth: authReducer,
  },
});

// Define the RootState type based on your reducers
export type RootState = ReturnType<typeof store.getState>;

// Define AppDispatch type based on the store
export type AppDispatch = typeof store.dispatch;

// Create typed versions of useDispatch and useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector;

// Export the store
export default store;
