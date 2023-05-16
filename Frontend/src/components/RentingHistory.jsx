import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Image, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import * as Location from 'expo-location'
import { View } from 'react-native';
import axios from 'axios';
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-native-material/core';

export default function RentingHistory({ navigation, route }) {
    const [useMyLocation, setUseMyLocation] = useState(false)
    const [titleInput, setTitleInput] = useState('')
    const [descriptionInput, setDescriptionInput] = useState('')
    const [locationInput, setLocationInput] = useState('')

    const [images, setImages] = useState([
        'https://www.bootdey.com/image/280x280/FF00FF/000000',
        'https://www.bootdey.com/image/280x280/00FFFF/000000',
        'https://www.bootdey.com/image/280x280/FF7F50/000000',
        'https://www.bootdey.com/image/280x280/6495ED/000000',
        'https://www.bootdey.com/image/280x280/DC143C/000000',
        'https://www.bootdey.com/image/280x280/FF00FF/000000',
        'https://www.bootdey.com/image/280x280/00FFFF/000000',
        'https://www.bootdey.com/image/280x280/FF7F50/000000',
        'https://www.bootdey.com/image/280x280/6495ED/000000',
        'https://www.bootdey.com/image/280x280/6495ED/000000',
        'https://www.bootdey.com/image/280x280/6495ED/000000',


    ]);


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.statsContainer}>
                        <View style={styles.statsBox}>
                            <Text style={styles.statsLabel}>You can add and edit your cars here!</Text>
                        </View>
                        <Button title="Add Car" color='blue' style={styles.addBtn} />
                    </View>
                </View>
            </View>
            <View style={styles.carsHolder}>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.body}>
                    {images.map((image, index) => (
                        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Rent History')}>
                            <View style={styles.optionBody}>
                                <Text adjustsFontSizeToFit
                                    style={styles.optionText}>Skoda Fabia - 63349501</Text>
                                <Icon name="chevron-right" size={24} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    option: {
        flex: 1,
        width: '100%',
        height: '20%',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: '1px',
        borderColor: '#a4adba',
        borderRadius: 5,
        marginTop: '2%'
    },
    optionBody: {
        width: '80%',
        color: '#999999',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    optionText: {
        fontSize: '20',
        color: '#6a717d',
    },
    header: {
        backgroundColor: '#fff',
        display: 'flex',
        height: '20%',
        width: '100%',
        justifyContent: 'space-evenly',
        alignContent: 'center',
        alignItems: 'center'
    },
    addBtn: {
        width: '40%',
        color: 'primary',
        alignSelf: 'center'
    },
    statsContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '80%',
        marginTop: 10,
    },
    statsBox: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    statsLabel: {
        fontSize: 14,
        color: '#999999',
    },
    body: {
        alignItems: 'center',
        padding: 10,
        flexDirection: 'column',
        flexWrap: 'wrap',
    },
    imageContainer: {
        width: '33%',
        padding: 5,
    },
    image: {
        width: '100%',
        height: 120,
    },
    carsHolder: {
        height: '80%'
    }
})