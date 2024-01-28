import {
  appleAuth,
  appleAuthAndroid,
} from '@invertase/react-native-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getProfile, login} from '@react-native-seoul/kakao-login';
import jwtDecode from 'jwt-decode';
import React, {useEffect, useRef} from 'react';
import {
  Alert,
  Animated,
  ImageBackground,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import 'react-native-get-random-values';
import {v4 as uuid} from 'uuid';
import UserStore from '../stores/UserStore';

const Login = ({navigation}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnimBtn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay: 300,
      useNativeDriver: true,
    }).start();
    Animated.timing(fadeAnimBtn, {
      toValue: 1,
      duration: 500,
      delay: 1300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const saveData = await AsyncStorage.getItem('jwtKey');
        if (saveData) {
          UserStore.setJwtKey(saveData);
          navigation.navigate('WebView');
        }
      } catch (error) {
        console.error('Error retrieving saveData:', error);
      }
    };

    checkLoginStatus();
  }, []);

  const signInWithKakao = async () => {
    try {
      const kakaoResponse = await login();
      if (kakaoResponse.accessToken) {
        let id = '';
        const profile = await getProfile()
          .then(res => {
            id = res.id;
            return res;
          })
          .catch(error => {
            throw error;
          });

        if (id) {
          doLogin(id, 'KAKAO', profile);
        } else {
          Alert.alert('오류입니다.');
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const signWithAppleInAndroid = async () => {
    const rawNonce = uuid();
    const state = uuid();
    try {
      appleAuthAndroid.configure({
        clientId: 'startrail.beside.com',
        redirectUri: 'https://www.byeoljachui.com/AppleAuth',
        scope: appleAuthAndroid.Scope.ALL,
        responseType: appleAuthAndroid.ResponseType.ALL,
        nonce: rawNonce,
        state,
      });

      const response = await appleAuthAndroid.signIn();

      if (response) {
        const {email} = jwtDecode(response.id_token);

        await doLogin(email, 'APPLE', {});
      }
    } catch (error) {
      console.error(error);
    }
  };

  const signWithAppleInIOS = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );

      if (credentialState === appleAuth.State.AUTHORIZED) {
        const {
          user: newUser,
          nonce,
          identityToken,
          realUserStatus,
        } = appleAuthRequestResponse;

        await doLogin(jwtDecode(identityToken).email, 'APPLE', {});
      }
    } catch (error) {
      console.error(error);
    }
  };

  const doLogin = async (id, type, data) => {
    const backendResponse = await UserStore.existsUser(id, type);

    UserStore.setServiceUserId(id);
    UserStore.setOauthServiceType(type);
    UserStore.setProfile(data);

    // 유저 정보가 있을 경우.
    if (backendResponse) {
      const jwtKey = await UserStore.signUser(id, type);

      console.log(jwtKey);

      await AsyncStorage.setItem('jwtKey', jwtKey);

      navigation.navigate('WebView', jwtKey);
    } else {
      navigation.navigate('Agreement');
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('./images/IndexBg.png')}
        style={styles.bgImg}
        resizeMode="cover">
        <View style={styles.logoWrap}>
          <Animated.Image
            source={require('./images/Logo.png')}
            alt="logo"
            style={[styles.logo, {opacity: fadeAnim}]}
          />
        </View>
        <View style={styles.textWrap}>
          <Animated.Text style={[styles.text, {opacity: fadeAnim}]}>
            내가 사랑하는 사람들과{'\n'}주고받은 마음을 기록해보세요
          </Animated.Text>
        </View>
        <TouchableOpacity style={styles.buttonWrap} onPress={signInWithKakao}>
          <Animated.Image
            source={require('./images/KaKaoLoginBtn.png')}
            alt="kakao-btn"
            style={[styles.button, {opacity: fadeAnimBtn}]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonWrap}
          onPress={
            Platform.OS === 'ios' ? signWithAppleInIOS : signWithAppleInAndroid
          }>
          <Animated.Image
            source={require('./images/AppleLoginBtn.png')}
            alt="apple-btn"
            style={[styles.button, {opacity: fadeAnimBtn}]}
          />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImg: {
    flex: 1,
    justifyContent: 'center',
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    marginTop: -50,
  },
  logo: {
    width: 80,
    height: 108,
  },
  textWrap: {
    marginTop: 24,
    marginBottom: 110,
  },
  text: {
    textAlign: 'center',
    color: '#818181',
    fontSize: 12,
    fontWeight: 500,
  },
  buttonWrap: {
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 44,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 40,
    overflow: 'hidden',
  },
});

export default Login;
