import React, { useEffect, useState } from "react";
import {
  Stack,
  TextInput,
  Button,
  IconButton,
} from "@react-native-material/core";
import { StyleSheet, View, Alert, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as http from "../api/HttpClient";

import { useTogglePasswordVisibility } from "../hooks/useTogglePasswordVisibility";
import { auth } from "../../firebase";

export default function LoginScreen({ navigation }) {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const { passwordVisibility, visibleIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();

  const tryInitialLogin = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('@user'));
    
    if(user && user.email && user.password) {
      onLoginSubmit(user.email, user.password)
    }
  }

  useEffect(() => {
    tryInitialLogin()
  }, []);

  const onLoginSubmit = async (email, password) => {
    if (email && password) {
      await signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const userInfo = await http.get(`users/byEmail/${email}`);
          await AsyncStorage.setItem("@user", JSON.stringify(userInfo));
        })
        .catch((error) => {
          Alert.alert("Failed!", `${error.message}`);
        });
    } else {
      Alert.alert("Failed!", "Please enter all details");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../../assets/ParkerLogo.png")}
        resizeMode="contain"
      />
      <TextInput
        placeholder="Email"
        variant="outlined"
        color="#2194ED"
        style={styles.textInput}
        onChangeText={(newText) => setEmailInput(newText)}
      />
      <TextInput
        placeholder="Password"
        variant="outlined"
        color="#2194ED"
        secureTextEntry={passwordVisibility}
        style={styles.textInput}
        onChangeText={(newText) => setPasswordInput(newText)}
        trailing={(props) => (
          <IconButton
            onPress={handlePasswordVisibility}
            icon={(props) => (
              <MaterialCommunityIcons name={visibleIcon} size={22} {...props} />
            )}
            {...props}
          />
        )}
      />

      <Button
        title="Login"
        color="#2194ED"
        tintColor="white"
        style={styles.loginButton}
        onPress={() => onLoginSubmit(emailInput, passwordInput)}
      />
      <Button
        title="Sign Up"
        color="blue"
        tintColor="white"
        onPress={() => navigation.navigate("Sign Up")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    maxHeight: "10%",
    marginBottom: "20%",
    marginTop: "-80%",
  },
  loginButton: {
    marginBottom: "3%",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontWeight: "bold",
    fontSize: 25,
    width: "100%",
    marginBottom: 15,
    marginLeft: 4,
  },
  textInput: {
    width: "70%",
    marginBottom: 10,
  },
});
