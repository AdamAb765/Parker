import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import { View } from "react-native";
import axios from "axios";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";

export default function Profile({ navigation, route }) {
  const [useMyLocation, setUseMyLocation] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [locationInput, setLocationInput] = useState("");

  const HomeStack = createNativeStackNavigator();

  const HomeStackScreen = () => {
    return (
      <HomeStack.Navigator>
        <HomeStack.Screen
          options={{ headerShown: false }}
          name="Map"
          component={HomeScreen}
        />
        <HomeStack.Screen name="Parking" component={Parking} />
      </HomeStack.Navigator>
    );
  };

  const onCheckBoxPress = () => {
    setUseMyLocation(!useMyLocation);
  };

  const getMyLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
      enableHighAccuracy: true,
      timeInterval: 5,
    });

    return location;
  };

  const getGeoLocationFromInput = async () => {
    const searchInputResult = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?&address=${locationInput}&key=AIzaSyCZ-6i7NFhGDzMJl1546n-2EI0laWUc2Hc`
    );
    const firstSearchResult = searchInputResult.data.results[0];

    let locationToReturn = null;

    if (firstSearchResult && firstSearchResult.geometry) {
      locationToReturn = {
        coords: {
          latitude: firstSearchResult.geometry.location.lat,
          longitude: firstSearchResult.geometry.location.lng,
        },
      };
    }

    return locationToReturn;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image
            style={styles.avatar}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/6596/6596121.png",
            }}
          />
          <Text style={styles.name}>{auth.currentUser?.displayName}</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statsBox}>
              <Text style={styles.statsLabel}>
                What would you like to do today?
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.body}>
        {/* <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Edit Profile')}>
                    <View style={styles.optionBody}>
                        <Text adjustsFontSizeToFit
                            style={styles.optionText}>Edit Profile</Text>
                        <Icon name="chevron-right" size={24} />
                    </View>
                </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate("My Cars")}
        >
          <View style={styles.optionBody}>
            <Text adjustsFontSizeToFit style={styles.optionText}>
              My Cars
            </Text>
            <Icon name="chevron-right" size={24} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate("My Parking Spots")}
        >
          <View style={styles.optionBody}>
            <Text adjustsFontSizeToFit style={styles.optionText}>
              My Parking Spots
            </Text>
            <Icon name="chevron-right" size={24} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate("Rent History")}
        >
          <View style={styles.optionBody}>
            <Text adjustsFontSizeToFit style={styles.optionText}>
              Rent History
            </Text>
            <Icon name="chevron-right" size={24} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={{ ...styles.option, marginTop: 30 }} onPress={async () => {
          await AsyncStorage.removeItem("@user");
          signOut(auth)
        }}>
          <View style={styles.optionBody}>
            <Text adjustsFontSizeToFit style={styles.logOutText}>
              Log Out
            </Text>
            <Icon name="chevron-right" size={24} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignContent: "center",
    alignItems: "center",
  },
  option: {
    width: "100%",
    height: "20%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: "1px",
    borderColor: "#a4adba",
  },
  optionBody: {
    width: "80%",
    color: "#999999",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionText: {
    fontSize: 20,
    color: "#6a717d",
  },
  logOutText: {
    fontSize: 22,
    color: "#ff0000",
  },
  header: {
    backgroundColor: "#fff",
    alignItems: "center",
    height: "30%",
    width: "100%",
  },
  headerContent: {
    alignItems: "center",
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    color: "#000000",
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  statsBox: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  statsCount: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  statsLabel: {
    fontSize: 14,
    color: "#999999",
  },
  body: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    height: "60%",
    width: "100%",
  },
});
