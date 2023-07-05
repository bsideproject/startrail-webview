import React, {useEffect, useRef, useState} from 'react';
import {WebView} from 'react-native-webview';

const MyWebView= ({handleClose}) => {
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
            // ref={(ref) => setWebview(ref)}
            onMessage={(event) => {
                setToken(event.nativeEvent.data);
                console.log(event.nativeEvent.data)
            }}
            injectedJavaScript={`
                (function() {
                    function wrap(fn) {
                    return function wrapper() {
                        var res = fn.apply(this, arguments);
                        window.ReactNativeWebView.postMessage(window.location.href);
                        return res;
                    }
                    }
                    history.pushState = wrap(history.pushState);
                    history.replaceState = wrap(history.replaceState);
                    window.addEventListener('popstate', function() {
                    window.ReactNativeWebView.postMessage(window.location.href);
                    });
                })();
            true;
            `}
        />
    );
};

export default MyWebView;
