# 模拟来电APP技术上下文

## 技术栈概览

模拟来电APP采用React Native作为主要开发框架，实现跨平台应用开发，完整技术栈如下：

### 基础框架
- **React Native**: 0.70+ 版本
- **TypeScript**: 强类型支持，提升代码质量和开发效率
- **React**: 17+ 版本

### 状态管理
- **Redux Toolkit**: 官方推荐的Redux工具集，简化Redux使用
- **redux-persist**: 状态持久化解决方案
- **react-redux**: Redux与React绑定库

### 路由导航
- **React Navigation 6**: 提供多种导航模式(栈导航、标签导航等)
- **@react-navigation/native**: 核心导航库
- **@react-navigation/stack**: 栈导航组件
- **@react-navigation/bottom-tabs**: 底部标签导航组件

### UI组件库
- **React Native Paper**: 遵循Material Design的UI组件库
- **react-native-vector-icons**: 图标库
- **react-native-gesture-handler**: 手势处理库
- **react-native-reanimated**: 动画库

### 数据存储
- **AsyncStorage**: 简单键值对存储方案
- **Realm**: 复杂数据结构的本地数据库(可选)

### 原生功能集成
- **react-native-sound**: 音频处理库，用于铃声播放
- **react-native-push-notification**: 本地通知管理
- **react-native-background-fetch**: 后台任务处理
- **react-native-permissions**: 权限管理
- **react-native-image-picker**: 图片选择功能

### 开发工具
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化工具
- **Jest**: 单元测试框架
- **React Native Testing Library**: UI测试工具
- **Detox**: 端到端测试框架(可选)

## 开发环境配置

### 必要开发环境
1. **Node.js**: 14.x或更高版本
2. **npm/yarn/pnpm**: 包管理工具
3. **React Native CLI**: React Native命令行工具
4. **Android Studio**: Android开发环境
5. **Xcode**: iOS开发环境(仅Mac)
6. **VSCode**: 推荐的代码编辑器，配合React Native扩展

### 开发环境设置指南
```bash
# 安装Node.js和npm (根据操作系统选择合适方式)

# 安装React Native CLI
npm install -g react-native-cli

# 安装项目依赖
cd virtual-call
npm install

# 启动Metro服务器
npm start

# 启动Android应用
npm run android

# 启动iOS应用(仅Mac)
npm run ios
```

## 项目结构

```
/virtual-call
├── /android             # Android原生代码
├── /ios                 # iOS原生代码
├── /src                 # 应用源代码
│   ├── /api             # API服务
│   ├── /assets          # 静态资源
│   │   ├── /ringtones   # 铃声资源
│   │   ├── /images      # 图片资源
│   │   └── /templates   # 界面模板资源
│   ├── /components      # 通用组件
│   │   ├── /common      # 公共组件
│   │   ├── /call        # 来电相关组件
│   │   └── /schedule    # 定时任务相关组件
│   ├── /hooks           # 自定义Hooks
│   ├── /navigation      # 导航配置
│   ├── /redux           # Redux状态管理
│   │   ├── /slices      # Redux切片
│   │   └── store.ts     # Redux存储配置
│   ├── /screens         # 页面组件
│   │   ├── /home        # 首页相关
│   │   ├── /custom      # 自定义来电相关
│   │   ├── /schedule    # 定时任务相关
│   │   └── /settings    # 设置相关
│   ├── /services        # 服务类
│   │   ├── /storage     # 存储服务
│   │   ├── /notification # 通知服务
│   │   └── /audio       # 音频服务
│   ├── /types           # 类型定义
│   └── /utils           # 工具函数
├── .eslintrc.js         # ESLint配置
├── .prettierrc          # Prettier配置
├── tsconfig.json        # TypeScript配置
├── package.json         # 项目依赖
└── README.md            # 项目说明
```

## 关键技术实现

### 1. 铃声和震动
```typescript
// AudioService.ts
import Sound from 'react-native-sound';
import { Vibration } from 'react-native';

export type VibrationPattern = number[];

export class AudioService {
  private static sound: Sound | null = null;
  
  static preloadRingtones() {
    // 预加载常用铃声
  }
  
  static async playRingtone(ringtoneId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // 加载并播放铃声
      const ringtone = new Sound(
        `ringtones/${ringtoneId}.mp3`, 
        Sound.MAIN_BUNDLE,
        (error) => {
          if (error) {
            reject(error);
            return;
          }
          
          ringtone.setNumberOfLoops(-1); // 循环播放
          ringtone.play((success) => {
            if (!success) {
              reject(new Error('Playback failed'));
            }
          });
          
          this.sound = ringtone;
          resolve();
        }
      );
    });
  }
  
  static stopRingtone(): void {
    if (this.sound) {
      this.sound.stop();
      this.sound.release();
      this.sound = null;
    }
  }
  
  static startVibration(pattern: VibrationPattern): void {
    Vibration.cancel(); // 取消当前震动
    Vibration.vibrate(pattern, true); // 循环震动
  }
  
  static stopVibration(): void {
    Vibration.cancel();
  }
}
```

### 2. 本地通知
```typescript
// NotificationService.ts
import PushNotification from 'react-native-push-notification';
import { ScheduledTask } from '../types/task';

export class NotificationService {
  static initialize() {
    PushNotification.configure({
      onNotification: function(notification) {
        console.log('NOTIFICATION:', notification);
        // 处理通知
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
    
    // 创建通知渠道
    PushNotification.createChannel(
      {
        channelId: 'virtual-call-channel',
        channelName: '模拟来电通知',
        channelDescription: '模拟来电应用的通知渠道',
        playSound: true,
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`Channel created: ${created}`)
    );
  }
  
  static scheduleTaskNotification(task: ScheduledTask) {
    // 设置提前5分钟的提醒通知
    const reminderTime = new Date(task.scheduledTime);
    reminderTime.setMinutes(reminderTime.getMinutes() - 5);
    
    // 创建提醒通知
    PushNotification.localNotificationSchedule({
      channelId: 'virtual-call-channel',
      title: '即将模拟来电',
      message: `任务"${task.name}"将在5分钟后触发`,
      date: reminderTime,
      allowWhileIdle: true,
      playSound: true,
      soundName: 'default',
    });
    
    // 创建实际来电通知
    PushNotification.localNotificationSchedule({
      channelId: 'virtual-call-channel',
      title: '模拟来电',
      message: `任务"${task.name}"`,
      date: task.scheduledTime,
      allowWhileIdle: true,
      playSound: false,
      data: {
        type: 'scheduled_call',
        taskId: task.id,
        templateId: task.templateId,
      },
    });
  }
  
  static cancelTaskNotifications(taskId: string) {
    // 查找并取消与任务相关的通知
    PushNotification.getScheduledLocalNotifications((notifications) => {
      notifications.forEach((notification) => {
        if (notification.data?.taskId === taskId) {
          PushNotification.cancelLocalNotification(notification.id);
        }
      });
    });
  }
}
```

### 3. 界面模板实现
```typescript
// CallScreenTemplate.tsx
import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { CallInfo } from '../types/call';

export interface CallScreenProps {
  callInfo: CallInfo;
  onAnswer: () => void;
  onDecline: () => void;
}

// iPhone风格来电界面
export const IPhoneCallScreen: React.FC<CallScreenProps> = ({
  callInfo,
  onAnswer,
  onDecline,
}) => {
  return (
    <View style={styles.iPhoneContainer}>
      <View style={styles.callerInfoContainer}>
        <Image 
          source={{ uri: callInfo.avatar }} 
          style={styles.avatar} 
        />
        <Text style={styles.callerName}>{callInfo.callerName}</Text>
        <Text style={styles.phoneNumber}>{callInfo.phoneNumber}</Text>
        <Text style={styles.callStatus}>来电...</Text>
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.declineButton]}
          onPress={onDecline}
        >
          <Text style={styles.actionText}>拒绝</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.answerButton]}
          onPress={onAnswer}
        >
          <Text style={styles.actionText}>接听</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// 华为风格来电界面
export const HuaweiCallScreen: React.FC<CallScreenProps> = ({
  callInfo,
  onAnswer,
  onDecline,
}) => {
  // 华为风格界面实现
  return (/* JSX实现 */);
};

const styles = StyleSheet.create({
  iPhoneContainer: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    justifyContent: 'space-between',
  },
  callerInfoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  callerName: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  phoneNumber: {
    color: '#eeeeee',
    fontSize: 18,
    marginBottom: 10,
  },
  callStatus: {
    color: '#cccccc',
    fontSize: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  declineButton: {
    backgroundColor: '#FF3B30',
  },
  answerButton: {
    backgroundColor: '#4CD964',
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
  },
});
```

## 构建与部署流程

### Android构建
```bash
# 开发版本
npm run android

# 生成APK
cd android && ./gradlew assembleRelease

# 生成AAB (Google Play)
cd android && ./gradlew bundleRelease
```

### iOS构建 (仅Mac)
```bash
# 开发版本
npm run ios

# 生成Archive
# 1. 通过Xcode打开ios/VirtualCall.xcworkspace
# 2. 选择Product > Archive
# 3. 在Organizer中选择分发方式
```

### CI/CD集成 (建议)
- **GitHub Actions**: 自动化测试和构建
- **Fastlane**: 自动化发布流程
- **CodePush**: 热更新支持(可选)

## 版本控制与分支策略

### 版本控制
- **GitHub/GitLab**: 源代码管理
- **语义化版本**: 遵循Major.Minor.Patch格式
  - Major: 不兼容的API变更
  - Minor: 向后兼容的功能新增
  - Patch: 向后兼容的问题修复

### 分支策略
- **main**: 主分支，保持稳定可发布状态
- **develop**: 开发分支，集成最新功能
- **feature/xxx**: 功能分支，用于开发新功能
- **bugfix/xxx**: 问题修复分支
- **release/x.y.z**: 发布准备分支

## 测试策略

### 单元测试
使用Jest针对业务逻辑和服务类编写单元测试。

### 组件测试
使用React Native Testing Library测试UI组件。

### 端到端测试
使用Detox进行真机/模拟器上的端到端测试。

## 性能考量

### 关键性能指标
- 应用启动时间 < 3秒
- 模拟来电响应时间 < 1秒
- 60 FPS的UI渲染
- 内存占用 < 150MB

### 优化策略
1. 资源预加载(铃声、界面模板等)
2. 懒加载非关键资源
3. 组件记忆化避免不必要渲染
4. 使用生产模式构建发布版本
5. 图片资源优化(尺寸、格式) 