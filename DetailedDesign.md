# 模拟来电APP详细设计文档

## 故事1：引导教程

### 需求描述
作为用户，我希望首次打开APP时能看到简洁的引导教程，以便快速熟悉基本操作，完成快速上手。

### 详细设计
1. **页面组件**：
   - `WelcomeScreen`：欢迎页面，显示应用标志和简介
   - `TutorialScreen`：教程页面，包含多个轮播滑块
   - `PermissionScreen`：权限请求页面

2. **数据结构**：
```typescript
interface TutorialSlide {
  id: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
}

interface Permission {
  type: 'notification' | 'audio' | 'vibration';
  title: string;
  description: string;
  required: boolean;
}
```

3. **状态管理**：
```typescript
const tutorialSlice = createSlice({
  name: 'tutorial',
  initialState: {
    hasSeenTutorial: false,
    currentSlideIndex: 0,
    grantedPermissions: [] as string[]
  },
  reducers: {
    // 相关reducer方法
  }
});
```

## 故事2：一键来电

### 需求描述
作为用户，我希望能在首页一键点击，按照默认设置快速启动模拟来电，满足紧急救急需求。

### 详细设计
1. **页面组件**：
   - `HomeScreen`：首页，包含一键来电大按钮
   - `CallSimulatorScreen`：来电模拟界面

2. **数据结构**：
```typescript
interface DefaultCallSettings {
  callerName: string;
  avatar: string;
  phoneNumber: string;
  ringtoneId: string;
  vibrationPattern: VibrationPattern;
  callScreenTemplate: PhoneTemplateType;
}
```

3. **业务逻辑**：
```typescript
// 一键来电Hook
function useQuickCall() {
  const dispatch = useDispatch();
  const defaultSettings = useSelector(state => state.settings.defaultCall);
  
  const triggerQuickCall = useCallback(() => {
    // 1. 更新当前来电状态
    dispatch(setCallActive(true));
    dispatch(setCurrentCallInfo(defaultSettings));
    
    // 2. 触发铃声和震动
    AudioService.playRingtone(defaultSettings.ringtoneId);
    VibrationService.startVibration(defaultSettings.vibrationPattern);
    
    // 3. 导航到来电界面
    navigation.navigate('CallSimulator');
  }, [defaultSettings, dispatch, navigation]);
  
  return { triggerQuickCall };
}
```

## 故事3：默认设置管理

### 需求描述
作为用户，我希望可以在设置页面修改一键来电的默认设置，包括来电者昵称、头像、电话号码等信息。

### 详细设计
1. **页面组件**：
   - `DefaultCallSettingsScreen`：默认来电设置页面
   - 子组件：`CallerInfoForm`、`RingtoneSelector`、`VibrationPatternSelector`、`PhoneTemplateSelector`

2. **路由参数**：
```typescript
type DefaultCallSettingsScreenParams = {
  onSave?: (settings: DefaultCallSettings) => void;
};
```

3. **表单验证**：
```typescript
const validateCallerInfo = (info: CallerInfo): ValidationResult => {
  const errors: Record<string, string> = {};
  
  if (!info.callerName.trim()) {
    errors.callerName = '来电者姓名不能为空';
  } else if (info.callerName.length > 20) {
    errors.callerName = '来电者姓名不能超过20个字符';
  }
  
  // 电话号码验证
  if (!info.phoneNumber.trim()) {
    errors.phoneNumber = '电话号码不能为空';
  } else if (!/^[0-9+\-\s]{5,20}$/.test(info.phoneNumber)) {
    errors.phoneNumber = '请输入有效的电话号码';
  }
  
  return { isValid: Object.keys(errors).length === 0, errors };
};
```

## 故事4：自定义来电设置

### 需求描述
作为用户，我希望进入自定义来电页面后，能对来电者信息、铃声震动等各项参数进行详细设置。

### 详细设计
1. **页面组件**：
   - `CustomCallScreen`：自定义来电页面
   - 子组件：与默认设置页面共享的表单组件
   - `DelayTimePicker`：延迟时间选择器

2. **数据结构**：
```typescript
interface CustomCallTemplate extends DefaultCallSettings {
  id: string;
  name: string; // 模板名称
  delaySeconds: number; // 延迟时间
}
```

3. **服务类**：
```typescript
class CustomCallService {
  static async saveTemplate(template: CustomCallTemplate): Promise<string> {
    // 验证模板数据
    // 保存到本地存储
    // 返回模板ID
  }
  
  static async getTemplates(): Promise<CustomCallTemplate[]> {
    // 从本地存储获取保存的模板
  }
  
  static triggerCustomCall(template: CustomCallTemplate): void {
    // 设置延迟
    setTimeout(() => {
      // 触发来电逻辑
    }, template.delaySeconds * 1000);
  }
}
```

## 故事5：自定义方案管理

### 需求描述
作为用户，我希望可以保存多个自定义来电设置方案，并为方案命名，方便下次调用。

### 详细设计
1. **页面组件**：
   - `TemplateListScreen`：模板列表页面
   - `TemplateDetailScreen`：模板详情页面

2. **数据流**：
```typescript
const customCallSlice = createSlice({
  name: 'customCalls',
  initialState: {
    templates: [] as CustomCallTemplate[],
    currentTemplateId: null as string | null,
  },
  reducers: {
    addTemplate: (state, action: PayloadAction<CustomCallTemplate>) => {
      state.templates.push(action.payload);
    },
    updateTemplate: (state, action: PayloadAction<CustomCallTemplate>) => {
      const index = state.templates.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.templates[index] = action.payload;
      }
    },
    deleteTemplate: (state, action: PayloadAction<string>) => {
      state.templates = state.templates.filter(t => t.id !== action.payload);
    },
    setCurrentTemplate: (state, action: PayloadAction<string | null>) => {
      state.currentTemplateId = action.payload;
    }
  }
});
```

## 故事6：逼真界面模板

### 需求描述
作为用户，我希望在APP中能选择多款手机品牌机型的来电界面模板，使模拟来电更逼真。

### 详细设计
1. **数据结构**：
```typescript
type PhoneTemplateType = 'iphone' | 'huawei' | 'xiaomi' | 'oppo' | 'vivo' | 'samsung';

interface PhoneTemplate {
  id: PhoneTemplateType;
  name: string;
  thumbnail: ImageSourcePropType;
  component: React.ComponentType<CallScreenProps>;
}
```

2. **组件设计**：
```typescript
// 各品牌来电界面组件
const IPhoneCallScreen: React.FC<CallScreenProps> = (props) => {
  // 渲染iPhone风格来电界面
};

const HuaweiCallScreen: React.FC<CallScreenProps> = (props) => {
  // 渲染华为风格来电界面
};

// 其他品牌组件...
```

3. **模板注册**：
```typescript
const phoneTemplates: Record<PhoneTemplateType, PhoneTemplate> = {
  iphone: {
    id: 'iphone',
    name: 'iPhone',
    thumbnail: require('../assets/images/templates/iphone_thumb.png'),
    component: IPhoneCallScreen
  },
  huawei: {
    id: 'huawei',
    name: '华为',
    thumbnail: require('../assets/images/templates/huawei_thumb.png'),
    component: HuaweiCallScreen
  },
  // 其他品牌模板...
};
```

## 故事7：界面切换功能

### 需求描述
作为用户，我希望在来电界面能通过左右滑动屏幕切换不同的来电通话界面模板。

### 详细设计
1. **页面组件**：
   - `CallSimulatorScreen`：整合Swiper组件实现左右滑动

2. **业务逻辑**：
```typescript
const CallSimulatorScreen: React.FC = () => {
  const { currentCallInfo } = useSelector(state => state.callUI);
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);
  const templateKeys = Object.keys(phoneTemplates) as PhoneTemplateType[];
  
  const handleIndexChange = (index: number) => {
    setCurrentTemplateIndex(index);
    // 更新当前模板状态
    dispatch(setCurrentTemplate(templateKeys[index]));
  };
  
  return (
    <View style={styles.container}>
      <Swiper
        index={currentTemplateIndex}
        onIndexChanged={handleIndexChange}
        loop={true}
        showsPagination={false}
      >
        {templateKeys.map(key => {
          const Template = phoneTemplates[key].component;
          return (
            <Template
              key={key}
              callInfo={currentCallInfo}
              onAnswer={handleAnswer}
              onDecline={handleDecline}
            />
          );
        })}
      </Swiper>
    </View>
  );
};
```

## 故事8：定时任务创建

### 需求描述
作为用户，我希望进入定时任务页面后，能新建定时来电任务，设置来电时间、重复周期等参数。

### 详细设计
1. **页面组件**：
   - `TaskListScreen`：任务列表页面
   - `TaskEditScreen`：任务编辑页面

2. **数据结构**：
```typescript
type RepeatType = 'once' | 'daily' | 'weekly' | 'monthly';

interface ScheduledTask {
  id: string;
  name: string;
  templateId: string; // 关联的来电模板ID
  scheduledTime: Date; // 预定时间
  repeatType: RepeatType; // 重复类型
  repeatDays?: number[]; // 如果是weekly，存储星期几 (0-6)
  repeatDate?: number; // 如果是monthly，存储日期 (1-31)
  isEnabled: boolean; // 是否启用
}
```

3. **服务类**：
```typescript
class ScheduleService {
  static async createTask(task: ScheduledTask): Promise<string> {
    // 验证任务数据
    // 保存到本地存储
    // 注册本地通知
    // 返回任务ID
  }
  
  static async updateTask(task: ScheduledTask): Promise<void> {
    // 更新任务
    // 更新通知
  }
  
  static async deleteTask(taskId: string): Promise<void> {
    // 删除任务
    // 取消通知
  }
  
  static async toggleTaskStatus(taskId: string, isEnabled: boolean): Promise<void> {
    // 切换任务状态
    // 启用/禁用通知
  }
}
```

## 故事9：定时任务管理

### 需求描述
作为用户，我希望在定时任务页面能对已创建的任务进行编辑、删除、暂停/启动操作。

### 详细设计
1. **页面组件**：
   - `TaskListItem`：任务列表项组件，包含快捷操作

2. **状态管理**：
```typescript
const scheduledTasksSlice = createSlice({
  name: 'scheduledTasks',
  initialState: {
    tasks: [] as ScheduledTask[],
  },
  reducers: {
    addTask: (state, action: PayloadAction<ScheduledTask>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<ScheduledTask>) => {
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
    },
    toggleTaskStatus: (state, action: PayloadAction<{id: string, isEnabled: boolean}>) => {
      const { id, isEnabled } = action.payload;
      const index = state.tasks.findIndex(t => t.id === id);
      if (index !== -1) {
        state.tasks[index].isEnabled = isEnabled;
      }
    }
  }
});
```

## 故事10：任务提醒通知

### 需求描述
作为用户，我希望在定时任务即将触发前收到本地通知提醒，避免错过任务。

### 详细设计
1. **通知服务**：
```typescript
class NotificationService {
  static async requestPermissions(): Promise<boolean> {
    // 请求通知权限
  }
  
  static async scheduleTaskNotification(task: ScheduledTask): Promise<string> {
    // 注册任务通知
    const notificationTime = new Date(task.scheduledTime.getTime() - 5 * 60 * 1000); // 5分钟前
    
    return PushNotification.localNotificationSchedule({
      id: task.id,
      title: '即将模拟来电',
      message: `任务"${task.name}"将在5分钟后触发`,
      date: notificationTime,
      playSound: true,
      soundName: 'default',
      // 其他配置
    });
  }
  
  static async scheduleActualCall(task: ScheduledTask): Promise<string> {
    // 注册实际来电通知
    return PushNotification.localNotificationSchedule({
      id: `${task.id}_call`,
      title: '模拟来电',
      message: `启动任务"${task.name}"`,
      date: task.scheduledTime,
      playSound: false,
      // 其他配置
      data: {
        type: 'scheduled_call',
        taskId: task.id,
        templateId: task.templateId
      }
    });
  }
  
  static async cancelNotification(id: string): Promise<void> {
    // 取消通知
  }
}
```

2. **通知处理**：
```typescript
// 应用启动处理
function setupNotificationHandling() {
  PushNotification.configure({
    onNotification: async function(notification) {
      // 处理通知
      if (notification.data?.type === 'scheduled_call') {
        // 获取任务和模板
        const taskId = notification.data.taskId;
        const templateId = notification.data.templateId;
        
        // 启动模拟来电
        const task = await ScheduleService.getTask(taskId);
        const template = await CustomCallService.getTemplate(templateId);
        
        if (task && template) {
          // 立即触发来电
          CustomCallService.triggerCustomCall(template);
        }
      }
    }
  });
} 