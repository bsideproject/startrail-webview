import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import terms from './terms.json';
import RenderHTML from 'react-native-render-html';
import { View, useWindowDimensions, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';

const Term = ({route, navigation}) => {

    const [source, setSource] = useState('');
    const [title, setTitle] = useState('');
    const { width } = useWindowDimensions();

    useEffect(() => {

        let temp = {};
        const index = route.params.index;

        if (index === 0) {
            temp = terms.serviceUseTerm;
            setTitle('서비스 이용약관');
        } else if (index === 1) {
            temp = terms.privateDataTerm;
            setTitle('개인정보 수집 및 이용 안내');
        } else if (index === 2) {
            temp = terms.marketingTerm;
            setTitle('이벤트 및 마케팅 수신 동의');
        }

        setSource(temp);
    }, []);

    return (
        <View style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('./images/ic_close_btn.png')} />
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.scrollView}>
            {source ? (
                    <RenderHTML source={{ html: source }} 
                        contentWidth={width} 
                        tagsStyles={tagsStyles} />
                ) : (
                    <Text>Loading...</Text>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    page : {
        flex : 1,
        backgroundColor : "#1E1E1E",
    },
    header : {
        marginTop: 30,
        flexDirection : 'row',
        height : 50,
    },
    title : {
        color : 'white',
        fontSize : 20,
        fontWeight : '700',
        width : 350,
        marginLeft: 10,
    },
    scrollView : {
        flex : 1,
        paddingLeft : 10,
        paddingRight : 10,
    },
});

const tagsStyles = {
    body : {
        color : 'white'
    }
}

export default Term;