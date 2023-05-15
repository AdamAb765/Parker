import React, { useEffect, useRef, useState } from 'react';
import MapView, { Callout } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { StyleSheet, Image, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import * as Location from 'expo-location'
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack, TextInput, IconButton, Button } from "@react-native-material/core";
import { CheckBox } from '@rneui/themed'
import axios from 'axios';

export default function AddCar({ navigation, route }) {
    const [useMyLocation, setUseMyLocation] = useState(false)
    const [titleInput, setTitleInput] = useState('')
    const [descriptionInput, setDescriptionInput] = useState('')
    const [locationInput, setLocationInput] = useState('')

    useEffect(() => {
        console.log(navigation)
    }, [navigation.isFocused])

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
        if (titleInput && descriptionInput) {
            let currentLocation

            if (useMyLocation) {
                currentLocation = await getMyLocation()
            } else if (locationInput) {
                currentLocation = await getGeoLocationFromInput()
            }

            if (currentLocation && currentLocation.coords) {
                Alert.alert('Success!', 'Parking added successfully')
            } else {
                Alert.alert('Failed!', `Either this parking spot doesnt exist, or youre not using own location. Please try again`)
            }
        } else {
            Alert.alert('Failed!', 'Please enter all details')
        }
    }
    return (
        <View style={styles.container}>

            <View
                style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                }}
            />

            <TextInput
                placeholder="Parking Title"
                variant="outlined"
                style={styles.textInput}
                onChangeText={(newText) => setTitleInput(newText)}
            />
            <TextInput
                placeholder="Parking Description"
                variant="outlined"
                style={styles.textInput}
                onChangeText={(newText) => setDescriptionInput(newText)}
            />
            <TextInput
                placeholder="Parking Location"
                variant={!useMyLocation ? "outlined" : 'filled'}
                editable={!useMyLocation}
                style={styles.textInput}
                onChangeText={(newText) => setLocationInput(newText)}
            />

            <CheckBox onPress={() => onCheckBoxPress()} checked={useMyLocation} title="Would you like to use your current location?" />

            <Button title="Create Parking" color="blue" onPress={onCreateParking} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%'
    },
    header: {
        fontWeight: 'bold',
        fontSize: 25,
        marginBottom: 15,
    },
    parkingImage: {
        resizeMode: 'cover',
        width: '60%',
        height: '60%'
    },
    textStyle: {
        marginBottom: 5
    },
    textInput: {
        width: '70%',
        height: '10%',
        marginBottom: 5,
    }
});