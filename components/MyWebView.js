import React, {useEffect, useState} from 'react';
import {
    BackHandler,
} from 'react-native';
import {WebView} from 'react-native-webview';

const MyWebView= ({handleClose}) => {
    const BASE_URL = 'https://wmii-85b73.web.app';
    const [webview, setWebview] = useState();
    useEffect(() => {
        if (webview && webview.clearCache) webview.clearCache();
    }, [webview]);
    return (
        <WebView
            pullToRefreshEnabled={true}
            startInLoadingState={true}
            allowsBackForwardNavigationGestures={true}
            source={{uri: BASE_URL}}
            mixedContentMode={'compatibility'}
            originWhitelist={['https://*', 'http://*']}
            overScrollMode={'never'}
            // ref={(ref) => setWebview(ref)}
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
