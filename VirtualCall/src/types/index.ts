// 导航类型
export type RootStackParamList = {
  Home: undefined;
  CustomCall: undefined;
  Schedule: undefined;
  Settings: undefined;
  CallScreen: { callInfo: CallInfo };
  Onboarding: undefined;
};

// 来电信息类型
export interface CallInfo {
  id: string;
  callerName: string;
  phoneNumber: string;
  avatar?: string;
  templateId: string;
}

// 定时任务类型
export interface ScheduledTask {
  id: string;
  name: string;
  scheduledTime: Date;
  callerName: string;
  phoneNumber: string;
  avatar?: string;
  templateId: string;
  isActive: boolean;
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
}

// 重复模式类型
export interface RecurringPattern {
  type: 'daily' | 'weekly' | 'monthly';
  days?: number[]; // 周几（0-6，0是周日）
  date?: number; // 每月几号
}

// 来电模板类型
export interface CallTemplate {
  id: string;
  name: string;
  style: 'ios' | 'android' | 'huawei' | 'samsung' | 'custom';
  previewImage: string;
}

// 应用设置类型
export interface AppSettings {
  selectedTemplate: string;
  defaultCallDuration: number; // 默认来电持续时间（秒）
  vibrationEnabled: boolean;
  tutorialCompleted: boolean;
  soundEnabled: boolean;
  selectedRingtone: string;
}
