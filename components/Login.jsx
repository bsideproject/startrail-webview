import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Platform } from 'react-native';
import { login, getProfile } from '@react-native-seoul/kakao-login';
import { v4 as uuid } from 'uuid';
import appleAuth, { appleAuthAndroid } from '@invertase/react-native-apple-authentication';
import jwtDecode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserStore from '../stores/UserStore';

const Login = ({navigation}) => {

    const baseUrl = 'https://www.byeoljachui.com';

    // apple 로그인 전용 데이터
    const [credentialStateForUser, updateCredentialStateForUser] = useState(-1);

    const [sequence, setSequence] = useState('');

    useEffect(() => {

        const checkLoginStatus = async () => {
            try {
                const saveData = await AsyncStorage.getItem('jwtKey');
                if (saveData) {
                    // const parsedData = JSON.parse(saveData);
                    navigation.navigate('WebView', saveData);
                }
            } catch (error) {
                console.error('Error retrieving saveData:', error);
            }
        };

        checkLoginStatus();

        if (Platform.OS === 'ios') {
            if (!appleAuth.isSupported) return;

            fetchAndUpdateCredentialState().catch(error =>
                updateCredentialStateForUser(`Error: ${error.code}`),
            )
        } 
    }, []);

    const signInWithKakao = async() => {
        try {
            
            const kakaoResponse = await login();
            if (kakaoResponse.accessToken) {

                let id = '';
                console.log("access Token : " + kakaoResponse.accessToken);

                const profile = await getProfile().then((res) => {
                    id = res.id;
                    return res;
                }).catch((error) => {
                    throw error;
                });

                if (id && id.length > 0) {
                    await doLogin(id, 'KAKAO', profile);
                }
            }
            
        } catch(e) {
            console.error(e);
        }
    }

    const sighWithAppleInAndroid = async() => {
        const rawNonce = uuid();
        const state = uuid();
        try {

            appleAuthAndroid.configure(
                {
                    clientId : "startrail.beside.com",
                    redirectUri : "https://www.byeoljachui.com/AppleAuth",
                    scope : appleAuthAndroid.Scope.ALL,
                    responseType : appleAuthAndroid.ResponseType.ALL,
                    nonce : rawNonce,
                    state,
                }
            );

            const response = await appleAuthAndroid.signIn();

            if (response) {
                const code = response.code;
                const id_token = response.id_token;
                const user = response.user;
                const state = response.state;

                console.log("Got auth code", code);
                console.log("Got id_token", id_token);
                console.log("Got user", user);
                console.log("Got state", state);

                const { email, email_verified, is_private_email, sub } = jwtDecode(response.id_token);

                await doLogin(email, 'APPLE', {});
            } 

        } catch(error) {
            console.error(error);
        }
    }

    const sighWithAppleInIOS = async() => {
        console.warn('Beginning Apple Authentication');

        try {
            const response = await appleAuth.performRequest({
                requestedOperation : appleAuth.Operation.LOGIN,
                requestedScopes : [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL]
            });

            const {
                newUser,
                email,
                nonce,
                identityToken,
                realUserStatus
            } = response;

            fetchAndUpdateCredentialState(newUser)
                .catch(error => updateCredentialStateForUser(`Error : ${error.code}`));

            if (response) {
                const code = response.code;
                const id_token = response.id_token;
                const user = response.user;
                const state = response.state;
    
                console.log("Got auth code", code);
                console.log("Got id_token", id_token);
                console.log("Got user", user);
                console.log("Got state", state);
    
                const { email, email_verified, is_private_email, sub } = jwtDecode(response.id_token);
    
                await doLogin(email, 'APPLE', {});
            }

        } catch(error) {
            console.error(error);
        }
    }

    const fetchAndUpdateCredentialState = async(user) => {
        if (user === null) {
            updateCredentialStateForUser('N/A');
        } else {
            const credentialState = await appleAuth.getCredentialStateForUser(user);
            if (credentialState === appleAuth.State.AUTHORIZED) {
                updateCredentialStateForUser('AUTHORIZED');
            } else {
                updateCredentialStateForUser(credentialState);
            }
        }
    }

    const doLogin = async(id, type, data) => {

        const backendResponse = await UserStore.existsUser(id, type);

        console.log("backendResponse : " + JSON.stringify(backendResponse));

        UserStore.setServiceUserId(id);
        UserStore.setOauthServiceType(type);
        UserStore.setProfile(data);

        // 유저 정보가 있을 경우.
        if (backendResponse) { 
            
            const jwtKey = await UserStore.signUser(id, type);

            console.log("jwtKey : " + jwtKey);

            await AsyncStorage.setItem('jwtKey', jwtKey);

            navigation.navigate('WebView', jwtKey);
        } else {

            navigation.navigate('Agreement');
        }
        
    }

    return (
        <View style={styles.page}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.buttonContainer}
                    onPress={signInWithKakao}>
                    <Image source={require('./images/KaKaoButton.png')} style={styles.buttonImage} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContainer}
                    onPress={Platform.OS === 'android' ? sighWithAppleInAndroid : sighWithAppleInIOS}>
                    <Image source={require("./images/AppleButton.png")} style={styles.buttonImage} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    page : {
        flex : 1,
        backgroundColor : "#1E1E1E",
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent : "center",
        backgroundColor : "#1E1E1E",
        marginTop: 500,
    },
    buttonContainer : {
        marginVertical: 10,
    },
    buttonImage : {
        width: 200,
        height: 50,
    },
});

export default Login;