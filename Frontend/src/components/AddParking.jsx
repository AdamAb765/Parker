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
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as http from '../api/HttpClient'

export default function AddParking({ navigation, route }) {
    //const [useMyLocation, setUseMyLocation] = useState(false)
    const [titleInput, setTitleInput] = useState('')
    const [instructionInput, setInstructionsInput] = useState('')
    const [locationInput, setLocationInput] = useState('')
    const [accessibleStartTime, setAccessibleStartTime] = useState('')
    const [accessibleEndTime, setAccessibleEndTime] = useState('')
    const [price, setPrice] = useState('')
    const [parkingImage, setParkingImage] = useState(null);

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

    const onCheckBoxPress = () => {
        setUseMyLocation(!useMyLocation)
    }

    const getMyLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            return;
        }

        let location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
            enableHighAccuracy: true,
            timeInterval: 5
        })

        return location
    }

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

    const onCreateParking = async () => {
        if (titleInput && instructionInput) {
            let currentLocation

            // if (useMyLocation) {
            //     currentLocation = await getMyLocation()
            // } else if (locationInput) {

            currentLocation = await getGeoLocationFromInput()

            if (currentLocation && currentLocation.coords) {
                const userInfo = JSON.parse(await AsyncStorage.getItem('@user'))
                const newParking = {
                    ownerId: userInfo.id,
                    accessibleStartTime: 'accessibleStartTime',
                    accessibleEndTime: 'accessibleEndTime',
                    price: 5,
                    address: locationInput,
                    longitude: currentLocation.coords.longitude,
                    latitude: currentLocation.coords.latitude,
                    isAvailable: true,
                    cameraName: '',
                    cameraPort: 0,
                    cameraIpAddress: 0
                }

                http.post('parks/create', newParking).then(res => {
                    if (res) {
                        Alert.alert('Success!', 'Parking added successfully')
                        navigation.goBack(null)
                    } else {
                        Alert.alert('Failed!', 'Failed to add parking. Please try again')
                    }
                })

            } else {
                Alert.alert('Failed!', `Either this parking spot doesnt exist, or youre not using own location. Please try again`)
            }
        } else {
            Alert.alert('Failed!', 'Please enter all details')
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
            <TextInput
                placeholder="Parking Title"
                variant="outlined"
                style={styles.textInput}
                onChangeText={(newText) => setTitleInput(newText)}
            />
            <TextInput
                placeholder="Parking Instructions"
                variant="outlined"
                style={styles.textInput}
                onChangeText={(newText) => setInstructionsInput(newText)}
            />
            <TextInput
                placeholder="Parking Location"
                variant={'outlined'}
                //editable={!useMyLocation}
                style={styles.textInput}
                onChangeText={(newText) => setLocationInput(newText)}
            />
            {/* <CheckBox onPress={() => onCheckBoxPress()} checked={useMyLocation} title="Would you like to use your current location?" /> */}
            <Button title="Create Parking" color="blue" onPress={onCreateParking} />
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
        height: 240,
        marginTop: 10
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
        height: '10%',
        marginBottom: 5,
    },
})