import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { HStack, Box, VStack } from "@gluestack-ui/themed";
import { Image } from "expo-image";
import { colors } from "../../../utils/constant";
import Icon from "react-native-remix-icon";

const UpcomingExamCard = ({ data }) => {
  const { name, subject, startDate, totalTime, scorePerQuestion, questions } =
    data;

  const subjectIcon = {
    mathematics: require("../../../assets/appIcons/math.png"),
    biology: require("../../../assets/appIcons/bio.png"),
    zoology: require("../../../assets/appIcons/zoo.png"),
    geography: require("../../../assets/appIcons/geo.png"),
    english: require("../../../assets/appIcons/eng.png"),
    history: require("../../../assets/appIcons/his.png"),
    physics: require("../../../assets/appIcons/physic.png"),
    chemistry: require("../../../assets/appIcons/chemistry.png"),
  };

  const subjectColor = {
    mathematics: "#5C7CFA",
    biology: "#21A366",
    zoology: "#E91E63",
    geography: "#0B97E8",
    english: "#D6A203",
    history: "#EB7900",
    physics: "#CC5DE8",
    chemistry: "#2196F3",
  };

  const [subjectData, setSubjectData] = useState({
    image: "",
    color: "",
  });

  const subjectCheck = (subjectName) => {
    const subject = subjectName.toLowerCase();
    if (subject.includes("math")) {
      setSubjectData({
        image: subjectIcon.mathematics,
        color: subjectColor.mathematics,
      });
    } else if (subject.includes("bio")) {
      setSubjectData({
        image: subjectIcon.biology,
        color: subjectColor.biology,
      });
    } else if (subject.includes("zoo")) {
      setSubjectData({
        image: subjectIcon.zoology,
        color: subjectColor.zoology,
      });
    } else if (subject.includes("geo")) {
      setSubjectData({
        image: subjectIcon.geography,
        color: subjectColor.geography,
      });
    } else if (subject.includes("eng")) {
      setSubjectData({
        image: subjectIcon.english,
        color: subjectColor.english,
      });
    } else if (subject.includes("his")) {
      setSubjectData({
        image: subjectIcon.history,
        color: subjectColor.history,
      });
    } else if (subject.includes("physic")) {
      setSubjectData({
        image: subjectIcon.physics,
        color: subjectColor.physics,
      });
    } else if (subject.includes("chemi")) {
      setSubjectData({
        image: subjectIcon.chemistry,
        color: subjectColor.chemistry,
      });
    }
  };

  useEffect(() => {
    subjectCheck(subject);
  }, []);

  return (
    <Box
      style={{
        padding: 16,
        borderColor: colors.black + "15",
        borderWidth: 1,
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <HStack space="lg">
        <Box
          bg="transparent"
          style={{
            width: 80,
            backgroundColor: subjectData.color + "15",
            borderRadius: 4,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={subjectData.image}
            style={{
              width: 50,
              height: 50,
            }}
          />
        </Box>
        <VStack
          space="sm"
          style={{
            flex: 1,
          }}
        >
          <Box>
            <Text className="text-lg text-mainBlack/80 font-primary font-bold">
              {name && name.length > 15 ? name.slice(0, 15) + "..." : name}
            </Text>
            <Text className="text-text">
              {new Date(startDate)
                .toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
                .replace(",", " -")}
            </Text>
          </Box>
          <HStack
            space="md"
            style={{
              marginVertical: 8,
            }}
          >
            <Box
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Icon
                name="timer-flash-line"
                size={20}
                color={subjectData.color}
              />
              <Text
                style={{
                  color: subjectData.color,
                }}
                className="font-primary text-sm font-bold"
              >
                {totalTime} Min
              </Text>
            </Box>
            <Box
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Icon name="medal-line" size={20} color={subjectData.color} />
              <Text
                style={{
                  color: subjectData.color,
                }}
                className="font-primary text-sm font-bold"
              >
                {questions
                  ? questions.length * scorePerQuestion + " Marks"
                  : "0" + " Marks"}
              </Text>
            </Box>
          </HStack>
        </VStack>
      </HStack>
      <View
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          padding: 8,
          borderBottomLeftRadius: 8,
          backgroundColor: subjectData.color,
        }}
      >
        <Text className="text-white text-sm">{subject}</Text>
      </View>
    </Box>
  );
};

export default UpcomingExamCard;

const styles = StyleSheet.create({});
