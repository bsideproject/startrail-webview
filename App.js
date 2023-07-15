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

    const [isLogin, setLogin] = useState(false);

    // async storage 로 로그인 데이터 있는지 확인
    useEffect(() => {

    }, [])

    return (
        // <>
        //     <SafeAreaView style={styles.root}>
        //         <StatusBar barStyle={"light-content"} />
        //         {/* // 삼항 연산자로 로그인 정보가 있으면 MyWebView 로 바로 넘기고
        //         // 없으면 Login 화면으로 넘긴다. */}
        //         {/* <MyWebView /> */}
        //         {/* <Login /> */}
        //         {
        //             isLogin ? 
        //                 <MyWebView 
        //                     profile={profile}
        //                     jwtKey={jwtKey}
        //                 /> 
        //                 : <Login 
        //                     setLogin={setLogin}
        //                     setProfile={setProfile} 
        //                     jwtKey={jwtKey}
        //                     setJwtKey={setJwtKey}  
        //                 />
        //         }
        //     </SafeAreaView>
        // </>
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
