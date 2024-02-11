import AsyncStorage from "@react-native-async-storage/async-storage";
import { unlink } from "@react-native-seoul/kakao-login";
import React, { useEffect, useRef, useState } from "react";
import { BackHandler } from "react-native";
import { WebView } from "react-native-webview";
import UserStore from "../stores/UserStore";

const INJECTED_JAVASCRIPT = `
(function() {
  setTimeout(() => window.postMessage('${UserStore.getJwtKey}', '*'), 500);
})();

(function() {
  function wrap(fn) {
    return function wrapper() {
      var res = fn.apply(this, arguments);
      window.ReactNativeWebView.postMessage('navigationStateChange');
      return res;
    }
  }

  history.pushState = wrap(history.pushState);
  history.replaceState = wrap(history.replaceState);
  window.addEventListner('popstate', function() {
    window.ReactNativeWebView.postMessage('navigationStateChange');
  });
})();

true;
`;

const MyWebView = ({ route, navigation }) => {
  const BASE_URL = "https://www.byeoljachui.com/";
  const webview = useRef();

  const [isCanGoBack, setIsCanGoBack] = useState(false);

  const onPressHardwareBackButton = () => {
    if (webview.current && isCanGoBack) {
      webview.current.goBack();
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (webview && webview.clearCache) {
      webview.clearCache();
    }
  }, [webview]);

  useEffect(() => {
    BackHandler.addEventListener(
      "hardwareBackPress",
      onPressHardwareBackButton,
    );

    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        onPressHardwareBackButton,
      );
    };
  }, [isCanGoBack]);

  return (
    <WebView
      ref={webview}
      pullToRefreshEnabled={true}
      startInLoadingState={true}
      allowsBackForwardNavigationGestures={true}
      source={{ uri: BASE_URL }}
      sharedCookiesEnabled={true}
      mixedContentMode={"compatibility"}
      originWhitelist={["https://*", "http://*"]}
      overScrollMode={"never"}
      onMessage={event => {
        const message = event.nativeEvent.data;

        if (message === "logout") {
          navigation.navigate("Login");

          AsyncStorage.removeItem("jwtKey");
        }

        // 카카오, 애플 나눠놓아야 할듯
        if (message === "withdrawal") {
          unlink();

          navigation.navigate("Login");

          AsyncStorage.removeItem("jwtKey");
        }

        if (message === "navigationStateChange") {
          console.log(
            "event.nativeEvent.canGoBack : " + event.nativeEvent.canGoBack,
          );
          setIsCanGoBack(event.nativeEvent.canGoBack);
        }
      }}
      injectedJavaScript={`
(function() {
  setTimeout(() => window.postMessage('${UserStore.getJwtKey}', '*'), 500);
})();

(function() {
  function wrap(fn) {
    return function wrapper() {
      var res = fn.apply(this, arguments);
      window.ReactNativeWebView.postMessage('navigationStateChange');
      return res;
    }
  }

  history.pushState = wrap(history.pushState);
  history.replaceState = wrap(history.replaceState);
  window.addEventListner('popstate', function() {
    window.ReactNativeWebView.postMessage('navigationStateChange');
  });
})();

true;
`}
    />
  );
};

export default MyWebView;
