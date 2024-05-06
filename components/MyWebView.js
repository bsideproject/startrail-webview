import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState, useRef } from "react";
import { BackHandler } from "react-native";
import { WebView } from "react-native-webview";
import UserStore from "../stores/UserStore";
import { logout } from "@react-native-seoul/kakao-login";

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
    if (webview && webview.clearCache) webview.clearCache();
  }, [webview]);

  useEffect(() => {
    BackHandler.addEventListener(
      "hardwareBackPress",
      onPressHardwareBackButton
    );

    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        onPressHardwareBackButton
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
      onMessage={(event) => {
        const message = event.nativeEvent.data;

        if (message === "logout") {
          navigation.navigate("Login");

          AsyncStorage.removeItem("jwtKey");
        }

        if (message === "withdrawal") {
          navigation.navigate("Login");

          AsyncStorage.removeItem("jwtKey");
        }

        if (message === "navigationStateChange") {
          console.log(
            "event.nativeEvent.canGoBack : " + event.nativeEvent.canGoBack
          );
          setIsCanGoBack(event.nativeEvent.canGoBack);
        }
      }}
      injectedJavaScript={`
                (function() {
                    window.postMessage('${UserStore.getJwtKey}', '*');
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
