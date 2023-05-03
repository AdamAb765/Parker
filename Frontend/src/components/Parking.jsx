import React, { useEffect, useRef, useState } from 'react';
import MapView, { Callout } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { StyleSheet, Image, Text, TouchableOpacity, Alert } from 'react-native';
import * as Location from 'expo-location'
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button } from "@react-native-material/core";

export default function Parking({ navigation, route }) {
    useEffect(() => {
        console.log(route)
    }, [route])


    return (
        <View style={styles.container}>
            <Text style={styles.header}>{route.params.title}</Text>

            <View
                style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                }}
            />

            <Text style={styles.textStyle}>{route.params.description}</Text>
            <Image style={styles.parkingImage} source={{ uri: "https://images.seattletimes.com/wp-content/uploads/2022/06/06032022_parking-spot_1650002.jpg?d=1560x1170" }} />
            <Text style={styles.textStyle}>Price: 15 ILS per hour</Text>
            <Text style={styles.textStyle}>Owner: Adam Abraham</Text>
            <Text style={styles.textStyle}>Contact: 0521234567</Text>
            <Text style={styles.textStyle}>Location: Rotschild 36 Tel Aviv</Text>
            <Text style={styles.textStyle}>Parking Instructions: Call when reached parking</Text>
            <Button title="Rent Parking" color="blue" onPress={() => Alert.alert("Success!", "Parking rented!")} />
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
        marginBottom: 15,
    },
    parkingImage: {
        resizeMode: 'cover',
        width: '60%',
        height: '60%'
    },
    textStyle: {
        marginBottom: 5
    }
});