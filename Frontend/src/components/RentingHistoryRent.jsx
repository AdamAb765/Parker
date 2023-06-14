import React, { useEffect, useRef, useState } from 'react';
import MapView, { Callout } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { StyleSheet, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import * as Location from 'expo-location'
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack, TextInput, IconButton, Button } from "@react-native-material/core";
import { CheckBox } from '@rneui/themed'
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import * as http from '../api/HttpClient'

export default function RentingHistoryRent({ navigation, route }) {

    const calcMoneyMade = () => {
        return ((Math.abs(new Date(route.params.timeEnd) - new Date(route.params.timeStart)) / 36e5) * route.params.parking.price).toFixed(2)
    }

    const showCancelParkingBtn = () => {
        return new Date() < new Date(route.params.timeStart)
    }

    const cancelParking = async () => {
        await http.remove(`orders/cancel`, { ...route.params }).then(res => {
            if (res) {
                route.params.getRentHistoryForParking()
                Alert.alert('Success!', 'Rent cancelled successfully')
                navigation.goBack(null)
            } else {
                Alert.alert('Failed!', `Couldnt cancel renting. Please try again`)
            }
        })
    }

    const endRentParking = async () => {
        await http.put(`orders/finishPark`, { ...route.params }).then(res => {
            if (res) {
                route.params.getRentHistoryForParking()
                Alert.alert('Success!', 'Rent ended successfully')
                navigation.goBack(null)
            } else {
                Alert.alert('Failed!', `Couldnt stop renting. Please leave parking with your car and try again`)
            }
        })
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Image style={styles.avatar}
                        contentFit='contain'
                        source={route.params.parking.image}
                        placeholder={require("../../assets/listing_parking_placeholder.png")} />
                </View>
            </View>
            <TextInput
                variant={'outlined'}
                editable={false}
                label='Parking Title'
                style={styles.textInput}
                value={route.params.parking.title}
            />
            <TextInput
                variant={'outlined'}
                editable={false}
                label='Start Time'
                style={styles.textInput}
                value={new Date(route.params.timeStart).toLocaleString()}
            />
            <TextInput
                variant={'outlined'}
                editable={false}
                style={styles.textInput}
                label='End Time'
                value={new Date(route.params.timeEnd).toLocaleString()}
            />
            <TextInput
                variant={'outlined'}
                editable={false}
                style={styles.textInput}
                label='Cost'
                value={calcMoneyMade() + ' ILS'}
            />
            {route.params.isFinished ?
                null
                :
                showCancelParkingBtn() ?
                    <Button title="Cancel Parking" color="red" style={styles.btn} onPress={cancelParking} />
                    :
                    <Button title="End Parking" color="red" style={styles.btn} onPress={endRentParking} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignContent: 'center',
        alignItems: 'center'
    },
    header: {
        height: '47.5%',
        width: '100%'
    },
    headerContent: {
        alignItems: 'center',
    },
    avatar: {
        width: 370,
        height: 270,
        marginTop: 10
    },
    name: {
        fontSize: 22,
        color: '#000000',
        fontWeight: '600',
    },
    textInput: {
        width: '70%',
        height: '8%',
        marginBottom: 5,
    },
    btn: {
        height: '6%',
        width: '55%'
    },
})