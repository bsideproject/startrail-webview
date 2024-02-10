/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider} from 'mobx-react';
import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import Agreement from './components/Agreement';
import Login from './components/Login';
import MyWebView from './components/MyWebView';
import RegisterNickname from './components/RegisterNickname';
import Term from './components/Term';
import UserStore from './stores/UserStore';

const Stack = createStackNavigator();

const App = () => {
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle={'light-content'} />
      <Provider UserStore={UserStore}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Agreement"
              component={Agreement}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Term"
              component={Term}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="RegisterNickname"
              component={RegisterNickname}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="WebView"
              component={MyWebView}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    color: '#000',
  },
});

export default App;
