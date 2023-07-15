import React, { useState, useRef, useEffect } from 'react';
import {View, Text, Button} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

const Agreement = ({route, navigation}) => {

    const [check1, setCheck1] = useState(false);
    const [check2, setCheck2] = useState(false);

    const checkRef1 = useRef(null);
    const checkRef2 = useRef(null);

    // const [jwtKey, setJwtKey] = useState('');

    // useEffect(() => {
    //   setJwtKey(route.params.jwtKey);
    // }, [])

    return (
      <View style={styles.container}>
        <View style={styles.termHeader}>
          <Text style={styles.title}>서비스 사용을 위한</Text>
          <Text style={styles.title}>약관에 동의해주세요.</Text>
        </View>
        <View style={styles.termBody}>
          <View style={styles.termRow}>
            <CheckBox value={check1} 
                onValueChange={() => setCheck1(!check1)} 
                ref={checkRef1}/>
            <Text>
              <Text style={styles.termText}>별자취 </Text>
              <Text style={styles.termTextClick}>이용약관 </Text>
              <Text style={styles.termText}>및 </Text>
              <Text style={styles.termTextClick}>개인정보 수집 및 이용</Text>
              <Text style={styles.termText}>에 동의합니다.</Text>
              <Text style={styles.mandatory}>(필수)</Text>
            </Text>
          </View>
          <View style={styles.termRow}>
            <CheckBox value={check2} 
                onValueChange={() => setCheck2(!check2)} 
                ref={checkRef2}/>
            <Text style={styles.termText}>
              이벤트 및 마케팅 수신 동의(선택)
            </Text>
          </View>
        </View>
        <View style={styles.buttonDiv}>
          <Button
            title="다음"
            disabled={!check1}
            onPress={() => {navigation.navigate('WebView', route.params)}}
          />
        </View>
      </View>
    );
};

const styles = {
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    termHeader: {
      marginBottom: 20,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    termBody: {
      marginBottom: 20,
    },
    termRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    termText: {
      fontSize: 14,
    },
    termTextClick: {
      fontSize: 14,
      textDecorationLine: 'underline',
    },
    mandatory: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    buttonDiv: {
      marginTop: 20,
    },
};

export default Agreement;