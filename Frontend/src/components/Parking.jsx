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

export default function Parking({ navigation, route }) {
    const [parkingInfo, setParkingInfo] = useState({})
    const [isUserRenting, setIsUserRenting] = useState(false)

    useEffect(() => {
        getParkingInfo()
    }, [])

    const getParkingInfo = async () => {
        const userInfo = JSON.parse(await AsyncStorage.getItem('@userInfo'))
        const parkingInfo = await axios.get(`http://10.100.102.29:3000/parks/${route.params._id}`)
        const isRentingParking = await axios.get(`http://10.100.102.29:3000/orders/byParkAndConsumer/${route.params._id}/${userInfo._id}`)

        setIsUserRenting(isRentingParking)
        setParkingInfo(parkingInfo)
    }

    const isTimeAllowed = () => {

    }

    const endRentParking = async () => {

    }

    const onRentParking = async () => {
        const userInfo = JSON.parse(await AsyncStorage.getItem('@userInfo'))

        const newOrder = {
            parkId: route.params._id,
            consumerId: userInfo._Id,
            vehicleSerial: 123123123,
            timeStart: new Date(),
            payment: 0
        }

        axios.post(`http://10.100.102.29:3000/orders/create`, newOrder)
        .then(res => {
            if(res.status == 200) {
                Alert.alert('Success!', 'Parking rented successfully')
                navigation.goBack(null)
            } else {
                Alert.alert('Failed!', `Couldnt rent parking. Please try again`)
            }
        })
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Image style={styles.avatar}
                        contentFit='contain'
                        source={route.params.imageUrl}
                        placeholder={require("../../assets/listing_parking_placeholder.png")} />
                </View>
            </View>
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
                value={route.params.location}
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
            {isUserRenting ? <Button title="End Parking" color="red" onPress={endRentParking} /> : null}
            {!isUserRenting && parkingInfo.isAvailable ?
                <Button title="Rent Parking" color="blue" onPress={onRentParking} />
                :
                <Text>Parking is currently occupied or unusuable!</Text>}

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
})