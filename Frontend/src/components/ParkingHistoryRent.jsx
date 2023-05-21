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

export default function ParkingHistoryRent({ navigation, route }) {

    const calcMoneyMade = () => {
        return ((Math.abs(route.params.endTime - route.params.startTime) / 36e5) * route.params.price).toFixed(2)
    }

    return (
        <View style={styles.container}>
            <TextInput
                variant={'outlined'}
                editable={false}
                label='Start Time'
                style={styles.textInput}
                value={route.params.startTime.toLocaleString()}
            />
            <TextInput
                variant={'outlined'}
                editable={false}
                style={styles.textInput}
                label='End Time'
                value={route.params.endTime.toLocaleString()}
            />
            <TextInput
                variant={'outlined'}
                editable={false}
                style={styles.textInput}
                label='Renter'
                value={`${route.params.renter.firstName} ${route.params.renter.lastName}`}
            />
            <TextInput
                variant={'outlined'}
                editable={false}
                style={styles.textInput}
                label='Money Made'
                value={calcMoneyMade() + ' ILS'}
            />
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