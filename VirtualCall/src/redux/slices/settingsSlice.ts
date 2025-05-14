import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppSettings } from '../../types';

const initialState: AppSettings = {
  selectedTemplate: 'ios', // 默认使用iOS风格
  defaultCallDuration: 30, // 默认30秒
  vibrationEnabled: true,
  tutorialCompleted: false,
  soundEnabled: true,
  selectedRingtone: 'default',
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSelectedTemplate: (state, action: PayloadAction<string>) => {
      state.selectedTemplate = action.payload;
    },
    setDefaultCallDuration: (state, action: PayloadAction<number>) => {
      state.defaultCallDuration = action.payload;
    },
    setVibrationEnabled: (state, action: PayloadAction<boolean>) => {
      state.vibrationEnabled = action.payload;
    },
    setTutorialCompleted: (state, action: PayloadAction<boolean>) => {
      state.tutorialCompleted = action.payload;
    },
    setSoundEnabled: (state, action: PayloadAction<boolean>) => {
      state.soundEnabled = action.payload;
    },
    setSelectedRingtone: (state, action: PayloadAction<string>) => {
      state.selectedRingtone = action.payload;
    },
    resetSettings: () => initialState,
  },
});

export const {
  setSelectedTemplate,
  setDefaultCallDuration,
  setVibrationEnabled,
  setTutorialCompleted,
  setSoundEnabled,
  setSelectedRingtone,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
