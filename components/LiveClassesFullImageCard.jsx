import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  Box,
  HStack,
  Modal,
  VStack,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  CloseIcon,
} from "@gluestack-ui/themed";
import { colors } from "../utils/constant";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { Image } from "expo-image";
import Icon from "react-native-remix-icon";
const LiveClassesFullImageCard = ({ data }) => {
  const {
    subjectId,
    topic,
    dateAndTime,
    teacherId,
    inviteLink,
    meetingID,
    passcode,
  } = data || {};

  const subjectIcon = {
    mathematics: require("../assets/appIcons/math.png"),
    biology: require("../assets/appIcons/bio.png"),
    zoology: require("../assets/appIcons/zoo.png"),
    geography: require("../assets/appIcons/geo.png"),
    english: require("../assets/appIcons/eng.png"),
    history: require("../assets/appIcons/his.png"),
    physics: require("../assets/appIcons/physic.png"),
    chemistry: require("../assets/appIcons/chemistry.png"),
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
    subjectCheck(subjectId?.name);
  }, []);

  const openZoomAppOrBrowser = async (zoomLink) => {
    try {
      // Check if the Zoom app is supported on the device
      const supported = await Linking.canOpenURL(zoomLink);

      if (supported) {
        // Open the Zoom app with the provided link
        await Linking.openURL(zoomLink);
      } else {
        // If Zoom app is not supported, open the link in the default browser
        await Linking.openURL(zoomLink);
      }
    } catch (error) {
      console.error("Failed to open Zoom app or browser:", error);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => openZoomAppOrBrowser(inviteLink)}
      style={{
        backgroundColor: colors.bgColor + "40",
        borderRadius: 8,
        padding: 16,
        borderColor: colors.black + "10",
        borderWidth: 1,
        overflow: "hidden",
      }}
    >
      <HStack space="lg">
        <Box
          style={{
            width: widthPercentageToDP(15),
            height: widthPercentageToDP(20),
            borderRadius: 4,
            overflow: "hidden",
            padding: 8,
            backgroundColor: subjectData.color + "20",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image source={subjectData.image} className="w-[40px] h-[40px]" />
        </Box>
        <VStack space="md">
          <Box>
            <Text className="text-lg text-mainBlack/80 font-primary font-bold">
              {topic}
            </Text>
            <Text className="text-md text-text font-primary font-medium">
              by {teacherId?.name}
            </Text>
          </Box>
          <Box
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Icon name="timer-2-line" size="20" color={colors.text} />
            <Text
              className="text-sm font-primary font-bold"
              style={{
                color: colors.text,
              }}
            >
              {new Date(dateAndTime)
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
        </VStack>
      </HStack>
      <VStack
        space="md"
        style={{
          backgroundColor: colors.bgColor,
          padding: 16,
          borderRadius: 4,
          marginTop: 16,
        }}
      >
        <Box
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Icon name="video-chat-line" size="20" color={subjectData.color} />
          <Text
            className="text-sm font-primary"
            style={{
              color: colors.text,
            }}
          >
            {meetingID}
          </Text>
        </Box>
        <Box
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Icon name="lock-password-line" size="20" color={subjectData.color} />
          <Text
            className="text-sm font-primary"
            style={{
              color: colors.text,
            }}
          >
            {passcode}
          </Text>
        </Box>
      </VStack>
      <Box
        bg={subjectData.color}
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          padding: 8,
          borderTopLeftRadius: 8,
        }}
      >
        <Text className="text-white text-sm font-primary">
          {subjectId?.name}
        </Text>
      </Box>
    </TouchableOpacity>
  );
};

export default LiveClassesFullImageCard;

const styles = StyleSheet.create({});
