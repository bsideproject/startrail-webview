/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    useColorScheme,
} from 'react-native';
import MyWebView from './components/MyWebView';

const App = () => {

    return (
        <>
            <SafeAreaView style={styles.root}>
                <StatusBar barStyle={"light-content"} />
                <MyWebView />
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
