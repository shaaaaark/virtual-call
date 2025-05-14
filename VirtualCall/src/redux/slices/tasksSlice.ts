import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ScheduledTask } from '../../types';

interface TasksState {
  tasks: ScheduledTask[];
}

const initialState: TasksState = {
  tasks: [],
};

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<ScheduledTask>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<ScheduledTask>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    toggleTaskActive: (state, action: PayloadAction<string>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload);
      if (index !== -1) {
        state.tasks[index].isActive = !state.tasks[index].isActive;
      }
    },
    clearAllTasks: (state) => {
      state.tasks = [];
    },
  },
});

export const {
  addTask,
  updateTask,
  removeTask,
  toggleTaskActive,
  clearAllTasks,
} = tasksSlice.actions;

export default tasksSlice.reducer;
