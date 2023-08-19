import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import UserStore from '../stores/UserStore';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterNickname = () => {

    const navigation = useNavigation();

    const [value, setValue] = useState('');
    const [valid, setValid] = useState(true);
    const [warning, setWarning] = useState('');

    useEffect(() => {
        if (value.length) {
            if (value.length > 6) {
                setValid(false);
                setWarning('6자 이하만 가능합니다.');
            } else if (/[`~!@#$%^&*|\\\'\";:\/?]/gi.test(value)) {
                setValid(false);
                setWarning('사용할 수 없는 문자가 포함되어 있습니다.');
            } else {
                setValid(true);
                setWarning('');
            }
        }
    }, [value]);

    const postUser = async() => {
        const userId = UserStore.getServiceUserId;
        const serviceType = UserStore.getOauthServiceType;
        const profile = UserStore.getProfile;
        const agreement = UserStore.getAgreement;

        UserStore.setNickname(value);

        const response = await UserStore.postUser(userId, serviceType, profile, agreement);

        if (response && response.status === 200) {
            await setJwtKey(userId, serviceType);
        } else {
            Alert.alert('오류가 발생했습니다.');
        }
    }

    const setJwtKey = async(id, type) => {
        const jwtKey = await UserStore.signUser(id, type);

        await AsyncStorage.setItem('jwtKey', jwtKey);

        navigation.navigate('WebView');
    }

    return (
        <View style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    이름을 설정하세요.
                </Text>
            </View>
            <View style={styles.body}>
                <TextInput 
                    onChangeText={setValue}
                    value={value}
                    placeholder='한글, 영문, 숫자 포함 최대 6자'
                    placeholderTextColor={'#818181'}
                    style={styles.input}
                />
                {
                    !valid &&
                    <Text style={styles.warning}>
                        {warning}
                    </Text>
                }
            </View>
            <View style={styles.buttonDiv}>
                <TouchableOpacity
                    style={(value.length > 0 && valid) ? styles.nextButton : styles.disabledButton}
                    disabled={!(value.length > 0 && valid)}
                    onPress={postUser}
                >
                    <Text style={styles.buttonText}>다음</Text>
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
    header : {
        flex : 1,
        alignItems: 'flex-start',
        justifyContent : 'center',
    },
    title : {
        color : 'white',
        fontSize : 20,
        fontWeight : 700,
        marginLeft : 10,
    },
    body : {
        flex : 3,
        alignItems: "center",
    },
    input : {
        color : 'white',
        backgroundColor : '#242424',
        width : 350,
        height : 50,
        marginTop : -20,
        borderRadius : 12,
        paddingLeft : 16,
        paddingRight : 16,
    },
    warning : {
        color : '#FA7F64',
        textAlign : 'left',
        marginLeft : -210,
        marginTop : 10,
    },
    nextButton : {
        width : 350,
        marginBottom : 30,
        backgroundColor : '#FA7F64',
        alignItems : 'center',
        height : 50,
        justifyContent : 'center',
        borderRadius : 10,
    },
    disabledButton: {
        width : 350,
        marginBottom : 30,
        backgroundColor : '#AFAFAF',
        color : '#818181',
        alignItems : 'center',
        height : 50,
        justifyContent : 'center',
        borderRadius : 10,
    },
    buttonDiv : {
        alignItems : 'center',
    }
});

export default RegisterNickname;