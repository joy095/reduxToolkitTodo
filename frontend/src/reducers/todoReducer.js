import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetch2, fetch3 } from "../helpers/fetch2";

const initialState = [];

export const createTodo = createAsyncThunk("createtodo", async (body) => {
  const result = await fetch2("/createtodo", body);
  return result;
});

export const fetchTodo = createAsyncThunk("fetchtodo", async () => {
  const result = await fetch3("/gettodos", "GET");
  return result;
});

export const deletTodo = createAsyncThunk("deletetodo", async (id) => {
  const result = await fetch3(`/remove/${id}`, "DELETE");
  return result;
});

const todoReducer = createSlice({
  name: "todo",
  initialState,
  reducers: {},
  extraReducers: {
    [createTodo.fulfilled]: (state, { payload: { message } }) => {
      if (message) state.push(message);
    },
    [createTodo.pending]: (state, action) => {},
    [fetchTodo.fulfilled]: (state, { payload: { message } }) => {
      return message;
    },
    [deletTodo.fulfilled]: (state, { payload: { message } }) => {
      const removeTodo = state.filter((item) => {
        return item._id !== message._id;
      });
      return removeTodo;
    },
  },
});

export default todoReducer.reducer;
