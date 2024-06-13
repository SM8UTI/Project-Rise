import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState({
    emailError: "",
    passwordError: "",
    error: "",
  });
  const [isTyping, setIsTyping] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (value) => {
    setIsTyping(true);
    setData({ ...data, email: value });
    setError({
      ...error,
      emailError: validateEmail(value)
        ? ""
        : "Please enter a valid email address.",
    });
  };

  const handleSubmit = () => {
    // Check if email and password are present
    setLoading(true);
    if (!data.email || !data.password) {
      setError({
        emailError: !data.email ? "Please enter your email address." : "",
        passwordError: !data.password ? "Please enter your password." : "",
      });
      setLoading(false);
      return;
    }

    // Check if email is valid
    if (!validateEmail(data.email)) {
      setError({
        emailError: "Please enter a valid email address.",
        passwordError: "",
      });
      setLoading(false);
      return;
    }

    // Proceed with form submission
    console.log("Email:", data.email);
    console.log("Password:", data.password);
    Alert.alert(`Form submitted successfully! ${data.email} ${data.password}`);
    router.push("Parent/home");
    // Reset error state
    setLoading(false);
    setError({
      emailError: "",
      passwordError: "",
    });
  };

  return (
    <SafeAreaView className="bg-white pt-12 w-full h-full flex items-center justify-center">
      <View className="w-full flex items-center justify-center">
        <Image
          source={require("../../assets/icons/studentGroup.png")}
          className="w-full object-center object-contain"
        />
      </View>
      <View className="flex flex-col items-center justify-center gap-2 mt-6">
        <Text className="text-3xl text-black  font-primary font-bold">
          Parent Login
        </Text>
        <Text className="text-sm w-2/3 text-text text-center  font-primary font-normal">
          Enter your credentials to login and access your account.
        </Text>
      </View>
      <View className="mt-4 px-6 flex flex-col gap-4 w-full lg:max-w-[400px]">
        <View className="bg-input flex flex-row items-center rounded-md overflow-hidden">
          <View className="w-12 h-12 flex items-center justify-center">
            <MaterialIcons name="email" size={20} color="blue" />
          </View>
          <TextInput
            placeholder="Email Address"
            value={data.email}
            onChangeText={(value) => {
              handleEmailChange(value);
            }}
            className="font-primary  h-12 px-2 bg-input focus:outline-none placeholder:font-primary font-semibold placeholder:text-text w-full"
          />
        </View>
        {error.emailError ? (
          <Text className="font-primary text-sm bg-red-50 text-red-500 p-2 py-1 rounded-sm overflow-hidden">
            Error : {error.emailError}
          </Text>
        ) : null}
        <View className="bg-input flex flex-row items-center rounded-md overflow-hidden ">
          <View className="w-12 h-12 flex items-center justify-center">
            <MaterialIcons name="password" size={20} color="blue" />
          </View>
          <TextInput
            placeholder="Password"
            value={data.password}
            onChangeText={(value) => {
              setError({ ...error, passwordError: "" });
              setData({
                ...data,
                password: value,
              });
            }}
            secureTextEntry={true}
            className="font-primary  h-12 px-2 bg-input focus:outline-none placeholder:font-primary font-semibold placeholder:text-text w-full"
          />
        </View>
        {error.passwordError ? (
          <Text className="font-primary text-sm bg-red-50 text-red-500 p-2 py-1 rounded-sm overflow-hidden">
            Error : {error.passwordError}
          </Text>
        ) : null}
        <View className="flex pt-4">
          <Pressable
            onPress={handleSubmit}
            style={({ pressed }) => [
              {
                backgroundColor: pressed
                  ? "rgba(27, 68, 255, 0.5)"
                  : "transparent",
              },
              {
                borderRadius: 999, // Adjust the value to your preference
              },
            ]}
            disabled={loading}
          >
            <LinearGradient
              colors={colors.gr1}
              className="px-6 h-12 rounded-lg w-full flex items-center justify-center"
            >
              <Text className="text-primary text-lg font-primary font-semibold text-white text-center w-full">
                {
                  // Show loading indicator if loading
                  loading ? "Loading..." : "Sign in"
                }
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
    // <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    //   <Text>Parent Login</Text>
    //   {/* <Link href="Parent/home" asChild>
    //     <Button title="Open Parent Home Screen" />
    //   </Link> */}
    // </View>
  );
};

export default login;

const styles = StyleSheet.create({});
