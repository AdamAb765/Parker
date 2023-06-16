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
    const [isCarsDropdownOpen, setIsCarsDropdownOpen] = useState(false);
    const [chosenCar, setChosenCar] = useState(null);

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

    const isTimeAllowed = () => {
        const now = new Date()
        const regex = new RegExp(':', 'g')

        return parseInt(now.toLocaleTimeString().replace(regex, ''), 10) > parseInt(parkingInfo?.accessibleStartTime.replace(regex, ''), 10) &&
            parseInt(now.toLocaleTimeString().replace(regex, ''), 10) < parseInt(parkingInfo?.accessibleEndTime.replace(regex, ''), 10)
    }

    const endRentParking = async () => {
        await http.put(`orders/finishPark`, { ...userRent }).then(res => {
            if (res) {
                Alert.alert('Success!', 'Rent ended successfully')
                navigation.goBack(null)
            } else {
                Alert.alert('Failed!', `Couldnt stop renting. Please try again`)
            }
        })
    }

    const onRentParking = async () => {
        const userInfo = JSON.parse(await AsyncStorage.getItem('@user'))

        if (chosenCar) {

            const newOrder = {
                parkId: route.params._id,
                consumerId: userInfo.id,
                vehicleSerial: chosenCar,
                timeStart: new Date(),
                payment: 0
            }

            http.post(`orders/create`, newOrder)
                .then(res => {
                    if (res) {
                        Alert.alert('Success!', 'Parking rented successfully')
                        navigation.goBack(null)
                    } else {
                        Alert.alert('Failed!', `Couldnt rent parking. Please try again`)
                    }
                })
        } else {
            Alert.alert('Parking Failed!', `Please choose a car for parking. If you dont have any, please add one in your profile`)
        }
    }

    const createDropDownValues = () => {
        return userCars.map(car => {
            return {
                label: `${car.serial} ${car.color} ${car.brand}`,
                value: car.serial
            }
        })
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Image style={styles.avatar}
                        contentFit='contain'
                        source={`${http.get_url()}/parks/image/${parkingInfo.imagePath}`}
                    />
                </View>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', width: '90%', height: '10%', justifyContent: 'space-evenly' }}>
                <TextInput
                    variant={'outlined'}
                    editable={false}
                    label='Parking Start Time'
                    style={styles.timeText}
                    value={parkingInfo?.accessibleStartTime}
                    onChangeText={(newText) => setTitleInput(newText)}
                />
                <TextInput
                    variant={'outlined'}
                    editable={false}
                    label='Parking End Time'
                    style={styles.timeText}
                    value={parkingInfo?.accessibleEndTime}
                    onChangeText={(newText) => setTitleInput(newText)}
                />
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
                        <Text>Your parking is currently occupied</Text>)
                    :
                    parkingInfo?.isAvailable && isTimeAllowed() && !userRent ?
                        <>
                            <DropDownPicker
                                style={styles.dropdown}
                                open={isCarsDropdownOpen}
                                value={chosenCar}
                                items={createDropDownValues()}
                                setOpen={setIsCarsDropdownOpen}
                                setValue={setChosenCar}
                                setItems={setUserCars}
                                placeholder="Select Your Car"
                                placeholderStyle={styles.placeholderStyles}
                                zIndex={3000}
                                zIndexInverse={1000}
                            />
                            <Button title="Rent Parking" color="blue" style={styles.btn} onPress={onRentParking} />
                        </>
                        :
                        userRent ?
                            <Button title="End Parking" color="red" style={styles.btn} onPress={endRentParking} />
                            :
                            <Text>Parking is currently occupied or unusuable!</Text>}
                {/* {userRent ? <Button title="End Parking" color="red" onPress={endRentParking} /> : null}
                {!userRent && parkingInfo?.isAvailable && isTimeAllowed() ?
                    <Button title="Rent Parking" color="blue" onPress={onRentParking} />
                    :
                    <Text>Parking is currently occupied or unusuable!</Text>} */}
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