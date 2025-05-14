import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setupListeners } from '@reduxjs/toolkit/query';

// 导入切片reducers
import settingsReducer from './slices/settingsSlice';
import tasksReducer from './slices/tasksSlice';
import templatesReducer from './slices/templatesSlice';

// 配置持久化选项
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['settings', 'tasks', 'templates'], // 只持久化这些切片
};

// 合并所有reducers
const rootReducer = combineReducers({
  settings: settingsReducer,
  tasks: tasksReducer,
  templates: templatesReducer,
});

// 创建持久化reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 创建store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 忽略redux-persist相关的actions
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
        // 忽略Date等非可序列化的值
        ignoredPaths: ['tasks.tasks.scheduledTime'],
      },
    }),
});

// 创建persistor
export const persistor = persistStore(store);

// 配置listener
setupListeners(store.dispatch);

// 类型定义
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
