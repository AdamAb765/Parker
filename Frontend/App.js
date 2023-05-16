import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, I18nManager, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Ionicons from '@expo/vector-icons/Ionicons';
import MapBox from './src/components/MapBox';
import Parking from './src/components/Parking';
import Profile from './src/components/Profile';
import AddParking from './src/components/AddParking';
import MyCars from './src/components/MyCars';
import MyParkingSpots from './src/components/MyParkingSpots';
import RentingHistory from './src/components/RentingHistory';
import AddCar from './src/components/AddCar';
import MyCar from './src/components/MyCar';
import MyParking from './src/components/MyParking';

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome, Moshe!</Text>
      <MapBox navigation={navigation} />
      <StatusBar style="auto" />
    </View>
  );
}

I18nManager.allowRTL(false);

export default function App() {
  const Tab = createBottomTabNavigator();
  const HomeStack = createNativeStackNavigator();
  const ProfileStack = createNativeStackNavigator();

  function HomeStackScreen() {
    return (
      <HomeStack.Navigator>
        <HomeStack.Screen
          options={{ headerShown: false }}
          name="Map"
          component={HomeScreen}
        />
        <HomeStack.Screen
          name="Parking"
          component={Parking}
        />
      </HomeStack.Navigator>
    );
  }

  const ProfileStackScreen = () => {
    return (
      <ProfileStack.Navigator>
        <ProfileStack.Screen
          options={{ headerShown: false }}
          name="Account"
          component={Profile}
        />
        <ProfileStack.Screen
          name="Edit Profile"
          component={AddParking}
        />
        <ProfileStack.Screen
          name="My Cars"
          component={MyCars}
        />
        <ProfileStack.Screen
          name="Add Car"
          component={AddCar}
        />
        <ProfileStack.Screen
          name="Add Parking"
          component={AddParking}
        />
        <ProfileStack.Screen
          name="My Parking Spots"
          component={MyParkingSpots}
        />
        <ProfileStack.Screen
          name="My Parking"
          component={MyParking}
        />
        <ProfileStack.Screen
          name="Rent History"
          component={RentingHistory}
        />
        <ProfileStack.Screen
          name="Car"
          component={MyCar}
        />
      </ProfileStack.Navigator>
    )
  }

  return (
    <NavigationContainer style={styles.navigator}>
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