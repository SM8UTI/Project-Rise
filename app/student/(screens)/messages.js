import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";

const messages = () => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      title: "Messages",
      headerStyle: {
        fontFamily: "Urbanist",
      },
    });
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <View className="flex items-center justify-center flex-1">
        <Text className="text-xl text-text capitalize font-primary">
          No messages yet 🥺
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default messages;

const styles = StyleSheet.create({});
