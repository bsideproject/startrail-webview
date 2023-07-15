import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useRef, useState} from 'react';
import {WebView} from 'react-native-webview';

const MyWebView = ({route, navigation}) => {
    const BASE_URL = 'https://www.byeoljachui.com/';
    const [webview, setWebview] = useState();
    useEffect(() => {
        if (webview && webview.clearCache) webview.clearCache();
    }, [webview]);

    const [token, setToken] = useState(''); // 토큰 상태 값

    return (
        <WebView
            pullToRefreshEnabled={true}
            startInLoadingState={true}
            allowsBackForwardNavigationGestures={true}
            source={{uri: BASE_URL}}
            sharedCookiesEnabled={true}
            mixedContentMode={'compatibility'}
            originWhitelist={['https://*', 'http://*']}
            overScrollMode={'never'}
            onMessage={(event) => {
                setToken(event.nativeEvent.data);
                console.log("event data : " + event.nativeEvent.data);
            }}
            injectedJavaScript={`
                (function() {
                    window.postMessage('${JSON.stringify(route.params)}', '*');
                })();
            `}
        />
    );
};

export default MyWebView;
