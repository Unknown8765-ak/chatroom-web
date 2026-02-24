import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rooms: [],          
  activeRoom: null, 
  loading: false,
  error: null
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setRooms: (state, action) => {
      state.rooms = action.payload;
    },

    createRoom: (state, action) => {
      state.rooms.push(action.payload);
    },

    setActiveRoom: (state, action) => {
      state.activeRoom = action.payload;
    },

    leaveRoom: (state) => {
      state.activeRoom = null;
    },

    deleteRoom: (state, action) => {
      state.rooms = state.rooms.filter(
        room => room._id !== action.payload
      );
    },

    setRoomLoading: (state, action) => {
      state.loading = action.payload;
    },

    setRoomError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const {
  setRooms,
  createRoom,
  setActiveRoom,
  leaveRoom,
  deleteRoom,
  setRoomLoading,
  setRoomError
} = roomSlice.actions;

export default roomSlice.reducer;
