import React, { useEffect, useRef, useState, useCallback } from 'react';
import { StyleSheet, Text, Alert } from 'react-native';
import { Stack, TextInput, IconButton, Button } from "@react-native-material/core";
import * as Location from 'expo-location'
import { View } from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import * as http from '../api/HttpClient'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ParkingSchedule({ navigation, route }) {
    const [startTime, setStartTime] = useState(new Date())
    const [endTime, setEndTime] = useState(new Date())
    const [isCarsDropdownOpen, setIsCarsDropdownOpen] = useState(false);
    const [chosenCar, setChosenCar] = useState(null);
    const [userCars, setUserCars] = useState(route.params.userCars)

    const scheduleParking = async () => {
        if (chosenCar) {
            if (calculateIsBetweenTimes()) {
                const userInfo = JSON.parse(await AsyncStorage.getItem('@user'))

                const newOrder = {
                    parkId: route.params._id,
                    consumerId: userInfo.id,
                    vehicleSerial: chosenCar,
                    timeStart: startTime,
                    timeEnd: endTime,
                    payment: 0,
                    isFinished: false
                }

                const scheduleResult = await http.post("orders/create", newOrder)

                if (scheduleResult == 'OCCUPIED') {
                    Alert.alert("Failed!", "Parking occupied during chosen time! Please try different times")
                } else {
                    Alert.alert("Success!", "Parking scheduled successfully!")
                }
            } else {
                Alert.alert("Failed!", "Please choose a single day and make sure start time is before end time!")
            }
        } else {
            Alert.alert("Failed!", "Please choose a car!")
        }
    }

    const calculateIsBetweenTimes = () => {
        let isBetweenTimes = startTime.getDay() == endTime.getDay() && (startTime.getTime() < endTime.getTime())

        return isBetweenTimes
    }
    const createDropDownValues = () => {
        return userCars.map(car => {
            return {
                label: `${car.serial} ${car.color} ${car.brand}`,
                value: car.serial
            }
        })
    }

    return (
        <View style={styles.container}>
            <View style={{ display: 'flex', flexDirection: 'row', width: '80%', marginLeft: '20%', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Start</Text>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>End</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', width: '90%', height: '6%', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                    Sun:
                </Text>
                <RNDateTimePicker
                    mode="time"
                    value={new Date(route.params.accessibleStartTimeSun)}
                    disabled
                    is24Hour={true}
                />
                <RNDateTimePicker
                    mode="time"
                    value={new Date(route.params.accessibleEndTimeSun)}
                    disabled
                    is24Hour={true}
                />
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', width: '90%', height: '6%', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                    Mon:
                </Text>
                <RNDateTimePicker
                    mode="time"
                    value={new Date(route.params.accessibleStartTimeSun)}
                    disabled
                    is24Hour={true}
                />
                <RNDateTimePicker
                    mode="time"
                    value={new Date(route.params.accessibleEndTimeMon)}
                    disabled
                    is24Hour={true}
                />
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', width: '90%', height: '6%', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                    Tue:
                </Text>
                <RNDateTimePicker
                    mode="time"
                    value={new Date(route.params.accessibleStartTimeTue)}
                    disabled
                    is24Hour={true}
                />
                <RNDateTimePicker
                    mode="time"
                    value={new Date(route.params.accessibleEndTimeTue)}
                    disabled
                    is24Hour={true}
                />
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', width: '90%', height: '6%', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                    Wed:
                </Text>
                <RNDateTimePicker
                    mode="time"
                    value={new Date(route.params.accessibleStartTimeWed)}
                    disabled
                    is24Hour={true}
                />
                <RNDateTimePicker
                    mode="time"
                    value={new Date(route.params.accessibleEndTimeWed)}
                    disabled
                    is24Hour={true}
                />
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', width: '90%', height: '6%', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                    Thu:
                </Text>
                <RNDateTimePicker
                    mode="time"
                    value={new Date(route.params.accessibleStartTimeThu)}
                    disabled
                    is24Hour={true}
                />
                <RNDateTimePicker
                    mode="time"
                    value={new Date(route.params.accessibleEndTimeThu)}
                    disabled
                    is24Hour={true}
                />
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', width: '90%', height: '6%', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                    Fri:
                </Text>
                <RNDateTimePicker
                    mode="time"
                    value={new Date(route.params.accessibleStartTimeFri)}
                    disabled
                    is24Hour={true}
                />
                <RNDateTimePicker
                    mode="time"
                    value={new Date(route.params.accessibleEndTimeFri)}
                    disabled
                    is24Hour={true}
                />
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', width: '90%', height: '6%', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>
                    Sat:
                </Text>
                <RNDateTimePicker
                    mode="time"
                    value={new Date(route.params.accessibleStartTimeSat)}
                    disabled
                    is24Hour={true}
                />
                <RNDateTimePicker
                    mode="time"
                    value={new Date(route.params.accessibleEndTimeSat)}
                    disabled
                    is24Hour={true}
                />
            </View>
            <DropDownPicker
                style={styles.dropdown}
                open={isCarsDropdownOpen}
                value={chosenCar}
                items={createDropDownValues()}
                setOpen={setIsCarsDropdownOpen}
                setValue={setChosenCar}
                setItems={setUserCars}
                placeholder="Select Your Car"
                placeholderStyle={styles.placeholderStyles}
                zIndex={3000}
                zIndexInverse={1000}
            />
            <View style={{ width: '80%', display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: 'grey' }}>Parking Start Time</Text>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: 'grey' }}>Parking End Time</Text>
            </View>
            <View style={{ width: '95%', display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginRight: '6%' }}>
                <RNDateTimePicker
                    mode='datetime'
                    value={startTime}
                    is24Hour={true}
                    onChange={(e, newDate) => { setStartTime(newDate) }} />
                <RNDateTimePicker
                    mode='datetime'
                    value={endTime}
                    is24Hour={true}
                    onChange={(e, newDate) => { setEndTime(newDate) }} />
            </View>
            <Button color="blue" title='Schedule Parking' onPress={scheduleParking} />
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    header: {
        height: '40%',
        width: '100%'
    },
    headerContent: {
        alignItems: 'center',
    },
    avatar: {
        width: 330,
        height: 230,
        marginTop: 10
    },
    name: {
        fontSize: 22,
        color: '#000000',
        fontWeight: '600',
    },
    textInput: {
        width: '100%',
        height: '27%',
        marginBottom: 5,
    },
    timeText: {
        width: '40%',
        height: '90%'
    },
    placeholderStyles: {
        color: "grey",
    },
    btn: {
        height: '40%',
        width: '55%'
    },
    dropdown: {
        width: '65%',
        alignSelf: 'center'
    }
})