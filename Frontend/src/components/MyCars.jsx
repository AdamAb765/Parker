import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Image, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import * as Location from 'expo-location'
import { View } from 'react-native';
import { get } from 'axios';
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-native-material/core';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MyCars({ navigation, route }) {
    const [isRequestingCars, setIsRequestingCars] = useState(true)
    const [cars, setCars] = useState([]);

    useEffect(async () => {
        //request cars
        const userInfo = JSON.parse(await AsyncStorage.getItem('@userInfo'));
        const vehicles = get("http://10.100.102.26/vehicles/vehicleByOwner/" + userInfo.id);
        console.log(vehicles);
        setCars([{
            carNumber: '12345678',
            carName: 'Skoda Fabia',
            carColor: 'White',
            imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Skoda_Fabia_IV_IMG_5307.jpg"
        }, {
            carNumber: '987654321',
            carName: 'Skoda Fabia',
            carColor: 'White',
            imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Skoda_Fabia_IV_IMG_5307.jpg"
        }])
        setIsRequestingCars(false)
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.statsContainer}>
                        <View style={styles.statsBox}>
                            <Text style={styles.statsLabel}>You can add and edit your vehicles here!</Text>
                        </View>
                        <Button title="Add Car" color='blue' style={styles.addBtn} onPress={() => navigation.navigate('Add Car')} />
                    </View>
                </View>
            </View>
            <View style={styles.carsHolder}>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.body}>
                    {cars.map((car, index) => (
                        <TouchableOpacity key={index} style={styles.option} onPress={() => navigation.navigate('Car', { ...car })}>
                            <View style={styles.optionBody}>
                                <Text adjustsFontSizeToFit
                                    style={styles.optionText}>{car.carName} - {car.carNumber}</Text>
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
        padding: 15,
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