import React, { useEffect, useRef, useState } from 'react';
import MapView, { Callout } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { StyleSheet, Image, Text, TouchableOpacity, Alert } from 'react-native';
import { Switch } from 'react-native-switch';
import * as Location from 'expo-location'
import { View, ScrollView } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Stack, TextInput, IconButton, Button } from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import axios from 'axios'
import * as http from '../api/HttpClient'
import { useIsFocused } from '@react-navigation/native';
import useInterval from '../hooks/useInterval'
import { faPingPongPaddleBall } from '@fortawesome/free-solid-svg-icons';

export default function MapBox({ navigation }) {
  const [searchInput, setSearchInput] = useState(null)

  const [currentLocation, setCurrentLocation] = useState(null);
  const [showMap, setShowMap] = useState(true);

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

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const toRad = value => (value * Math.PI) / 180;

  const findClosestParkings = () => {
    if (currentLocation) {
      const sortedParkings = parkings.sort((parkingA, parkingB) => {
        const distanceA = calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          parkingA.latitude,
          parkingA.longitude
        );
        const distanceB = calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          parkingB.latitude,
          parkingB.longitude
        );

        return distanceA - distanceB;
      });

      return sortedParkings;
    }
    return [];
  };

  const closestParkings = findClosestParkings();

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

  const animateToCurrentLocation = () => {
    if (mapRef.current && currentLocation) {
      mapRef.current.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      });
    }
  }

  const goToMyLocation = async () => {
    location = await getMyLocation();
    if (location && mapRef.current) {
      const { latitude, longitude } = location.coords;
      setCurrentLocation({ latitude, longitude });
      animateToCurrentLocation();
    }
  };

  useEffect(() => {
    animateToCurrentLocation()
  }, [currentLocation])

  useEffect(() => {
    (async () => {
      await goToMyLocation();
    })();
  }, []);

  const toggleView = () => {
    setShowMap(!showMap);
  };

  const updateLocation = async () => {
    const searchInputResult = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?&address=${searchInput}&key=AIzaSyCZ-6i7NFhGDzMJl1546n-2EI0laWUc2Hc`)
    const firstSearchResult = searchInputResult.data.results[0]

    if (firstSearchResult && firstSearchResult.geometry) {
      const { lat, lng } = firstSearchResult.geometry.location;
      setCurrentLocation({ latitude: lat, longitude: lng });
    } else {
      Alert.alert("Whoops!", "This address doesn't exist. Are you sure it's correct?")
    }
  }

  return (
    <>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '92%', height: '10%' }}>
        <TextInput
          placeholder="Where would you like to park?"
          variant="outlined"
          style={styles.searchInput}
          onChangeText={(newText) => setSearchInput(newText)}
          trailing={props => (
            <IconButton onPress={updateLocation} icon={props => <Icon name="eye" {...props} />} {...props} />
          )}
        />
        <View style={{ paddingTop: 12 }}>
          <Switch
            onValueChange={toggleView}
            disabled={false}
            activeText={'Map'}
            inActiveText={'List'}
            backgroundActive={'gray'}
            backgroundInactive={'gray'}
            circleActiveColor={'#000000'}
            circleInActiveColor={'#000000'}
            value={showMap}
          />
        </View>
      </View>
      {showMap ? (
        <View style={{ width: '100%', height: '80%', position: 'relative' }}>
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={"google"}
            showsUserLocation={true}
            initialRegion={{
              latitude: currentLocation?.latitude || 0,
              longitude: currentLocation?.longitude || 0,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01
            }}
          >
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
          <IconButton style={{ position: 'absolute', zIndex: 999, bottom: 20, right: 20, width: '15%', backgroundColor: 'white', borderWidth: 1 }} onPress={goToMyLocation}
            icon={props => <Icon size={40} name="target" />} />
        </View>
      ) : (
        <View style={styles.parkingList}>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.body}>
            {closestParkings.map((marker, index) => (
              <TouchableOpacity style={{width: '100%'}} key={index} onPress={() => navigation.navigate('Parking', { ...marker })} >
                <View style={styles.parkingListItem} >
                  <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', paddingBottom: 5 }}>{marker.title}</Text>
                  <Text>{marker.address}</Text>
                  <Text >{marker.price} ILS Per Hour</Text>
                  <Text >Distance: {calculateDistance(currentLocation.latitude, currentLocation.longitude, marker.latitude, marker.longitude).toFixed(2)} KM</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
  searchInput: {
    width: '80%',
    height: '10%'
  },
  parkingList: {
    width: '95%',
    height: '80%',
  },
  parkingListItem: {
    marginTop: 5,
    padding: 8,
    borderWidth: 2,
    borderColor: '#20232a',
    borderRadius: 6,
    backgroundColor: '#bfd5db',
  },
  body: {
    alignItems: 'center',
    padding: 15,
    flexDirection: 'column',
    flexWrap: 'wrap',
},
});