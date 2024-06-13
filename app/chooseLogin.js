import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React, { useEffect } from "react";
import { useState } from "react";
import { router } from "expo-router";

import "./style.css";
import { SafeAreaView } from "react-native-safe-area-context";

import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { colors } from "../utils/constant";

const chooseLogin = () => {
  return (
    <SafeAreaView
      className="flex flex-col items-center justify-center h-full gap-4 pb-12"
      style={{
        fontFamily: "Urbanist",
      }}
    >
      <View className="p-8 flex items-center justify-center gap-2 flex-col">
        <Text
          className=" text-3xl font-bold text-center text-black"
          style={{
            fontFamily: "Urbanist",
          }}
        >
          Welcome back! Glad to see you, Again!
        </Text>
        <Text className="text-text text-base font-primary text-center">
          Please select your role to continue with the app. If you are new, you
          can contact the admin to get your credentials.
        </Text>
      </View>
      <View className="flex flex-row items-center justify-center flex-wrap gap-3">
        <Pressable
          onPress={() => {
            router.push("/student/login");
          }}
        >
          <View className="flex flex-col items-center justify-center gap-2 ">
            <View className="w-[100px] h-[100px] flex flex-col items-center justify-center bg-Primary06 rounded-lg overflow-hidden">
              <Image
                source={require("../assets/icons/student.png")}
                className="w-full h-full object-contain"
              />
            </View>
            <Text className="text-sm text-black/70  font-primary font-bold">
              Student
            </Text>
          </View>
        </Pressable>
        <Pressable
          onPress={() => {
            router.push("/teacher/login");
            // router.push("teacher/(screens)/exam/createNewTest");
          }}
        >
          <View className="flex flex-col items-center justify-center gap-2">
            <View className="w-[100px] h-[100px] flex flex-col items-center justify-center bg-Primary06 rounded-lg overflow-hidden">
              <Image
                source={require("../assets/icons/teacher.png")}
                className="w-full h-full object-contain"
              />
            </View>
            <Text className="text-sm text-black/70  font-primary font-bold">
              Teacher
            </Text>
          </View>
        </Pressable>
        {/* <Pressable
          onPress={() => {
            router.push("/parent/login");
          }}
        >
          <View
            entering={FadeInDown.delay(400).duration(1000).springify()}
            className="flex flex-col items-center justify-center gap-2"
          >
            <View className="w-[100px] h-[100px] flex flex-col items-center justify-center bg-Primary06 rounded-lg overflow-hidden">
              <Image
                source={require("../assets/icons/parents.png")}
                className="w-full h-full object-contain"
              />
            </View>
            <Text className="text-sm text-black/70 font-primary font-bold">
              Parent
            </Text>
          </View>
        </Pressable> */}
      </View>
      <View className="flex flex-col items-center justify-center pt-6">
        <Pressable onPress={() => router.push("/admin/login")}>
          <LinearGradient colors={colors.gr1} className="px-6 h-12 rounded-lg">
            <View className="flex flex-row  items-center justify-center h-full">
              <Text className="mr-2">
                <AntDesign name="login" size={16} color="white" />
              </Text>
              <Text className="font-primary text-white text-base">
                Login as Admin Management
              </Text>
            </View>
          </LinearGradient>
        </Pressable>
      </View>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default chooseLogin;

const styles = StyleSheet.create({});
