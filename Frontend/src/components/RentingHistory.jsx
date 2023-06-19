import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Image, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import * as Location from 'expo-location'
import { View } from 'react-native';
import axios from 'axios';
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-native-material/core';
import * as http from '../api/HttpClient'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RentingHistory({ navigation, route }) {
    const [isRequestingRents, setIsRequestingRents] = useState(true)
    const [rents, setRents] = useState([]);
    const [activeRent, setActiveRent] = useState([]);

    useEffect(() => {
        getRentHistoryForParking()
    }, [])

    const getRentHistoryForParking = async () => {
        const user = JSON.parse(await AsyncStorage.getItem('@user'));
        console.log(user.id)
        const rentList = await http.get(`orders/orderByConsumer/${user.id}`)

        const rentListWithParking = await Promise.all(rentList.map(async (rent) => {
            const rentWithParking = await getParkingFromRent(rent)

            return rentWithParking
        }))

        setRents(rentListWithParking)
        setIsRequestingRents(false)
    }

    const getParkingFromRent = async (rent) => {
        const parkingInfo = await http.get(`parks/${rent.parkId}`)

        return {
            ...rent,
            parking: {
                ...parkingInfo
            }
        }
    }

    const countTotalRentMoney = () => {
        return rents.reduce((sum, rent) => {
            return sum + parseFloat(((Math.abs(new Date(rent.timeStart) - new Date(rent.timeEnd)) / 36e5) * rent?.parking?.price).toFixed(2))
        }, 0).toFixed(2)
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.statsContainer}>
                        <View style={styles.statsBox}>
                            <Text style={styles.statsLabel}>You can view your rent history here!</Text>
                        </View>
                        <View style={styles.statsBox}>
                            <Text style={styles.moneyLabel}>Total money spent on parkings: {countTotalRentMoney()}</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.carsHolder}>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.body}>
                    {rents.map((rent, index) => (
                        <TouchableOpacity key={index} style={styles.option} onPress={() => navigation.navigate('Renting History Rent', { ...rent, getRentHistoryForParking })}>
                            <View style={styles.optionBody}>
                                <Text adjustsFontSizeToFit
                                    style={styles.optionText}>{new Date(rent.timeEnd).toLocaleDateString()} - {rent?.parking?.title}</Text>
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
        width: '90%',
        color: '#999999',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    optionText: {
        fontSize: 20,
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
    moneyLabel: {
        fontSize: 16,
        color: 'rgba(0,0,0,0.7)',
    },
    statusLabel: {
        fontSize: 16,
        color: 'rgba(0,0,0,0.7)',
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