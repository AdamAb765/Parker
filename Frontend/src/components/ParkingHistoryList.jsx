import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Image, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import * as Location from 'expo-location'
import { View } from 'react-native';
import axios from 'axios';
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-native-material/core';
import * as http from '../api/HttpClient'

export default function ParkingHistoryList({ navigation, route }) {
    const [isRequestingRents, setIsRequestingRents] = useState(true)
    const [rents, setRents] = useState([]);

    useEffect(() => {
        getRentHistoryForParking()
    }, [])

    const getRentHistoryForParking = async () => {
        const rentList = await http.get(`orders/byParkId/${route.params._id}`)
        const rentListWithRenter = await Promise.all(rentList.map(async (rent) => {
            const rentWithRenter = await getUserInfoFromRent(rent)

            return rentWithRenter
        }))

        setRents(rentListWithRenter)
        setIsRequestingRents(false)
    }

    const getUserInfoFromRent = async (rent) => {
        const renterInfo = await http.get(`users/${rent.consumerId}`)

        return {
            ...rent,
            renter: {
                ...renterInfo
            }
        }
    }

    const countTotalRentMoney = () => {
        return rents.reduce((sum, rent) => {
            console.log(Math.abs(new Date(rent.timeStart) - new Date(rent.timeEnd)))
            return sum + parseFloat(((Math.abs(new Date(rent.timeStart) - new Date(rent.timeEnd)) / 36e5) * route.params.price).toFixed(2))
        }, 0)
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.statsContainer}>
                        <View style={styles.statsBox}>
                            <Text style={styles.statsLabel}>You can view this parking's history here!</Text>
                        </View>
                        <View style={styles.statsBox}>
                            <Text style={styles.moneyLabel}>Total money made: {countTotalRentMoney()} ILS</Text>
                        </View>
                        <View style={styles.statsBox}>
                            <Text style={styles.statusLabel}>Current Status: {route.params.isAvailable ? 'Vacant' : 'Occupied'}!</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.carsHolder}>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.body}>
                    {rents.map((rent, index) => (
                        <TouchableOpacity key={index} style={styles.option} onPress={() => navigation.navigate('Parking History Rent', { ...rent, ...route.params })}>
                            <View style={styles.optionBody}>
                                <Text adjustsFontSizeToFit
                                    style={styles.optionText}>{new Date(rent.timeStart).toLocaleDateString()} - {rent?.renter?.firstName} {rent?.renter?.lastName}</Text>
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
        fontSize: 20,
        color: 'rgba(0,0,0,0.7)',
    },
    statusLabel: {
        fontSize: 20,
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