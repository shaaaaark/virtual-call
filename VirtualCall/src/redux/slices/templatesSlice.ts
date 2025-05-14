import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CallTemplate } from '../../types';

interface TemplatesState {
  templates: CallTemplate[];
}

// 默认内置模板
const defaultTemplates: CallTemplate[] = [
  {
    id: 'ios',
    name: 'iPhone风格',
    style: 'ios',
    previewImage: 'ios_preview.png',
  },
  {
    id: 'android',
    name: 'Android风格',
    style: 'android',
    previewImage: 'android_preview.png',
  },
  {
    id: 'huawei',
    name: '华为风格',
    style: 'huawei',
    previewImage: 'huawei_preview.png',
  },
  {
    id: 'samsung',
    name: '三星风格',
    style: 'samsung',
    previewImage: 'samsung_preview.png',
  },
];

const initialState: TemplatesState = {
  templates: defaultTemplates,
};

export const templatesSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    addTemplate: (state, action: PayloadAction<CallTemplate>) => {
      state.templates.push(action.payload);
    },
    updateTemplate: (state, action: PayloadAction<CallTemplate>) => {
      const index = state.templates.findIndex(template => template.id === action.payload.id);
      if (index !== -1) {
        state.templates[index] = action.payload;
      }
    },
    removeTemplate: (state, action: PayloadAction<string>) => {
      // 只允许删除自定义模板，不能删除内置模板
      const template = state.templates.find(t => t.id === action.payload);
      if (template && template.style === 'custom') {
        state.templates = state.templates.filter(t => t.id !== action.payload);
      }
    },
    resetTemplates: (state) => {
      // 保留内置模板，删除所有自定义模板
      state.templates = state.templates.filter(t => t.style !== 'custom');
    },
  },
});

export const {
  addTemplate,
  updateTemplate,
  removeTemplate,
  resetTemplates,
} = templatesSlice.actions;

export default templatesSlice.reducer;
