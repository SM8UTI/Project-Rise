import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import axios from "axios";
import { API_URL, colors } from "../../utils/constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
const login = () => {
  const [data, setData] = useState({
    // loginId: "akash123",
    // password: "akash123",
    loginId: "chakit28",
    password: "password123",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState({
    loginIDError: "",
    passwordError: "",
    error: "",
  });

  const handleSubmit = async () => {
    // Check if email and password are present
    setLoading(true);
    if (!data.loginId || !data.password) {
      setError({
        loginIDError: !data.loginId ? "Please enter your Login User id." : "",
        passwordError: !data.password ? "Please enter your password." : "",
      });
      setLoading(false);
      return;
    }

    // router.push("/admin/(drawer)/(tabs)/home");

    // Proceed with form submission
    console.log("Email:", data.loginId);
    console.log("Password:", data.password);

    await axios
      .post(`${API_URL}/admin/adminLogin`, {
        loginId: data.loginId,
        password: data.password,
      })
      .then((res) => {
        console.log("data", res.data);
        if (res.data.success === true) {
          AsyncStorage.setItem("adminData", JSON.stringify(res.data.teacher));
          router.push("admin/(drawer)/(tabs)/home");
        }
        // AsyncStorage.setItem("userToken", res.data.jwttoken);
        if (res.data.error) {
          alert(res.data.error);
          if (res.data.error == "Invalid credentials") {
            setError({
              ...error,
              passwordError: res.data.error,
            });
          } else if (res.data.error == "Admin not found") {
            setError({
              ...error,
              loginIDError: res.data.error,
            });
          }
        }
      })
      .catch((err) => {
        console.log("error ", err);

        if (err.response.data.error == "Invalid credentials") {
          setError({
            ...error,
            passwordError: err.response.data.error,
          });
        } else if (err.response.data.error == "Admin not found") {
          setError({
            ...error,
            loginIDError: err.response.data.error,
          });
        }
      });

    // Reset error state
    setLoading(false);
  };

  return (
    <SafeAreaView className="bg-white pt-0 w-full h-full flex items-center justify-center">
      <Animated.View
        entering={FadeInUp.delay(300).duration(1500).springify()}
        className="w-[100px] h-[100px] flex items-center justify-center "
      >
        <Image
          source={require("../../assets/adaptive-icon.png")}
          className="w-[200px] h-[200px] object-center object-contain"
        />
      </Animated.View>
      <View className="flex flex-col items-center justify-center gap-2 mt-6">
        <Text className="text-3xl text-black  font-primary font-bold">
          Admin Login
        </Text>
        <Text className="text-sm w-2/3 text-text text-center  font-primary font-normal">
          Enter your credentials to login and access your account.
        </Text>
      </View>
      <View className="mt-4 px-6 flex flex-col gap-4 w-full lg:max-w-[400px]">
        <View className="bg-input flex flex-row items-center rounded-md overflow-hidden">
          <View className="w-12 h-12 flex items-center justify-center">
            <Feather name="user" size={24} color={colors.Primary02} />
          </View>
          <TextInput
            placeholder="Login ID"
            value={data.loginId}
            onChangeText={(value) => {
              setError({ ...error, loginIDError: "" });
              setData({
                ...data,
                loginId: value,
              });
            }}
            className="font-primary  h-12 px-2 bg-input focus:outline-none placeholder:font-primary font-semibold placeholder:text-text w-full"
          />
        </View>
        {error.loginIDError ? (
          <Text className="font-primary text-sm bg-red-50 text-red-500 p-2 py-1 rounded-sm overflow-hidden">
            Error : {error.loginIDError}
          </Text>
        ) : null}
        <View className="bg-input flex flex-row items-center rounded-md overflow-hidden ">
          <View className="w-12 h-12 flex items-center justify-center">
            <MaterialIcons name="password" size={12} color={colors.Primary02} />
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
    //   <Text>Student Login</Text>
    //   {/* <Link href="student/home" asChild>
    //     <Button title="Open Student Home Screen" />
    //   </Link> */}
    // </View>
  );
};

export default login;

const styles = StyleSheet.create({});
