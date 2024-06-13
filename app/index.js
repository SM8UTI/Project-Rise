import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useEffect } from "react";
import { useState } from "react";
import { router } from "expo-router";

import "./style.css";
import { SafeAreaView } from "react-native-safe-area-context";

import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";

import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";

import * as SplashScreen from "expo-splash-screen";
import { Box, VStack } from "@gluestack-ui/themed";
import { Image } from "expo-image";
import { colors } from "../utils/constant";

const index = () => {
  const navigation = useNavigation();
  const [redirected, setRedirected] = useState(false);
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("userToken");
      const adminData = await AsyncStorage.getItem("adminData");
      const teacherData = await AsyncStorage.getItem("teacherData");
      const classId = await AsyncStorage.getItem("classId");

      if (adminData || token || teacherData) {
        if (adminData) {
          router.push("/admin/(drawer)/(tabs)/home");
        } else if (token) {
          router.push("student/(drawer)/(tabs)/home");
        } else if (teacherData) {
          if (classId) {
            router.push("teacher/(drawer)/(tabs)/home");
          } else {
            router.push("teacher/chooseClass");
          }
        }
        return;
      } else {
        setTimeout(() => {
          if (redirected != false) {
            setRedirected(true);
          }
          router.push("/chooseLogin");
        }, 1000);
      }
    };
    checkLoginStatus();
  }, []);

  const [fontsload] = useFonts({
    Urbanist: require("../assets/fonts/Urbanist-VariableFont_wght.ttf"),
    UrbanistItalic: require("../assets/fonts/Urbanist-Italic-VariableFont_wght.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }

    prepare();
  }, []);

  if (!fontsload) {
    return undefined;
  } else {
    SplashScreen.hideAsync();
  }

  return (
    <SafeAreaView
      className="flex flex-col items-center justify-center h-full gap-4 pb-12"
      style={{
        fontFamily: "Urbanist",
      }}
    >
      <VStack>
        <Box
          style={{
            width: 350,
            height: 350,
          }}
        >
          <Image
            source={require("../assets/adaptive-icon.png")}
            className="w-full h-full"
          />
        </Box>
      </VStack>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default index;
