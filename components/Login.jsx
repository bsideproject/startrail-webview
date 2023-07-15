import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Platform, SafeAreaView, StatusBar } from 'react-native';
import { login, getProfile } from '@react-native-seoul/kakao-login';
import MyWebView from './MyWebView';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import appleAuth, { appleAuthAndroid } from '@invertase/react-native-apple-authentication';
import jwtDecode from 'jwt-decode';

const Login = ({navigation}) => {

    const baseUrl = 'https://www.byeoljachui.com';

    // apple 로그인 전용 데이터
    const [credentialStateForUser, updateCredentialStateForUser] = useState(-1);

    const [sequence, setSequence] = useState('');

    useEffect(() => {
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
        const userGetRequest = convertResponse2GetRequest(id, type);

        const backendResponse = await getUser(userGetRequest);

        console.log("userGetRequest : " + JSON.stringify(userGetRequest));
        console.log("backendResponse : " + JSON.stringify(backendResponse));

        if (backendResponse && backendResponse.sequence) { 
            console.log("backend sequence : " + backendResponse.sequence);
            const jwtKey = await postUser(backendResponse.sequence);

            console.log(jwtKey);

            navigation.navigate('WebView', {userData : backendResponse, jwtKey : jwtKey});
        } else {

            const userPatchRequest = convertResponse2PatchRequest(id, type, data);

            console.log("user patch request : " + JSON.stringify(userPatchRequest));

            const userData = await patchUser(userPatchRequest);
            
            if (userData && userData.sequence) {
                setSequence(userData.sequence);

                const jwtKey = await postUser(userData.sequence);

                // console.log("jwt key : " + jwtKey);

                navigation.navigate('Agreement', {userData : userData, jwtKey : jwtKey});
            }
        }
        
    }

    const convertResponse2GetRequest = (id, type) => {
        const request = {
            serviceUserId : id,
            oauthServiceType : type
        };

        return request;
    }

    const getUser = async(request) => {

        const uri = `${baseUrl}/api/users?oauthServiceType=${request.oauthServiceType}&serviceUserId=${request.serviceUserId}`

        const response = await axios.get(uri)
            .then(res => {return res.data;})
            .catch(error => console.error(error));

        return response;
    }

    const postUser = async(sequence) => {
        const request = {
            sequence : sequence
        };

        const response = await axios.post(`${baseUrl}/api/sign`, request, {
            headers : {
                "Content-Type" : "application/json"
            }
        }).then(res => {return res.data;})
        .catch(error => console.error(error));

        return response;
    }

    const patchUser = async(request) => {

        const response = await axios.patch(`${baseUrl}/api/users`, request)
            .then(res => {return res.data})
            .catch(error => console.error(error));

        return response;
    }

    const convertResponse2PatchRequest = (userId, serviceType, data) => {

        let userInformation = {};

        if (serviceType === 'KAKAO') {

            console.log("data : " + JSON.stringify(data));

            const birthday = data.birthday;
    
            const month = parseInt(birthday.slice(0,2));
            const day = parseInt(birthday.slice(2));
        
            const birthDayObj = {
                year : 0,
                month : month,
                day : day
            };
        
            const sexType = data.gender;
        
            const ageRangeText = data.ageRange;
        
            let ageRange = 'UNDER_TEEN';
    
            switch(ageRangeText) {
            case 'AGE_0_9' :
                ageRange = 'UNDER_TEEN';
                break;
            case 'AGE_10_14' :
                ageRange = 'TEENS';
                break;
            case 'AGE_15_19' :
                ageRange = 'TEENS';
                break;
            case 'AGE_20_29' :
                ageRange = 'TWENTIES';
                break;
            case 'AGE_30_39' :
                ageRange = 'THIRTIES';
                break;
            case 'AGE_40_49' :
                ageRange = 'FORTIES';
                break;
            case 'AGE_50_59' :
                ageRange = 'FIFTIES';
                break;
            case 'AGE_60_69' :
                ageRange = 'OVER_FIFTY';
                break;
            case 'AGE_70_79' :
                ageRange = 'OVER_FIFTY';
                break;
            case 'AGE_80_89' :
                ageRange = 'OVER_FIFTY';
                break;
            case 'AGE_90_ABOVE' :
                ageRange = 'OVER_FIFTY';
                break;
            default :
                break;
            }

            userInformation = {
                profileImageLink : data.profileImageUrl,
                profileNickname : data.nickname,
                sexType : sexType,
                ageRangeType : ageRange,
                birth : birthDayObj
            }
        }

        const request = {
            oauthServiceType : serviceType,
            serviceUserId : userId,
            userInformation : userInformation
        };

        return request;
    }

    return (
        
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
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent : "center",
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