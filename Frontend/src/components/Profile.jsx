import React, { useEffect, useRef, useState } from 'react';
import MapView, { Callout } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { StyleSheet, Image, Text, TouchableOpacity, Alert } from 'react-native';
import * as Location from 'expo-location'
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack, TextInput, IconButton, Button } from "@react-native-material/core";

export default function Profile({ navigation, route }) {
    useEffect(() => {
        console.log(route)
    }, [route])


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
                onChangeText={(newText) => setSearchInput(newText)}
            />
            <TextInput
                placeholder="Parking Description"
                variant="outlined"
                style={styles.textInput}
                onChangeText={(newText) => setSearchInput(newText)}
            />
            <TextInput
                placeholder="Parking Location (leave empty if want to use current location)"
                variant="outlined"
                style={styles.textInput}
                onChangeText={(newText) => setSearchInput(newText)}
            />
            <Button title="Create Parking" color="blue" onPress={() => Alert.alert("Success!", "Parking Created!")} />
        </View>
    );
}

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

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
        marginBottom: 5
    }
});