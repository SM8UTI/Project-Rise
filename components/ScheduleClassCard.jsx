import React from "react";
import { Box } from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../utils/constant";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { View, Text } from "react-native";
import Icon from "react-native-remix-icon";
const ScheduleClassCard = ({
  title,
  teacherName,
  subjectName,
  toTime,
  fromTime,
  date,
}) => {
  // Check if the date is valid
  const isValidDate = (date) => !isNaN(new Date(date).getTime());

  // Render the card content
  return isValidDate(date) ? (
    <Box
      bg="#fff"
      style={{
        padding: 16,
        borderRadius: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <LinearGradient
          colors={colors.gr1}
          style={{
            width: widthPercentageToDP(15),
            height: heightPercentageToDP(8),
            borderRadius: 4,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text className="text-white uppercase text-base">
            {new Date(date).getDate()}
          </Text>
          <Text className="text-white uppercase text-sm">
            {new Date(date).toLocaleString("default", { month: "short" })}
          </Text>
        </LinearGradient>
        <View>
          <Text
            className="text-base text-mainBlack/80"
            style={{
              fontWeight: "bold",
            }}
          >
            {title.length > 30 ? title.slice(0, 30) + "..." : title}
          </Text>
          <Text className="text-sm text-text">by {teacherName}</Text>
          <View
            style={{
              marginTop: 8,
            }}
          >
            <Text className="text-text text-sm">
              {fromTime} - {toTime}
            </Text>
          </View>
        </View>
      </View>

      <View className="mb-12">
        <Icon name="arrow-right-s-line" size="20" color={colors.Primary04} />
      </View>

      <LinearGradient
        colors={colors.gr1}
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          padding: 8,
          paddingHorizontal: 12,
          borderTopLeftRadius: 8,
        }}
      >
        <Text className="text-white text-xs capitalize">{subjectName}</Text>
      </LinearGradient>
    </Box>
  ) : null; // Return null if date is invalid
};

export default ScheduleClassCard;
