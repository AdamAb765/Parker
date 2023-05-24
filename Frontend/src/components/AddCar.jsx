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
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddCar({ navigation, route }) {
    const [carName, setCarName] = useState('')
    const [carColor, setColor] = useState('')
    const [carNumber, setCarNumber] = useState('')
    const [carImage, setCarImage] = useState(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setCarImage(result.assets[0].uri)
        }
    };

    const onAddCar = async () => {
        if (carName && carImage && carNumber && carColor) {
            const user = JSON.parse(await AsyncStorage.getItem('@user'));

            const carToAdd = {
                serial: carNumber,
                color: carColor,
                brand: carName,
                ownerId: user.id,
                image: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Skoda_Fabia_IV_IMG_5307.jpg"
            }

            http.post('vehicles/create', carToAdd).then(res => {
                if (res) {
                    Alert.alert('Success!', 'Car added successfully')
                    navigation.goBack(null)
                } else {
                    Alert.alert('Failed!', 'Couldnt add your car, please try again, and make sure your number contains only numbers')
                }
            }).catch(err => Alert.alert('Failed!', 'Couldnt add your car, please try again, and make sure your number contains only numbers'))

        } else {
            Alert.alert('Failed!', 'Please enter all details, including car picture')
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={pickImage}>
                        <Image style={styles.avatar}
                            source={carImage}
                            contentFit='contain'
                            placeholder={require("../../assets/listing_vehicle_placeholder.jpg")} />
                    </TouchableOpacity>
                    <Text style={styles.statsLabel}>Press the car to add a picture!</Text>
                </View>
            </View>
            <TextInput
                placeholder="Car Number"
                variant="outlined"
                style={styles.textInput}
                onChangeText={(newText) => setCarNumber(newText)}
            />
            <TextInput
                placeholder="Car Name (e.g. Skoda Fabia)"
                variant="outlined"
                style={styles.textInput}
                onChangeText={(newText) => setCarName(newText)}
            />
            <TextInput
                placeholder="Car Color"
                variant="outlined"
                style={styles.textInput}
                onChangeText={(newText) => setColor(newText)}
            />
            <Button title="Add Car" color="blue" onPress={onAddCar} />
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
        height: '45%',
        width: '100%'
    },
    headerContent: {
        alignItems: 'center',
    },
    avatar: {
        width: 370,
        height: 220,
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