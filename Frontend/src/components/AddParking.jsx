import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Alert, Image, KeyboardAvoidingView, Keyboard } from 'react-native';
import { View } from 'react-native';
import { Stack, TextInput, IconButton, Button } from "@react-native-material/core";
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as http from '../api/HttpClient'
import RNDateTimePicker from '@react-native-community/datetimepicker';
import NumericInput from 'react-native-numeric-input';

export default function AddParking({ navigation, route }) {
    const [titleInput, setTitleInput] = useState('')
    const [instructionInput, setInstructionsInput] = useState('')
    const [locationInput, setLocationInput] = useState('')
    const [price, setPrice] = useState(0)
    const [parkingImage, setParkingImage] = useState(null);
    const [parkingSchedule, setParkingSchedule] = useState(null)
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', () => {
            setIsKeyboardOpen(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', () => {
            setIsKeyboardOpen(false);
        });

        // Clean up listeners
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Image,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                setParkingImage(result.assets[0])
            }
        } catch (e) {
            console.log(e)
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

    const onCreateParking = async () => {
        if (titleInput && instructionInput && (price != 0) &&
            locationInput && parkingImage && parkingSchedule) {
            let currentLocation

            currentLocation = await getGeoLocationFromInput()

            if (currentLocation && currentLocation.coords) {
                const userInfo = JSON.parse(await AsyncStorage.getItem('@user'))

                const newParking = {
                    ownerId: userInfo.id,
                    title: titleInput,
                    instructions: instructionInput,
                    price: price,
                    address: locationInput,
                    longitude: currentLocation.coords.longitude,
                    latitude: currentLocation.coords.latitude,
                    isAvailable: true,
                    cameraName: '',
                    cameraPort: 0,
                    cameraIpAddress: 0,
                    ...parkingSchedule
                }
                let formData = new FormData();
                formData.append('image', {
                    uri: parkingImage.uri,
                    type: 'image/jpeg',
                    name: parkingImage.uri.split('/').pop(),
                });
                for (let key in newParking) {
                    formData.append(key, newParking[key]);
                }

                http.post('parks/create', formData, {
                    'Content-Type': 'multipart/form-data',
                }).then(res => {
                    if (res) {
                        route.params.getMyParkingSpots()
                        Alert.alert('Success!', 'Parking added successfully')
                        navigation.goBack(null)
                    } else {
                        Alert.alert('Failed!', 'Failed to add parking. Please try again')
                    }
                }).catch((e) => console.log(e));
            } else {
                Alert.alert('Failed!', `Either this parking spot doesnt exist, or youre not using own location. Please try again`)
            }
        } else {
            Alert.alert('Failed!', 'Please make sure you filled all the fields, price, picture, and added a parking schedule')
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {isKeyboardOpen ? null
                :
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <TouchableOpacity onPress={pickImage}>
                            {parkingImage ?
                                <Image style={styles.avatar}
                                    resizeMode='contain'
                                    source={{ uri: parkingImage.uri ? parkingImage.uri : parkingImage }}
                                    placeholder={require("../../assets/listing_parking_placeholder.png")}
                                />
                                :
                                <Image style={styles.avatar}
                                    resizeMode='contain'
                                    source={require("../../assets/listing_parking_placeholder.png")}
                                />
                            }
                        </TouchableOpacity>
                        {parkingImage ? null : <Text style={styles.statsLabel}>Press the pin to add a picture!</Text>}
                    </View>
                </View>
            }

            <Button color="orange" style={{ marginTop: 15, marginBottom: 15 }} title="Add Parking Schedule" onPress={() => navigation.navigate('Add Parking Schedule', { parkingSchedule, setParkingSchedule })} />

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
                style={styles.textInput}
                onChangeText={(newText) => setLocationInput(newText)}
            />
            <Button title="Create Parking" color="blue" onPress={onCreateParking} />
        </KeyboardAvoidingView>
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