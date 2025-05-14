# 模拟来电APP系统架构与设计模式

## 系统架构

模拟来电APP采用分层架构设计，清晰分离关注点，提高代码可维护性和扩展性：

```
┌─────────────────────────────────────────────────────────┐
│                      应用层                              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │ 引导模块 │  │ 一键来电 │  │自定义来电│  │定时任务来电│     │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘     │
├─────────────────────────────────────────────────────────┤
│                      业务逻辑层                          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │Redux状态│  │Hook逻辑 │  │ API服务 │  │ 工具函数 │     │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘     │
├─────────────────────────────────────────────────────────┤
│                      数据访问层                          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │本地存储 │  │通知服务 │  │设备信息 │  │资源管理 │     │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘     │
├─────────────────────────────────────────────────────────┤
│                      原生功能层                          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │铃声模块 │  │震动模块 │  │通知模块 │  │权限模块 │     │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘     │
└─────────────────────────────────────────────────────────┘
```

### 1. 应用层 (Presentation Layer)
包含用户界面组件和视图逻辑，负责渲染UI和处理用户交互。各功能模块（引导教程、一键来电、自定义来电、定时任务）在此层实现界面交互。

### 2. 业务逻辑层 (Business Logic Layer)
包含应用的核心业务逻辑，使用Redux管理全局状态，自定义Hooks封装逻辑，API服务处理数据请求，工具函数提供通用功能。

### 3. 数据访问层 (Data Access Layer)
负责数据存取和管理，包括本地存储服务、通知队列管理、设备信息访问和资源管理。

### 4. 原生功能层 (Native Features Layer)
通过React Native桥接原生功能，包括铃声播放、震动控制、本地通知和权限管理等需要与设备底层交互的功能。

## 核心设计模式

### 1. 容器/展示组件模式
将组件分为容器组件(处理逻辑)和展示组件(渲染UI)：

```typescript
// 展示组件示例
const CallButton: React.FC<CallButtonProps> = ({ onPress, label, isLoading }) => (
  <TouchableOpacity style={styles.button} onPress={onPress} disabled={isLoading}>
    {isLoading ? <ActivityIndicator /> : <Text>{label}</Text>}
  </TouchableOpacity>
);

// 容器组件示例
const QuickCallContainer: React.FC = () => {
  const { triggerQuickCall, isLoading } = useQuickCall();
  
  return <CallButton 
    onPress={triggerQuickCall} 
    label="一键来电" 
    isLoading={isLoading} 
  />;
};
```

### 2. Hook模式
使用自定义Hook封装和复用业务逻辑：

```typescript
// 一键来电Hook
function useQuickCall() {
  const dispatch = useDispatch();
  const defaultSettings = useSelector(state => state.settings.defaultCall);
  const [isLoading, setIsLoading] = useState(false);
  
  const triggerQuickCall = useCallback(async () => {
    setIsLoading(true);
    try {
      // 触发来电逻辑
      dispatch(setCallActive(true));
      await AudioService.playRingtone(defaultSettings.ringtoneId);
      // ...其他操作
    } catch (error) {
      // 错误处理
    } finally {
      setIsLoading(false);
    }
  }, [defaultSettings, dispatch]);
  
  return { triggerQuickCall, isLoading };
}
```

### 3. 服务模式
封装特定功能域的复杂逻辑到服务类：

```typescript
// 通知服务
class NotificationService {
  static async scheduleNotification(params) {
    // 实现通知调度逻辑
  }
  
  static async cancelNotification(id) {
    // 实现通知取消逻辑
  }
  
  // 其他通知相关方法
}

// 音频服务
class AudioService {
  static async playRingtone(ringtoneId) {
    // 实现铃声播放逻辑
  }
  
  static async stopRingtone() {
    // 实现铃声停止逻辑
  }
  
  // 其他音频相关方法
}
```

### 4. 策略模式
用于处理不同手机品牌的来电界面模板：

```typescript
// 定义通用接口
interface CallScreenProps {
  callInfo: CallInfo;
  onAnswer: () => void;
  onDecline: () => void;
}

// 不同策略的实现
const phoneTemplates: Record<PhoneTemplateType, PhoneTemplate> = {
  iphone: {
    id: 'iphone',
    name: 'iPhone',
    component: IPhoneCallScreen,
    // 其他属性
  },
  huawei: {
    id: 'huawei',
    name: '华为',
    component: HuaweiCallScreen,
    // 其他属性
  },
  // 其他品牌...
};

// 根据策略动态选择实现
const SelectedTemplate = phoneTemplates[selectedTemplateId].component;
return <SelectedTemplate {...props} />;
```

### 5. 观察者模式
使用Redux实现状态变化的观察和响应：

```typescript
// Redux切片示例
const callUISlice = createSlice({
  name: 'callUI',
  initialState: {
    isCallActive: false,
    currentCallInfo: null,
    currentTemplate: 'iphone'
  },
  reducers: {
    setCallActive: (state, action) => {
      state.isCallActive = action.payload;
    },
    setCurrentCallInfo: (state, action) => {
      state.currentCallInfo = action.payload;
    },
    setCurrentTemplate: (state, action) => {
      state.currentTemplate = action.payload;
    }
  }
});

// 组件中订阅状态变化
const CallSimulator: React.FC = () => {
  // 订阅状态
  const { isCallActive, currentCallInfo } = useSelector(state => state.callUI);
  
  // 基于状态变化执行副作用
  useEffect(() => {
    if (isCallActive) {
      // 处理来电激活逻辑
    } else {
      // 处理来电结束逻辑
    }
  }, [isCallActive]);
  
  // 渲染UI
  return (/* 组件JSX */);
};
```

## 数据流设计

### 1. 一键来电数据流
```
用户触发 → Action分发 → Reducer更新状态 → 
调用原生模块(铃声/震动) → 渲染来电界面
```

### 2. 自定义来电数据流
```
用户设置 → 表单验证 → 存储设置 → 
(选择立即启动) → 调用原生模块 → 渲染来电界面
```

### 3. 定时任务数据流
```
用户创建任务 → 存储任务信息 → 注册本地通知 → 
时间到达 → 触发通知 → 启动应用 → 渲染来电界面
```

## 关键技术实现方案

### 1. 来电界面模拟
- 使用React Native Modal实现全屏覆盖
- 自定义UI组件还原各品牌手机来电界面
- 使用React Native Gesture Handler实现左右滑动切换

### 2. 铃声与震动
- react-native-sound处理铃声播放
- Vibration API实现震动模式
- 封装统一音频服务接口

### 3. 定时任务
- react-native-background-fetch处理后台任务
- react-native-push-notification管理本地通知
- redux-persist持久化任务数据

### 4. 性能优化
- 资源预加载策略
- 组件记忆化(React.memo, useMemo, useCallback)
- 列表性能优化(FlatList, VirtualizedList)
- 资源懒加载 