import { WebView } from 'react-native-webview';
import { View } from 'react-native';
import axios from 'axios';
import { useEffect, useState } from 'react';

const REST_API_KEY = 'ffefc95e6555a1eee5499d4cf824f9ec';
const REDIRECT_URI = 'https://startrail.loca.lt/api/oauth/apple';

const AppleLoginScreen = () => {

    const [isLogin ,setLogin] = useState(false);

    const [queryString, setQueryString] = useState('');

    const apple_login_service_id = 'startrail.beside.com';
    const apple_redirect_url = 'https://startrail.loca.lt/api/oauth/apple';

    useEffect(() => {
        const config = {
            client_id : apple_login_service_id,
            redirect_uri : apple_redirect_url,
            response_type : "code id_token", 
            state : "origin:web",
            scope : "name email", 
            response_mode : "form_post",
            m : 11,
            v : "1.5.4"
        };

        const query = Object.entries(config).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
        setQueryString(query);
    }, []);
    

    return (
        <View style={{flex : 1}}>
            <WebView
                style={{flex : 1}}
                source={{
                    uri:`https://appleid.apple.com/auth/authorize?${queryString}`
                }}
            ></WebView>
        </View>
    );
}

export default AppleLoginScreen;