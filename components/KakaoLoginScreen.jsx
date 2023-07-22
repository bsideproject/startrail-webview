import { WebView } from 'react-native-webview';
import { View } from 'react-native';
import axios from 'axios';
import { useState } from 'react';
import queryString from 'query-string';

const REST_API_KEY = 'ffefc95e6555a1eee5499d4cf824f9ec';
const REDIRECT_URI = 'https://www.byeoljachui.com/api/oauth/kakao';

const inject_javascript = `
    document.addEventListener("DOMContentLoaded", () => {
        console.log("domcontentloaded");
        document.body.style.display = "none";
    });
    window.ReactNativeWebView.postMessage(document.body.innerHTML);
` 

const KakaoLoginScreen = () => {

    // const [isLogin ,setLogin] = useState(false);

    // const login = async(target) => {
    //     const exp = 'code=';
    //     const condition = target.indexOf(exp);
    //     console.log("target : " + JSON.stringify(target));
    //     if (condition !== -1) {
    //         const requestCode = target.substring(condition + exp.length);
    //         await requestToken(requestCode);
    //     }
    // }

    // const requestToken = async(code) => {
    //     const requestTokenUrl = 'https://kauth.kakao.com/oauth/token';

    //     const options = queryString.stringify({
    //         grant_type : 'authorization_code',
    //         client_id : REST_API_KEY,
    //         redirect_uri : REDIRECT_URI,
    //         code,
    //     });

    //     try {
    //         const tokenResponse = await axios.post(requestTokenUrl, options);
    //         const ACCESS_TOKEN = tokenResponse.access_token;

    //         const body = {
    //             ACCESS_TOKEN,
    //         };

    //         const response = await axios.post(REDIRECT_URI, body);

    //         const value = response.data;

    //         console.log("value : " + value);

    //     } catch(e) {
    //         console.error(e);
    //     }

    // }
    
    //카카오는 코드만

    return (
        <View style={{flex : 1}}>
            <WebView
                style={{flex : 1}}
                source={{
                    uri:`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`
                }}
                onMessage={event => {
                    const data = event.nativeEvent.data;
                    // login(data);
                    console.log("data : " + JSON.stringify(data));
                }}
                injectedJavaScriptBeforeContentLoadedForMainFrameOnly={true}
                injectedJavaScriptBeforeContentLoaded={inject_javascript}
                javaScriptEnabled
            ></WebView>
        </View>
    );
}

export default KakaoLoginScreen;