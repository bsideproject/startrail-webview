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
    Alert,
    BackHandler
} from 'react-native';
import MyWebView from './components/MyWebView';

const App = () => {
    const isDarkMode = useColorScheme() === 'dark';

    return (
        <>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <SafeAreaView style={styles.root}>
                <MyWebView />
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1
    },
});

export default App;