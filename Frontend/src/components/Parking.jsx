import React, { useEffect, useRef, useState, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import * as Location from 'expo-location'
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack, TextInput, IconButton, Button } from "@react-native-material/core";
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as http from '../api/HttpClient'
import { Picker } from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';

export default function Parking({ navigation, route }) {
    const [parkingInfo, setParkingInfo] = useState({})
    const [userRent, setUserRent] = useState(false)
    const [isUsersParking, setIsUsersParking] = useState(false)
    const [userCars, setUserCars] = useState([])

    useEffect(() => {
        getParkingInfo()
        getUserCars()
    }, [])

    const getUserCars = async () => {
        const userInfo = JSON.parse(await AsyncStorage.getItem('@user'))
        const cars = await http.get(`vehicles/vehicleByOwner/${userInfo.id}`)

        setUserCars(cars)
    }

    const getParkingInfo = async () => {
        const userInfo = JSON.parse(await AsyncStorage.getItem('@user'))
        const parkingInfo = await http.get(`parks/${route.params._id}`)
        const isRentingParking = await http.get(`orders/byParkAndConsumer/${route.params._id}/${userInfo.id}`)

        setUserRent(isRentingParking)
        setIsUsersParking(userInfo.id == parkingInfo.ownerId)
        setParkingInfo(parkingInfo)
    }

    const endRentParking = async () => {
        await http.put(`orders/finishPark`, { ...userRent }).then(res => {
            if (res) {
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
                        source={route.params?.image}
                        placeholder={require("../../assets/listing_parking_placeholder.png")} />
                </View>
            </View>
            <View style={{ display: 'flex', flexDirection: 'column', width: '90%', height: '34%', alignSelf: 'center', justifyContent: 'space-between' }}>
                <TextInput
                    variant={'outlined'}
                    editable={false}
                    label='Parking Title'
                    style={styles.textInput}
                    value={route.params.title}
                    onChangeText={(newText) => setTitleInput(newText)}
                />
                <TextInput
                    variant={'outlined'}
                    editable={false}
                    style={styles.textInput}
                    label='Parking Instructions'
                    value={route.params.instructions}
                    onChangeText={(newText) => setInstructionsInput(newText)}
                />
                <TextInput
                    variant={'outlined'}
                    editable={false}
                    style={styles.textInput}
                    label='Parking Location'
                    value={route.params.address}
                    onChangeText={(newText) => setLocationInput(newText)}
                />
                <TextInput
                    variant={'outlined'}
                    editable={false}
                    style={styles.textInput}
                    label='Parking Price'
                    value={route.params.price + ' ILS Per Hour'}
                    onChangeText={(newText) => setLocationInput(newText)}
                />
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', width: '77%', height: '15%', justifyContent: 'space-around', alignItems: 'center', marginTop: 20 }} >
                {isUsersParking ?
                    (parkingInfo?.isAvailable ?
                        <Text>Your parking is currently unoccupied!</Text>
                        :
                        <Text>Your parking is currently occupied by car {parkingInfo?.currentParkingCar}</Text>)
                    :
                    !userRent ?
                        <Button title="View Schedule" color="blue" style={styles.btn} onPress={() => navigation.navigate('Parking Schedule', {...route.params, ...parkingInfo, userCars})} />
                        :
                        <Button title="End Parking" color="red" style={styles.btn} onPress={endRentParking} />}
            </View>
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    header: {
        height: '40%',
        width: '100%'
    },
    headerContent: {
        alignItems: 'center',
    },
    avatar: {
        width: 330,
        height: 230,
        marginTop: 10
    },
    name: {
        fontSize: 22,
        color: '#000000',
        fontWeight: '600',
    },
    textInput: {
        width: '100%',
        height: '27%',
        marginBottom: 5,
    },
    timeText: {
        width: '40%',
        height: '5%'
    },
    placeholderStyles: {
        color: "grey",
    },
    btn: {
        height: '40%',
        width: '55%'
    },
    dropdown: {
        width: '65%'
    }
})