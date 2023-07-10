import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { login, getProfile } from '@react-native-seoul/kakao-login';
import MyWebView from './MyWebView';
import axios from 'axios';

const Login = (props) => {

    const baseUrl = 'https://www.byeoljachui.com';

    const signInWithKakao = async() => {
        try {
            
            const kakaoResponse = await login();
            if (kakaoResponse.accessToken) {

                let id = '';

                await getProfile().then((res) => {
                    id = res.id;
                }).catch((error) => {
                    throw error;
                });

                if (id && id.length > 0) {

                    const userGetRequest = convertResponse2GetRequest(id);

                    const backendResponse = await getUser(userGetRequest);

                    if (backendResponse) {
                        const jwtKey = await postUser(backendResponse.sequence);
                    }
                }
            }
            
        } catch(e) {
            console.error(e);
        }
    }

    const convertResponse2GetRequest = (kakaoId) => {
        const request = {
            serviceUserId : kakaoId,
            oauthServiceType : 'KAKAO'
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

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.buttonContainer}
                onPress={signInWithKakao}>
                <Image source={require('./images/KaKaoButton.png')} style={styles.buttonImage} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonContainer}>
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