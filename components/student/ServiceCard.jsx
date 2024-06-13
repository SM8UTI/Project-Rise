import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Box } from "@gluestack-ui/themed";
import { router } from "expo-router";
import { colors } from "../../utils/constant";
import { Image } from "expo-image";
import { widthPercentageToDP } from "react-native-responsive-screen";

const ServiceCard = ({ icon, serviceName, link }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{ width: widthPercentageToDP(28.2), flex: 1 }}
      onPress={() => router.push(link)}
    >
      <Box
        className="flex-1"
        p={8}
        bgColor={colors.bgColor}
        style={{ borderRadius: 8 }}
      >
        <View
          className="w-full h-[80px] flex items-center justify-center"
          style={{ borderRadius: 4 }}
        >
          <Image source={icon} style={{ width: 40, height: 40 }} />
        </View>
        <Text className="text-center text-sm pt-2 text-text mb-2">
          {serviceName && serviceName.length > 12
            ? `${serviceName.slice(0, 12)}..`
            : serviceName}
        </Text>
      </Box>
    </TouchableOpacity>
  );
};

export default ServiceCard;

const styles = StyleSheet.create({});
