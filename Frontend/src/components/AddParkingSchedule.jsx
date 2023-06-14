import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { Stack, TextInput, IconButton, Button } from "@react-native-material/core";
import * as Location from 'expo-location'
import { View } from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';

export default function AddParkingSchedule({ navigation, route }) {
    const [startTimeSun, setStartTimeSun] = useState(new Date())
    const [endTimeSun, setEndTimeSun] = useState(new Date())
    const [startTimeMon, setStartTimeMon] = useState(new Date())
    const [endTimeMon, setEndTimeMon] = useState(new Date())
    const [startTimeTue, setStartTimeTue] = useState(new Date())
    const [endTimeTue, setEndTimeTue] = useState(new Date())
    const [startTimeWed, setStartTimeWed] = useState(new Date())
    const [endTimeWed, setEndTimeWed] = useState(new Date())
    const [startTimeThu, setStartTimeThu] = useState(new Date())
    const [endTimeThu, setEndTimeThu] = useState(new Date())
    const [startTimeFri, setStartTimeFri] = useState(new Date())
    const [endTimeFri, setEndTimeFri] = useState(new Date())
    const [startTimeSat, setStartTimeSat] = useState(new Date())
    const [endTimeSat, setEndTimeSat] = useState(new Date())

    const saveSchedule = () => {
        const schedule = {
            accessibleStartTimeSun: startTimeSun,
            accessibleEndTimeSun: endTimeSun,
            accessibleStartTimeMon: startTimeMon,
            accessibleEndTimeMon: endTimeMon,
            accessibleStartTimeTue: startTimeTue,
            accessibleEndTimeTue: endTimeTue,
            accessibleStartTimeWed: startTimeWed,
            accessibleEndTimeWed: endTimeWed,
            accessibleStartTimeThu: startTimeThu,
            accessibleEndTimeThu: endTimeThu,
            accessibleStartTimeFri: startTimeFri,
            accessibleEndTimeFri: endTimeFri,
            accessibleStartTimeSat: startTimeSat,
            accessibleEndTimeSat: endTimeSat,
        }

        if(startTimeSun >= endTimeSun || 
            startTimeMon >= endTimeMon || 
            startTimeTue >= endTimeTue || 
            startTimeWed >= endTimeWed || 
            startTimeThu >= endTimeThu || 
            startTimeFri >= endTimeFri || 
            startTimeSat >= endTimeSat) {
                Alert.alert('Failed!', 'Please make sure all start times are before end times')
        } else {
        route.params.setParkingSchedule(schedule)
        navigation.goBack(null)
        }
    }

    useEffect(() => {
        if(route.params.parkingSchedule) {
            setStartTimeSun(route.params.parkingSchedule.accessibleStartTimeSun)
            setEndTimeSun(route.params.parkingSchedule.accessibleEndTimeSun)
            setStartTimeMon(route.params.parkingSchedule.accessibleStartTimeMon)
            setEndTimeMon(route.params.parkingSchedule.accessibleEndTimeMon)
            setStartTimeTue(route.params.parkingSchedule.accessibleStartTimeTue)
            setEndTimeTue(route.params.parkingSchedule.accessibleEndTimeTue)
            setStartTimeWed(route.params.parkingSchedule.accessibleStartTimeWed)
            setEndTimeWed(route.params.parkingSchedule.accessibleEndTimeWed)
            setStartTimeThu(route.params.parkingSchedule.accessibleStartTimeThu)
            setEndTimeThu(route.params.parkingSchedule.accessibleEndTimeThu)
            setStartTimeFri(route.params.parkingSchedule.accessibleStartTimeThu)
            setEndTimeFri(route.params.parkingSchedule.accessibleEndTimeFri)
            setStartTimeSat(route.params.parkingSchedule.accessibleStartTimeSat)
            setEndTimeSat(route.params.parkingSchedule.accessibleEndTimeSat)
        }

    }, [route.params.parkingSchedule])

    return (
        <View style={styles.container}>
            <View style={{ display: 'flex', flexDirection: 'row', width: '80%', marginLeft: '20%', justifyContent: 'space-evenly', alignItems:'center' }}>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>Start</Text>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>End</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', width: '90%', height: '10%', justifyContent: 'space-evenly', alignItems:'center' }}>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                    Sun:
                </Text>
                <RNDateTimePicker
                    mode="time"
                    value={startTimeSun}
                    is24Hour={true}
                    onChange={(e, newDate) => { setStartTimeSun(newDate) }} />
                <RNDateTimePicker
                    mode="time"
                    value={endTimeSun}
                    is24Hour={true}
                    onChange={(e, newDate) => { setEndTimeSun(newDate) }} />
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', width: '90%', height: '10%', justifyContent: 'space-evenly', alignItems:'center' }}>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                    Mon:
                </Text>
                <RNDateTimePicker
                    mode="time"
                    value={startTimeMon}
                    is24Hour={true}
                    onChange={(e, newDate) => { setStartTimeMon(newDate) }} />
                <RNDateTimePicker
                    mode="time"
                    value={endTimeMon}
                    is24Hour={true}
                    onChange={(e, newDate) => { setEndTimeMon(newDate) }} />
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', width: '90%', height: '10%', justifyContent: 'space-evenly', alignItems:'center' }}>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                    Tue:
                </Text>
                <RNDateTimePicker
                    mode="time"
                    value={startTimeTue}
                    is24Hour={true}
                    onChange={(e, newDate) => { setStartTimeTue(newDate) }} />
                <RNDateTimePicker
                    mode="time"
                    value={endTimeTue}
                    is24Hour={true}
                    onChange={(e, newDate) => { setEndTimeTue(newDate) }} />
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', width: '90%', height: '10%', justifyContent: 'space-evenly', alignItems:'center' }}>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                    Wed:
                </Text>
                <RNDateTimePicker
                    mode="time"
                    value={startTimeWed}
                    is24Hour={true}
                    onChange={(e, newDate) => { setStartTimeWed(newDate) }} />
                <RNDateTimePicker
                    mode="time"
                    value={endTimeWed}
                    is24Hour={true}
                    onChange={(e, newDate) => { setEndTimeWed(newDate) }} />
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', width: '90%', height: '10%', justifyContent: 'space-evenly', alignItems:'center' }}>
            <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                    Thu:
                </Text>
                <RNDateTimePicker
                    mode="time"
                    value={startTimeThu}
                    is24Hour={true}
                    onChange={(e, newDate) => { setStartTimeThu(newDate) }} />
                <RNDateTimePicker
                    mode="time"
                    value={endTimeThu}
                    is24Hour={true}
                    onChange={(e, newDate) => { setEndTimeThu(newDate) }} />
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', width: '90%', height: '10%', justifyContent: 'space-evenly', alignItems:'center' }}>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                    Fri:
                </Text>
                <RNDateTimePicker
                    mode="time"
                    value={startTimeFri}
                    is24Hour={true}
                    onChange={(e, newDate) => { setStartTimeFri(newDate) }} />
                <RNDateTimePicker
                    mode="time"
                    value={endTimeFri}
                    is24Hour={true}
                    onChange={(e, newDate) => { setEndTimeFri(newDate) }} />
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', width: '90%', height: '10%', justifyContent: 'space-evenly', alignItems:'center' }}>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                    Sat:
                </Text>
                <RNDateTimePicker
                    mode="time"
                    value={startTimeSat}
                    is24Hour={true}
                    onChange={(e, newDate) => { setStartTimeSat(newDate) }} />
                <RNDateTimePicker
                    mode="time"
                    value={endTimeSat}
                    is24Hour={true}
                    onChange={(e, newDate) => { setEndTimeSat(newDate) }} />
            </View>
            <Button color="blue" title='Save Schedule' onPress={saveSchedule}/>
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
        width: '65%'
    }
})