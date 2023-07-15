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

const Stack = createStackNavigator();

const App = () => {

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name='Login' component={Login} options={{ headerShown: false }}/>
                <Stack.Screen name='Agreement' component={Agreement} options={{ headerShown: false }}/>
                <Stack.Screen name='WebView' component={MyWebView} options={{ headerShown: false }}/>
            </Stack.Navigator>
        </NavigationContainer>
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
