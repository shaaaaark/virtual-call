import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { RootStackParamList } from '../types';

// 导入图标
import Ionicons from 'react-native-vector-icons/Ionicons';

// 导入屏幕组件（这些组件将在后续步骤中创建）
// 导入屏幕的占位符，实际组件将在后续创建
const HomeScreen = () => null;
const CustomCallScreen = () => null;
const ScheduleScreen = () => null;
const SettingsScreen = () => null;
const CallScreen = () => null;
const OnboardingScreen = () => null;

// 创建导航器
const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<Omit<RootStackParamList, 'CallScreen' | 'Onboarding'>>();

// 主标签导航
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'CustomCall') {
            iconName = focused ? 'call' : 'call-outline';
          } else if (route.name === 'Schedule') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '首页',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="CustomCall"
        component={CustomCallScreen}
        options={{
          title: '自定义',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          title: '定时任务',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: '设置',
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

// 根导航
const AppNavigator = () => {
  // 检查用户是否完成引导教程
  const tutorialCompleted = useSelector((state: RootState) => state.settings.tutorialCompleted);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!tutorialCompleted ? (
          // 如果未完成引导，显示引导屏幕
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          // 否则显示主应用
          <>
            <Stack.Screen name="Home" component={TabNavigator} />
            <Stack.Screen
              name="CallScreen"
              component={CallScreen}
              options={{
                headerShown: false,
                // 禁用手势返回，来电界面需要通过按钮交互
                gestureEnabled: false,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
