import React, { useEffect, useRef, useState } from 'react';
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

export default function Parking({ navigation, route }) {
    const [parkingInfo, setParkingInfo] = useState({})
    const [userRent, setUserRent] = useState(false)
    const [isUsersParking, setIsUsersParking] = useState(false)

    useEffect(() => {
        getParkingInfo()
    }, [])

    const getParkingInfo = async () => {
        const userInfo = JSON.parse(await AsyncStorage.getItem('@user'))
        const parkingInfo = await http.get(`parks/${route.params._id}`)
        const isRentingParking = await http.get(`orders/byParkAndConsumer/${route.params._id}/${userInfo.id}`)

        setUserRent(isRentingParking)
        setIsUsersParking(userInfo.id == parkingInfo.ownerId)
        setParkingInfo(parkingInfo)
    }

    const isTimeAllowed = () => {
        return true
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

        const newOrder = {
            parkId: route.params._id,
            consumerId: userInfo.id,
            vehicleSerial: 123123123,
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
    }
    const [selectedLanguage, setSelectedLanguage] = useState();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Image style={styles.avatar}
                        contentFit='contain'
                        source={route.params.image}
                        placeholder={require("../../assets/listing_parking_placeholder.png")} />
                </View>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', width: '90%', height: '10%', justifyContent: 'space-evenly' }}>
                <TextInput
                    variant={'outlined'}
                    editable={false}
                    label='Parking Start Time'
                    style={styles.timeText}
                    value={route.params.accessibleStartTime}
                    onChangeText={(newText) => setTitleInput(newText)}
                />
                <TextInput
                    variant={'outlined'}
                    editable={false}
                    label='Parking End Time'
                    style={styles.timeText}
                    value={route.params.accessibleEndTime}
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
            <View style={{ display: 'flex', flexDirection: 'column', width: '90%', height: '10%', justifyContent: 'center', marginTop: 20 }} >
                <Picker
                    selectedValue={selectedLanguage}
                    onValueChange={(itemValue, itemIndex) =>
                        setSelectedLanguage(itemValue)
                    }>
                    <Picker.Item label="Java" value="java" />
                    <Picker.Item label="JavaScript" value="js" />
                </Picker>
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
    }
})