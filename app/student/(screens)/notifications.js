import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import { VStack } from "@gluestack-ui/themed";
import LottieView from "lottie-react-native";

const messages = () => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      title: "Notifications",
      headerStyle: {
        fontFamily: "Urbanist",
      },
    });
  }, []);

  const [data, setData] = useState([]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      {data.length === 0 ? (
        <View className="flex items-center justify-center flex-1">
          <LottieView
            autoPlay
            loop
            style={{
              width: 200,
              height: 200,
            }}
            // Find more Lottie files at https://lottiefiles.com/featured
            source={require("../../../assets/animation/notification.json")}
          />
          <Text className="text-xl text-text capitalize font-primary">
            No notifications yet 🥺
          </Text>
        </View>
      ) : (
        <VStack>
          <Text>notifications</Text>
        </VStack>
      )}
    </SafeAreaView>
  );
};

export default messages;

const styles = StyleSheet.create({});
