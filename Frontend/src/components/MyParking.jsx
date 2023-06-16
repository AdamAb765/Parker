import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { View } from 'react-native';
import { Stack, TextInput, IconButton, Button } from "@react-native-material/core";
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as http from '../api/HttpClient'
import RNDateTimePicker from '@react-native-community/datetimepicker';
import NumericInput from 'react-native-numeric-input';

export default function MyParking({ navigation, route }) {
    const [titleInput, setTitleInput] = useState(route.params.title)
    const [instructionInput, setInstructionsInput] = useState(route.params.instructions)
    const [locationInput, setLocationInput] = useState(route.params.address)
    const [parkingSchedule, setParkingSchedule] = useState({
        accessibleStartTimeSun: new Date(route.params.accessibleStartTimeSun),
        accessibleEndTimeSun: new Date(route.params.accessibleEndTimeSun),
        accessibleStartTimeMon: new Date(route.params.accessibleStartTimeMon),
        accessibleEndTimeMon: new Date(route.params.accessibleEndTimeMon),
        accessibleStartTimeTue: new Date(route.params.accessibleStartTimeTue),
        accessibleEndTimeTue: new Date(route.params.accessibleEndTimeTue),
        accessibleStartTimeWed: new Date(route.params.accessibleStartTimeWed),
        accessibleEndTimeWed: new Date(route.params.accessibleEndTimeWed),
        accessibleStartTimeThu: new Date(route.params.accessibleStartTimeThu),
        accessibleEndTimeThu: new Date(route.params.accessibleEndTimeThu),
        accessibleStartTimeFri: new Date(route.params.accessibleStartTimeFri),
        accessibleEndTimeFri: new Date(route.params.accessibleEndTimeFri),
        accessibleStartTimeSat: new Date(route.params.accessibleStartTimeSat),
        accessibleEndTimeSat: new Date(route.params.accessibleEndTimeSat),
    })
    const [price, setPrice] = useState(route.params.price)
    const [parkingImage, setParkingImage] = useState();

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Image,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            allowsMultipleSelection: false,
        });

        if (!result.canceled) {
            setParkingImage(result.assets[0])
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

    const getMimeType = (extension) => {
        const mimeTypes = {
          jpg: 'image/jpeg',
          jpeg: 'image/jpeg',
          png: 'image/png',
        };
        return mimeTypes[extension];
      }

    const onEditParking = async () => {
        if (titleInput && instructionInput && parkingSchedule &&
            (price != 0) && locationInput) {
            let currentLocation

            currentLocation = await getGeoLocationFromInput()

            if (currentLocation && currentLocation.coords) {
                const userInfo = JSON.parse(await AsyncStorage.getItem('@user'))

                const editedParking = {
                    _id: route.params._id,
                    ownerId: userInfo.id,
                    title: titleInput,
                    instructions: instructionInput,
                    price: price,
                    address: locationInput,
                    imagePath: route.params.imagePath,
                    longitude: currentLocation.coords.longitude,
                    latitude: currentLocation.coords.latitude,
                    isAvailable: true,
                    cameraName: '',
                    cameraPort: 0,
                    cameraIpAddress: 0,
                    ...parkingSchedule
                }
                http.put(`parks/${route.params._id}`, editedParking).then(res => {
                    if (!res) {
                        Alert.alert('Failed!', 'Failed to edit parking. Please try again')
                        return;
                    }
                });
                
                if (parkingImage) {
                    let formData = new FormData();
                    const mimeType = getMimeType(parkingImage.uri.split('.').pop());
                    formData.append('image', {
                        uri: parkingImage.uri,
                        type: mimeType,
                        name: parkingImage.uri.split('/').pop(),
                    });
                    await http.put(`parks/${route.params._id}/image`, formData, {
                        'Content-Type': 'multipart/form-data',
                      }).then(res => {
                        if (!res) {
                            Alert.alert('Failed!', 'Failed to edit parking. Please try again')
                        }
                    })
                }
                Alert.alert('Success!', 'Parking edited successfully')
                navigation.goBack(null)
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
                        {parkingImage ?
                            <Image style={styles.avatar}
                                resizeMode='contain'
                                source={{uri:parkingImage.uri}}
                            />
                            :
                            <Image style={styles.avatar}
                                resizeMode='contain'
                                source={{uri:`${http.get_url()}/parks/image/${route.params.imagePath}`}}
                            />
                        }
                    </TouchableOpacity>
                    <Text style={styles.statsLabel}>Press the pin to add a picture!</Text>
                </View>
            </View>
            <Button color="orange" style={{ marginTop: 15, marginBottom: 15 }} title="Edit Parking Schedule" onPress={() => navigation.navigate('Add Parking Schedule', { parkingSchedule, setParkingSchedule })} />

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
                value={titleInput}
                onChangeText={(newText) => setTitleInput(newText)}
            />
            <TextInput
                placeholder="Parking Instructions"
                variant="outlined"
                style={styles.textInput}
                value={instructionInput}
                onChangeText={(newText) => setInstructionsInput(newText)}
            />
            <TextInput
                placeholder="Parking Location"
                variant={'outlined'}
                style={styles.textInput}
                value={locationInput}
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
        height: '20%',
        width: '100%',
        marginBottom: 20
    },
    headerContent: {
        alignItems: 'center',
    },
    avatar: {
        minWidth: '50%',
        maxWidth: '100%',
        height: '100%',
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