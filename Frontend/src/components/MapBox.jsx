import React, { useEffect, useRef, useState } from 'react';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { StyleSheet, Image } from 'react-native';
import * as Location from 'expo-location'


export default function MapBox() {
  
  const [myLocation, setMyLocation] = useState(null);
  const [markers, setMarkers] = useState([{ // Places around the michlala
    title: "Parking 1",
    description: "20ILS per hour",
    coordinate: {
      latitude: 31.970186,
      longitude: 34.770633,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    }
   }, {
    title: "Parking 2",
    description: "15ILS per hour",
    coordinate: {
      latitude: 31.970040,
      longitude: 34.773360,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    }
  }])
  const mapRef = useRef(null);

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
    setMyLocation(location);
    return location
  };
  const goToMyLocation = async () => {
    location = await getMyLocation();
    if (location) {
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

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      showsUserLocation
      showsMyLocationButton>
        {markers.map((marker, index) => (
          <Marker key={index}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
            icon={require('../../assets/ParkingPin.png')}
          />
        ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '70%',
  },
});