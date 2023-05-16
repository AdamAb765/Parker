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

export default function AddParking({ navigation, route }) {
    const onRentParking = async () => {
        let rentParking = true

        //try rent parking

        if (rentParking) {
            Alert.alert('Success!', 'Parking rented successfully')
        } else {
            Alert.alert('Failed!', `Couldnt red parking. Please try again`)
        }
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
            <Button title="Rent Parking" color="blue" onPress={onRentParking} />
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