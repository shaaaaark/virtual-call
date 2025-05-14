/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// 注册react-native-vector-icons
import 'react-native-vector-icons';

AppRegistry.registerComponent(appName, () => App);
