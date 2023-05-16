import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Image, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import * as Location from 'expo-location'
import { View } from 'react-native';
import axios from 'axios';
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-native-material/core';

export default function MyParkingSpots({ navigation, route }) {
    const [isRequestingParkings, setIsRequestingParkings] = useState(true)
    const [myParkingSpots, setMyParkingSpots] = useState([]);

    useEffect(() => {
        //request cars
        setMyParkingSpots([{
            title: 'Parking in middle of Tel Aviv',
            location: 'Rotschild 69 Tel Aviv',
            owner: {
                firstName: 'Adam',
                lastName: 'Abraham',
                contact: '0528535752'
            },
            price: '15',
            instructions: 'Call when reached the parking',
            imageUrl: "https://images.seattletimes.com/wp-content/uploads/2022/06/06032022_parking-spot_1650002.jpg?d=1560x1170"
        }])
        setIsRequestingParkings(false)
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.statsContainer}>
                        <View style={styles.statsBox}>
                            <Text style={styles.statsLabel}>You can add and edit your parkings here!</Text>
                        </View>
                        <Button title="Add Parking" color='blue' style={styles.addBtn} onPress={() => navigation.navigate('Add Parking')} />
                    </View>
                </View>
            </View>
            <View style={styles.parkingsHolder}>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.body}>
                    {myParkingSpots.map((parkingSpot, index) => (
                        <TouchableOpacity key={index} style={styles.option} onPress={() => navigation.navigate('My Parking', { ...parkingSpot })}>
                            <View style={styles.optionBody}>
                                <Text adjustsFontSizeToFit
                                    style={styles.optionText}>{parkingSpot.title}</Text>
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
        width: '50%',
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
    parkingsHolder: {
        height: '80%'
    }
})