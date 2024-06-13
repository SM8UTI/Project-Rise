import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Box, HStack } from "@gluestack-ui/themed";
import { Image } from "expo-image";

const TeacherCard = ({ name, experience, subjects, languages, imageUrl }) => {
  return (
    <Box
      bg={"#fff"}
      style={{
        padding: 16,
        borderRadius: 8,
      }}
    >
      <HStack
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
        space="lg"
      >
        <Box
          style={{
            width: 140,
            height: "100%",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <Image
            source={imageUrl}
            contentFit="cover"
            className="w-full flex-1 object-center"
          />
        </Box>
        <Box
          style={{
            flexDirection: "column",
            gap: 12,
            flex: 1,
          }}
        >
          <View>
            <Text className="text-base text-mainBlack capitalize font-bold">
              {name}
            </Text>
            <Text className={"text-sm text-text"}>
              {experience}+ years of experience
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              flexWrap: "wrap",
            }}
          >
            {subjects.map((subject, index) => (
              <View
                key={index}
                className={"bg-Primary09 text-Primary04 py-2 px-4 text-center"}
                style={{
                  borderRadius: 100,
                }}
              >
                <Text
                  className={
                    "font-normal capitalize text-center text-xs text-Primary04"
                  }
                >
                  {subject}
                </Text>
              </View>
            ))}
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              flexWrap: "wrap",
            }}
          >
            <Text className={"text-text"}>Languages : </Text>
            {languages.map((language, index) => (
              <View key={index}>
                <Text className={"text-text"}>
                  {language}
                  {index !== languages.length - 1 ? ", " : ""}
                </Text>
              </View>
            ))}
          </View>
        </Box>
      </HStack>
    </Box>
  );
};

export default TeacherCard;

const styles = StyleSheet.create({});
