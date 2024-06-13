import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import Icon from "react-native-remix-icon";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo } from "@expo/vector-icons";
import { colors } from "../../../../utils/constant";

const TeachersTabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#0387df",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 500,
        },
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          paddingTop: 12,
          paddingBottom: 12,
          height: 70,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          borderTopWidth: 0,
          backgroundColor: "#fff",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <View className="relative">
              <AntDesign name="home" size={24} color={color} />
            </View>
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="subjects"
        options={{
          title: "Subjects",
          tabBarIcon: ({ color }) => (
            <View>
              <AntDesign name="book" size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          tabBarIcon: ({ focused }) => (
            <LinearGradient
              colors={colors.gr1}
              className="rounded-full w-[70px] h-[70px] flex items-center justify-center mb-6"
            >
              <Entypo name="upload" size={24} color="white" />
              {focused && (
                <Text className="text-white text-xs font-normal mt-1 transition-all ease-in-out duration-200">
                  Upload
                </Text>
              )}
            </LinearGradient>
          ),
          title: "",
        }}
      />
      <Tabs.Screen
        name="exam"
        options={{
          title: "Exams",
          tabBarIcon: ({ color }) => (
            <View>
              <AntDesign name="copy1" size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <View>
              <AntDesign name="user" size={24} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
};

export default TeachersTabLayout;

const styles = StyleSheet.create({});
