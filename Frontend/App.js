import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, I18nManager } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Ionicons from '@expo/vector-icons/Ionicons';
import MapBox from './src/components/MapBox';
import Parking from './src/components/Parking';
import Profile from './src/components/Profile';
import AddParking from './src/components/AddParking';
import LoginStackScreen from './src/screens/LoginStackScreen';

import { auth } from './firebase';

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome, {auth.currentUser?.displayName}!</Text>
      <MapBox navigation={navigation} />
      <StatusBar style="auto" />
    </View>
  );
}

I18nManager.allowRTL(false);

export default function App() {
  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    })
    return unsubscribe;
  }, [])
  

  function HomeStackScreen() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Map"
          component={HomeScreen}
        />
        <Stack.Screen
          name="Parking"
          component={Parking}
        />
      </Stack.Navigator>
    );
  }

  const ProfileStackScreen = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Account"
          component={Profile}
        />
        <Stack.Screen
          name="Edit Profile"
          component={AddParking}
        />
        <Stack.Screen
          name="Renting Now"
          component={AddParking}
        />
        <Stack.Screen
          name="Live Rents"
          component={AddParking}
        />
        <Stack.Screen
          name="Parking I've Rented"
          component={AddParking}
        />
        <Stack.Screen
          name="My Parking Spots"
          component={AddParking}
        />
      </Stack.Navigator>
    )
  }

  return (
    <NavigationContainer style={styles.navigator}>
      { !currentUser ?
        <LoginStackScreen />
        :
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'map' : 'map-outline';
              } else if (route.name === 'Account') {
                iconName = focused ? 'person' : 'person-outline';
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#036bfc',
            tabBarInactiveTintColor: 'gray',
            tabBarLabelStyle: {
              fontWeight: 'bold',
              fontSize: 12,
              paddingBottom: 3,
            },
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 27,
            },
            headerStyle: {
              borderBottomWidth: 0.2,
            }
          })}
        >
          <Tab.Screen name="Home" component={HomeStackScreen} />
          <Tab.Screen name="Account" component={ProfileStackScreen} />
        </Tab.Navigator>
      }
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 25,
    width: '100%',
    marginBottom: 15,
    marginLeft: 4
  },
});
