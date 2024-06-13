import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { colors } from "../utils/constant";
import { Box } from "@gluestack-ui/themed";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { router } from "expo-router";

const SubjectCard = ({ name, subjectId, chaptersNumber }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.push(`/teacher/(screens)/subject/${subjectId}`)}
    >
      <Box
        bg={colors.white}
        style={{
          width: widthPercentageToDP(44),
          padding: 16,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 16,
          borderRadius: 8,
        }}
      >
        <View className="flex flex-col">
          <Text className="text-lg text-mainBlack/80 font-primary font-bold">
            {name}
          </Text>
          <Text className="text-sm text-text font-primary">
            <Text className="font-bold text-Primary03">{chaptersNumber}</Text>{" "}
            Chapter
          </Text>
        </View>
      </Box>
    </TouchableOpacity>
  );
};

export default SubjectCard;

const styles = StyleSheet.create({});
