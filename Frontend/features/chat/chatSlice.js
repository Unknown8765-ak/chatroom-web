import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  activeRoomId: null,
  isConnected: false,
  loading: false,
  error: null
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatRoom: (state, action) => {
      state.activeRoomId = action.payload;
      state.messages = [];
      state.loading = true;
      state.error = null;
    },

    clearActiveRoom: (state) => {
      state.activeRoomId = null;
      state.messages = [];
      state.isConnected = false;
    },

    setMessages: (state, action) => {
      state.messages = action.payload;
      state.loading = false;
      state.error = null;
    },

    addMessage: (state, action) => {
        state.messages.push(action.payload);
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    setSocketStatus: (state, action) => {
      state.isConnected = action.payload;
    }
  }
});

export const {
  setChatRoom,
  clearActiveRoom,
  setMessages,
  addMessage,
  setLoading,
  setError,
  setSocketStatus
} = chatSlice.actions;

export default chatSlice.reducer;
