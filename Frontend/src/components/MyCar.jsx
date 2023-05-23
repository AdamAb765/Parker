import React, { useEffect, useRef, useState } from 'react';
import MapView, { Callout } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import * as Location from 'expo-location'
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button, TextInput } from "@react-native-material/core";
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';

export default function MyCar({ navigation, route }) {
    const [carName, setCarName] = useState(route.params.brand)
    const [carColor, setColor] = useState(route.params.color)
    const [carNumber, setCarNumber] = useState(route.params.serial)
    const [carImage, setCarImage] = useState(route.params.imageUrl);

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

    const onEditCar = () => {
        if (carName && carImage && carNumber && carColor) {
            Alert.alert('Success!', 'Car info edited successfully')
            //try add to db
            navigation.goBack()
        } else {
            Alert.alert('Failed!', 'Please enter all details, including car picture')
        }
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity  style={styles.carImageHolder} onPress={pickImage}>
                <Image style={styles.carImage}
                    source={carImage}
                    contentFit='fill'
                    placeholder={require('../../assets/listing_vehicle_placeholder.jpg')} />
            </TouchableOpacity>
            <Text style={styles.statsLabel}>Press the car to edit its picture!</Text>
            <TextInput
                placeholder="Car Name"
                variant="outlined"
                style={styles.textInput}
                value={carName}
                onChangeText={(newText) => setCarName(newText)}
            />
            <TextInput
                placeholder="Car Number"
                variant="outlined"
                style={styles.textInput}
                value={String(carNumber)}
                onChangeText={(newText) => setCarNumber(newText)}
            />
            <TextInput
                placeholder="Car Color"
                variant="outlined"
                style={styles.textInput}
                value={carColor}
                onChangeText={(newText) => setColor(newText)}
            />

            <Button title="Update Car Info" color="blue" onPress={onEditCar} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%'
    },
    header: {
        fontWeight: 'bold',
        fontSize: 25,
        marginBottom: 5,
    },
    carImageHolder: {
        width: '90%',
        height: '50%',
        marginBottom: 10
    },
    carImage: {
        resizeMode: 'cover',
        width: '100%',
        height: '100%',
    },
    textStyle: {
        marginBottom: 5
    },
    textInput: {
        width: '70%',
        height: '10%',
        marginBottom: 5,
    },
    statsLabel: {
        fontSize: 14,
        color: '#999999',
        marginTop: 5,
        marginBottom: 10
    },
});