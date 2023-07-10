/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    useColorScheme,
} from 'react-native';
import MyWebView from './components/MyWebView';
import Login from './components/Login';

const App = () => {

    const [isLogin, setLogin] = useState(false);
    const [profile, setProfile] = useState();

    return (
        <>
            <SafeAreaView style={styles.root}>
                <StatusBar barStyle={"light-content"} />
                {/* // 삼항 연산자로 로그인 정보가 있으면 MyWebView 로 바로 넘기고
                // 없으면 Login 화면으로 넘긴다. */}
                {/* <MyWebView /> */}
                {/* <Login /> */}
                {
                    isLogin ? 
                        <MyWebView 
                            profile={profile}
                        /> 
                        : <Login 
                            setLogin={setLogin}
                            setProfile={setProfile} />
                }
            </SafeAreaView>
        </>
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
