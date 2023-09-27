import { AppRegistry } from 'react-native';

import './assets/locales/i18n';
import 'intl';
import 'intl/locale-data/jsonp/ar';
import 'intl/locale-data/jsonp/en';
import 'intl/locale-data/jsonp/fr';
import 'intl/locale-data/jsonp/hi';
import 'intl/locale-data/jsonp/id';
import 'intl/locale-data/jsonp/ms';
import 'intl/locale-data/jsonp/sq';
import 'intl/locale-data/jsonp/tr';
import 'intl/locale-data/jsonp/ur';
import 'intl/locale-data/jsonp/zh';

import 'intl-pluralrules';

import { name } from './app.json';
import { MainApp } from './src/navigation/AppNavigator';

AppRegistry.registerComponent(name, () => MainApp);