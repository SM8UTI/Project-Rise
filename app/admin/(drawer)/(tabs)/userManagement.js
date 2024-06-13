import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Box, HStack, VStack } from "@gluestack-ui/themed";
import { Image } from "expo-image";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { router } from "expo-router";
import { colors } from "../../../../utils/constant";
const userManagement = () => {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      {/* header  */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + heightPercentageToDP(12),
        }}
      >
        <VStack
          style={{
            marginHorizontal: widthPercentageToDP(4.5),
          }}
        >
          <Text className="text-xl text-mainBlack/80 font-bold my-6 mt-4">
            User Management
          </Text>
          <VStack space="md">
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                backgroundColor: "#fff",
                padding: 16,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.black + "15",
                backgroundColor: colors.bgColor + "50",
              }}
              onPress={() => {
                router.push("/admin/(screens)/studentManagement");
              }}
            >
              <View
                className="w-[60px] h-[60px] flex flex-col items-center justify-center bg-Primary06 rounded-lg overflow-hidden"
                style={{
                  backgroundColor: "#5299D315",
                }}
              >
                <Image
                  source={require("../../../../assets/appIcons/graduating-student.png")}
                  className="w-[40px] h-[40px] object-contain"
                />
              </View>
              <Text className="text-lg text-mainBlack/80 ml-4">
                Student Management
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                padding: 16,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.black + "15",
                backgroundColor: colors.bgColor + "50",
              }}
              onPress={() => {
                router.push("/admin/(screens)/teacherManagement");
              }}
            >
              <View
                className="w-[60px] h-[60px] flex flex-col items-center justify-center rounded-lg overflow-hidden"
                style={{
                  backgroundColor: "#EA606015",
                }}
              >
                <Image
                  source={require("../../../../assets/appIcons/teacher.png")}
                  className="w-[40px] h-[40px] object-contain"
                />
              </View>
              <Text className="text-lg text-mainBlack/80 ml-4">
                Teacher Management
              </Text>
            </TouchableOpacity>
          </VStack>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default userManagement;

const styles = StyleSheet.create({});
