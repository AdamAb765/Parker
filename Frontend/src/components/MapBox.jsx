import React, { useEffect, useRef, useState } from 'react';
import MapView, { Callout } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { StyleSheet, Image, Text, TouchableOpacity, Alert } from 'react-native';
import * as Location from 'expo-location'
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Stack, TextInput, IconButton } from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import axios from 'axios'
import * as http from '../api/HttpClient'
import { useIsFocused } from '@react-navigation/native';
import useInterval from '../hooks/useInterval'

export default function MapBox({ navigation }) {
  const [searchInput, setSearchInput] = useState(null)

  const [parkings, setParkings] = useState([])
  const mapRef = useRef(null);

  useEffect(() => {
    updateParkingSpots()
  }, [])


  useInterval(() => {
    updateParkingSpots()
  }, 2500)

  const updateParkingSpots = async () => {
    const parkingSpots = await http.get('parks')

    setParkings(parkingSpots)
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
    });

    return location
  };

  const goToMyLocation = async () => {
    location = await getMyLocation();
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      });
    }
  };

  useEffect(() => {
    (async () => {
      await goToMyLocation();
    })();
  }, []);

  const updateLocation = async () => {
    const searchInputResult = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?&address=${searchInput}&key=AIzaSyCZ-6i7NFhGDzMJl1546n-2EI0laWUc2Hc`)
    const firstSearchResult = searchInputResult.data.results[0]

    if (firstSearchResult && firstSearchResult.geometry) {
      mapRef.current.animateToRegion({
        latitude: firstSearchResult.geometry.location.lat,
        longitude: firstSearchResult.geometry.location.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      })
    } else {
      Alert.alert("Whoops!", "This address doesn't exist. Are you sure it's correct?")
    }
  }

  return (
    <>
      <TextInput
        placeholder="Where would you like to park?"
        variant="outlined"
        style={styles.searchInput}
        onChangeText={(newText) => setSearchInput(newText)}
        trailing={props => (
          <IconButton onPress={updateLocation} icon={props => <Icon name="eye" {...props} />} {...props} />
        )}
      />
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={"google"}
        showsUserLocation
        showsMyLocationButton>
        {parkings.map((marker, index) => (
          <Marker key={index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01
            }}
            icon={require('../../assets/ParkingPin.png')}
          >
            <Callout onPress={() => navigation.navigate('Parking', { ...marker })}>
              <View>
                <Text>{marker.title}</Text>
                <Text>{marker.price} ILS Per Hour</Text>
                <Text>{marker.address}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '80%',
  },
  searchInput: {
    width: '80%',
    height: '10%'
  }
});