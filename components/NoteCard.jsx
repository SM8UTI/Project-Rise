import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
} from "react-native";
import React, { useCallback } from "react";
import Icon from "react-native-remix-icon";
import { colors } from "../utils/constant";
import { LinearGradient } from "expo-linear-gradient";
import { Box } from "@gluestack-ui/themed";
import { Image } from "expo-image";

const NoteCard = ({ data }) => {
  const { contentName, subject, teacherName, createdAt, contentUrl } =
    data || {};

  const handlePress = useCallback(async () => {
    try {
      await Linking.openURL(contentUrl);
    } catch (error) {
      alert("Failed to open URL: " + error.message);
    }
  }, [contentUrl]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      style={{
        flex: 1,
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 8,
        borderColor: colors.black + "20",
        borderWidth: 1,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
        }}
      >
        <Box
          bg={"#FF000015"}
          style={{
            width: 80,
            height: 80,
            height: "100%",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 4,
          }}
        >
          <Image
            source={require("../assets/appIcons/notes.png")}
            className="w-[40px] h-[40px]"
          />
        </Box>
        <View
          style={{
            marginLeft: 12,
            flex: 1,
          }}
        >
          <View>
            <Text className="text-base text-mainBlack/80 font-primary  font-bold pr-4 capitalize">
              {contentName}
            </Text>
            <Text className="text-sm text-text mt-1 font-primary">
              by {teacherName || "Unknown"}
            </Text>
          </View>
          <Text className="text-xs text-text mt-3 font-primary">
            {new Date(createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>
      </View>
      <LinearGradient
        colors={colors.gr1}
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          padding: 8,
          borderTopLeftRadius: 8,
        }}
      >
        <Text className="text-white text-sm">{subject}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default NoteCard;

const styles = StyleSheet.create({});
