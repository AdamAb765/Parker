import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { View } from 'react-native';
import { Stack, TextInput, IconButton, Button } from "@react-native-material/core";
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as http from '../api/HttpClient'
import RNDateTimePicker from '@react-native-community/datetimepicker';
import NumericInput from 'react-native-numeric-input';


const createAccessibleDateObject = (timeString) => {
    const splitTimeString = timeString.split(':')

    return new Date(1, 1, 1, splitTimeString[0], splitTimeString[1], 0)
}

export default function MyParking({ navigation, route }) {
    const [titleInput, setTitleInput] = useState(route.params.title)
    const [instructionInput, setInstructionsInput] = useState(route.params.instructions)
    const [locationInput, setLocationInput] = useState(route.params.address)
    const [accessibleStartTime, setAccessibleStartTime] = useState(createAccessibleDateObject(route.params.accessibleStartTime))
    const [accessibleEndTime, setAccessibleEndTime] = useState(createAccessibleDateObject(route.params.accessibleEndTime))
    const [price, setPrice] = useState(route.params.price)
    const [parkingImage, setParkingImage] = useState(route.params.image);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setParkingImage(result.assets[0].uri)
        }
    };

    const getGeoLocationFromInput = async () => {
        const searchInputResult = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?&address=${locationInput}&key=AIzaSyCZ-6i7NFhGDzMJl1546n-2EI0laWUc2Hc`)
        const firstSearchResult = searchInputResult.data.results[0]

        let locationToReturn = null

        if (firstSearchResult && firstSearchResult.geometry) {
            locationToReturn = {
                coords: {
                    latitude: firstSearchResult.geometry.location.lat,
                    longitude: firstSearchResult.geometry.location.lng,
                }
            }
        }

        return locationToReturn
    }

    const onEditParking = async () => {
        if (titleInput && instructionInput && accessibleStartTime && accessibleEndTime &&
            (price != 0) && locationInput && parkingImage) {
            let currentLocation

            currentLocation = await getGeoLocationFromInput()

            if (currentLocation && currentLocation.coords) {
                const userInfo = JSON.parse(await AsyncStorage.getItem('@user'))

                const editedParking = {
                    _id: route.params._id,
                    ownerId: userInfo.id,
                    title: titleInput,
                    instructions: instructionInput,
                    accessibleStartTime: accessibleStartTime.toLocaleTimeString(),
                    accessibleEndTime: accessibleEndTime.toLocaleTimeString(),
                    price: price,
                    address: locationInput,
                    longitude: currentLocation.coords.longitude,
                    latitude: currentLocation.coords.latitude,
                    isAvailable: true,
                    cameraName: '',
                    cameraPort: 0,
                    cameraIpAddress: 0
                }

                http.put('parks/edit', editedParking).then(res => {
                    if (res) {
                        Alert.alert('Success!', 'Parking edited successfully')
                        navigation.goBack(null)
                    } else {
                        Alert.alert('Failed!', 'Failed to edit parking. Please try again')
                    }
                })
            } else {
                Alert.alert('Failed!', `This address doesnt exist. Please try again`)
            }
        } else {
            Alert.alert('Failed!', 'Please make sure you filled all the fields, times, price and picture')
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={pickImage}>
                        <Image style={styles.avatar}
                            contentFit='contain'
                            source={parkingImage}
                            placeholder={require("../../assets/listing_parking_placeholder.png")} />
                    </TouchableOpacity>
                    <Text style={styles.statsLabel}>Press the pin to add a picture!</Text>
                </View>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', width: '65%', height: '10%', justifyContent: 'flex-start', alignItems: 'center' }}>
                <Text>Start:</Text>
                <RNDateTimePicker
                    mode="time"
                    value={accessibleStartTime}
                    is24Hour={true}
                    onChange={(e, newDate) => { setAccessibleStartTime(newDate) }} />
                <Text style={{ marginLeft: 50 }}>End:</Text>
                <RNDateTimePicker
                    mode="time"
                    value={accessibleEndTime}
                    is24Hour={true}
                    onChange={(e, newDate) => { setAccessibleEndTime(newDate) }} />
            </View>

            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '70%', justifyContent: 'space-evenly', marginBottom: 10 }}>
                <Text>Price:</Text>
                <NumericInput
                    value={price}
                    onChange={value => { setPrice(value) }}
                    minValue={0}
                    totalWidth={160}
                    totalHeight={50}
                    iconSize={25}
                    step={1}
                    valueType='real'
                    rounded
                    textColor='black'
                    iconStyle={{ color: 'white' }}
                    rightButtonBackgroundColor='blue'
                    leftButtonBackgroundColor='blue' />
            </View>
            <TextInput
                placeholder="Parking Title"
                variant="outlined"
                value={titleInput}
                style={styles.textInput}
                onChangeText={(newText) => setTitleInput(newText)}
            />
            <TextInput
                placeholder="Parking Instructions"
                variant="outlined"
                value={instructionInput}
                style={styles.textInput}
                onChangeText={(newText) => setInstructionsInput(newText)}
            />
            <TextInput
                placeholder="Parking Location"
                variant={'outlined'}
                value={locationInput}
                style={styles.textInput}
                onChangeText={(newText) => setLocationInput(newText)}
            />
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', width: '90%' }}>
                <Button title="Edit Parking" color="blue" onPress={onEditParking} />
                <Button style={styles.historyBtn} title="Parking History" color="green" onPress={() => navigation.navigate("Parking History List", { ...route.params })} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center',
        alignItems: 'center'
    },
    header: {
        height: '43%',
        width: '100%'
    },
    headerContent: {
        alignItems: 'center',
    },
    avatar: {
        width: 370,
        height: 240,
        marginTop: 5
    },
    name: {
        fontSize: 22,
        color: '#000000',
        fontWeight: '600',
    },
    statsLabel: {
        fontSize: 14,
        color: '#999999',
        marginTop: 15
    },
    body: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        flexWrap: 'wrap',
        height: '60%',
        width: '100%'
    },
    textInput: {
        width: '70%',
        height: '9%',
        marginBottom: 5,
    },
})