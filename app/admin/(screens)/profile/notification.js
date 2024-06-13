import { StyleSheet, Text, View } from "react-native";
import React from "react";

const notification = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="text-base font-bold text-text text-center px-6 w-[360px] mb-12">
        Notification Features will be added in the next version of the app.
      </Text>
    </View>
  );
};

export default notification;

const styles = StyleSheet.create({});
