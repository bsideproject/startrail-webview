/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useRef, useState, useEffect } from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    useColorScheme,
} from 'react-native';
import MyWebView from './components/MyWebView';
import Login from './components/Login';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Agreement from './components/Agreement';
import Term from './components/Term';
import RegisterNickname from './components/RegisterNickname';
import { Provider } from 'mobx-react';
import UserStore from './stores/UserStore';

const Stack = createStackNavigator();

const App = () => {

    return (
        <Provider UserStore={UserStore}>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name='Login' component={Login} options={{ headerShown: false }}/>
                    <Stack.Screen name='Agreement' component={Agreement} options={{ headerShown: false }}/>
                    <Stack.Screen name='Term' component={Term} options={{ headerShown: false }}/>
                    <Stack.Screen name='RegisterNickname' component={RegisterNickname} options={{ headerShown: false }}/>
                    <Stack.Screen name='WebView' component={MyWebView} options={{ headerShown: false }}/>
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#1E1E1E",
        color: "#000"
    },
});

export default App;
