import React, { useState } from 'react';
import { Stack, TextInput, Button, IconButton } from "@react-native-material/core";
import { StyleSheet, Text, View, Alert, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from '../../firebase';

import { useTogglePasswordVisibility } from '../hooks/useTogglePasswordVisibility';

export default function SignUpScreen({ navigation }) {
    const [emailInput, setEmailInput] = useState('');
    const [nameInput, setNameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [secondPasswordInput, setSecondPasswordInput] = useState('');

    const firstPasswordToggle = useTogglePasswordVisibility();
    const secondPasswordToggle = useTogglePasswordVisibility();
    const onSignUpSubmit = async () => {

        if (nameInput && emailInput && passwordInput && secondPasswordInput) {
            if (passwordInput != secondPasswordInput) {
                Alert.alert('Failed!', 'Your passwords are not the same!');
            } else {
                await createUserWithEmailAndPassword(auth, emailInput, passwordInput)
                .then(async (userCredential) => {
                    console.log("User signed up!");
                })
                .catch((error) => {
                    Alert.alert('Failed!', `${error.message}`);
                });
                
                await auth.onAuthStateChanged(async (user) => {
                    if (user) {
                        await updateProfile(user, {
                            displayName: nameInput,
                        }).then(() => {
                            navigation.navigate('Login');
                        }).catch((error) => {
                            Alert.alert('Failed!', `${error.message}`);
                        }); 
                    } else {
                        console.log("oof");
                    }
                });
            }
        } else {
            Alert.alert('Failed!', 'Please enter all details!');
        }
    }

    return (
    <View style={styles.container}>
        <Image
            style={styles.logo}
            source={require("../../assets/ParkerLogo.png")}
            resizeMode='contain'
        />
        <TextInput
            placeholder="Name"
            variant="outlined"
            color='#2194ED'
            style={styles.textInput}
            onChangeText={(newText) => setNameInput(newText)}
        />
        <TextInput
            placeholder="Email"
            variant="outlined"
            color='#2194ED'
            style={styles.textInput}
            onChangeText={(newText) => setEmailInput(newText)}
        />
        <TextInput
            placeholder="Password"
            variant="outlined"
            color='#2194ED'
            secureTextEntry={firstPasswordToggle.passwordVisibility}
            style={styles.textInput}
            onChangeText={(newText) => setPasswordInput(newText)}
            trailing={props => (
                <IconButton
                    onPress={firstPasswordToggle.handlePasswordVisibility}
                    icon={props => 
                        <MaterialCommunityIcons name={firstPasswordToggle.visibleIcon} size={22} {...props} />
                    }
                {...props} 
                />
            )}
        />
        <TextInput
            placeholder="Password Again"
            variant="outlined"
            color='#2194ED'
            secureTextEntry={secondPasswordToggle.passwordVisibility}
            style={styles.textInput}
            onChangeText={(newText) => setSecondPasswordInput(newText)}
            trailing={props => (
                <IconButton
                    onPress={secondPasswordToggle.handlePasswordVisibility}
                    icon={props => 
                        <MaterialCommunityIcons name={secondPasswordToggle.visibleIcon} size={22} {...props} />
                    }
                {...props} 
                />
            )}
        />

        <Button title="Sign Up" color="#2194ED" tintColor='white' style={styles.loginButton} onPress={onSignUpSubmit} />
        <Button
            title="Actually, I do have an account..."
            color="#2194ED"
            variant='text'
            uppercase={false}
            onPress={() => navigation.navigate('Login')}
        />
    </View>
    );
  }


  const styles = StyleSheet.create({
    logo: {
        maxHeight: '10%',
        marginBottom: '20%',
        marginTop: '10%'
    },
    loginButton: {
        marginBottom: '3%'
    },
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
    textInput: {
        width: '70%',
        marginBottom: 10,
    },
  });