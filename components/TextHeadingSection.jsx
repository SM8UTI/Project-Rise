import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "../utils/constant";
import { Pressable } from "react-native";
import { router } from "expo-router";
const TextHeadingSection = ({ children, sectionName, link }) => {
  return (
    <View style={styles.container}>
      <View className="flex flex-row items-center justify-between mb-6 pr-4">
        <Text className="text-lg font-primary font-medium text-text">
          {sectionName}
        </Text>
        {link && (
          <Pressable
            onPress={() => router.push(link)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Text className="text-sm text-Primary04 font-primary">
              View All
            </Text>
            <AntDesign name="arrowright" size={14} color={colors.Primary04} />
          </Pressable>
        )}
      </View>
      {children}
    </View>
  );
};

export default TextHeadingSection;

const styles = StyleSheet.create({
  container: {
    marginLeft: wp(4.5),
    marginTop: hp(4),
    borderRadius: 8,
  },
});
