import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { WebView } from "react-native-webview";
import UserStore from "../stores/UserStore";
import { logout, unlink } from "@react-native-seoul/kakao-login";

const MyWebView = ({ route, navigation }) => {
  const BASE_URL = "https://www.byeoljachui.com/";
  const [webview, setWebview] = useState();
  useEffect(() => {
    if (webview && webview.clearCache) webview.clearCache();
  }, [webview]);

  return (
    <WebView
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
          unlink();

          navigation.navigate("Login");

          AsyncStorage.removeItem("jwtKey");
        }
      }}
      injectedJavaScript={`
                (function() {
                    window.postMessage('${UserStore.getJwtKey}', '*');
                })();
            `}
    />
  );
};

export default MyWebView;
