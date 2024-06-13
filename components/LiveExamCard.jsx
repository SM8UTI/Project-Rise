import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Box, VStack } from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../utils/constant";
import Icon from "react-native-remix-icon";
import { router } from "expo-router";
import { heightPercentageToDP } from "react-native-responsive-screen";

const LiveExamCard = ({ data }) => {
  const {
    title,
    subject,
    time,
    scorePerQuestion,
    id,
    teacher,
    startDate,
    endDate,
    date,
    negativeMark,
  } = data;
  const [remainingTime, setRemainingTime] = useState(time * 60); // Convert minutes to seconds
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    setIsLive(now >= start && now <= end);

    const timer = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [startDate, endDate]);

  // Function to format time from seconds to minutes and seconds
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} min ${seconds < 10 ? "0" : ""}${seconds} sec`;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 8,
        flex: 1,
        overflow: "hidden",
      }}
      onPress={() => router.push(`student/(screens)/Exams/${id}`)}
    >
      <LinearGradient
        colors={colors.gr1}
        style={{
          position: "absolute",
          top: 0,

          right: 0,
          padding: 8,
          borderBottomLeftRadius: 8,
        }}
      >
        <Text className="text-white text-sm">{subject}</Text>
      </LinearGradient>
      <View>
        {isLive && (
          <Box
            bgColor="#E75A5A"
            style={{
              padding: 4,
              borderRadius: 4,
              width: 50,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              style={{
                width: 6,
                height: 6,
                borderRadius: 500,
                backgroundColor: "#fff",
              }}
            />
            <Text className="uppercase text-xs text-white ml-1">Live</Text>
          </Box>
        )}
        <View
          style={{
            marginTop: 8,
          }}
        >
          <Text className="text-base font-primary font-bold text-mainBlack/80 capitalize">
            {title}
          </Text>
          {/* <Text className="text-sm text-text font-primary">by {teacher}</Text> */}
          <Text className="text-sm text-text font-primary">
            {new Date(date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>
        <VStack
          space="sm"
          style={{
            marginTop: heightPercentageToDP(1),
          }}
        >
          <Box
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 8,
              backgroundColor: colors.Primary09,
              borderRadius: 4,
            }}
          >
            <Text className="text-sm text-text font-primary">Duration</Text>
            <Text className="text-sm text-Primary03 font-bold font-primary">
              {time} min
            </Text>
          </Box>
          <Box
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 8,
              backgroundColor: colors.Primary09,
              borderRadius: 4,
            }}
          >
            <Text className="text-sm text-text font-primary">
              Score Per Question
            </Text>
            <Text className="text-sm text-Primary03 font-bold font-primary">
              {scorePerQuestion}
            </Text>
          </Box>
          <Box
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 8,
              backgroundColor: colors.Primary09,
              borderRadius: 4,
            }}
          >
            <Text className="text-sm text-text font-primary">
              Negative Marking
            </Text>
            <Text className="text-sm text-Primary03 font-bold font-primary">
              -{negativeMark}
            </Text>
          </Box>
        </VStack>
      </View>
      {/* <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 16,
        }}
      >
        {remainingTime > 0 ? (
          <Box
            style={{
              backgroundColor: "#E75A5A10",
              padding: 8,
              borderRadius: 4,
            }}
          >
            <Text
              className="text-sm font-primary"
              style={{
                color: colors.red,
              }}
            >
              {formatTime(remainingTime)}
            </Text>
          </Box>
        ) : (
          <Text className="text-sm font-primary" style={{ color: colors.red }}>
            End
          </Text>
        )}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text className="text-sm text-Primary04 mr-1">Start</Text>
          <Icon name="arrow-right-s-line" size="20" color={colors.Primary04} />
        </View>
      </View> */}
    </TouchableOpacity>
  );
};

export default LiveExamCard;

const styles = StyleSheet.create({});
