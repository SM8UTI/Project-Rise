import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Progress, ProgressFilledTrack } from "@gluestack-ui/themed";
import { Box } from "@gluestack-ui/themed";
import { colors } from "../../utils/constant";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { router } from "expo-router";
import { Image } from "expo-image";

const SubjectPercentageCard2 = ({
  subjectName,
  chaptersNumber,
  percentageComplete,
  subjectId,
}) => {
  const subjectIcon = {
    mathematics: require("../../assets/appIcons/math.png"),
    biology: require("../../assets/appIcons/bio.png"),
    zoology: require("../../assets/appIcons/zoo.png"),
    geography: require("../../assets/appIcons/geo.png"),
    english: require("../../assets/appIcons/eng.png"),
    history: require("../../assets/appIcons/his.png"),
    physics: require("../../assets/appIcons/physic.png"),
    chemistry: require("../../assets/appIcons/chemistry.png"),
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
    subjectCheck(subjectName);
  }, []);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.push(`teacher/(screens)/subject/${subjectId}`)}
    >
      <Box
        bg={subjectData.color + "24" || colors.bgColor}
        style={styles.container}
      >
        <Box
          style={{
            flexDirection: "column",
            gap: 6,
          }}
        >
          <Box
            style={{
              width: wp(10),
              height: wp(10),
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <Image source={subjectData.image} className="w-full h-full" />
          </Box>
          <View className="flex flex-col">
            <Text
              className="text-base font-primary font-bold  capitalize"
              style={{
                color: subjectData.color || colors.text,
              }}
            >
              {subjectName}
            </Text>
            <Text
              className="text-xs font-primary"
              style={{
                color: subjectData.color || colors.text,
              }}
            >
              {chaptersNumber} Chapter
            </Text>
          </View>
        </Box>
        {percentageComplete && (
          <View className="flex flex-row items-center gap-2">
            <Progress
              value={percentageComplete}
              size="sm"
              width={wp(28)}
              bgColor="$coolGray100"
            >
              <ProgressFilledTrack bg={colors.Primary03} />
            </Progress>
            <Text className="text-Primary03 font-bold">
              {percentageComplete}%
            </Text>
          </View>
        )}
      </Box>
    </TouchableOpacity>
  );
};

export default SubjectPercentageCard2;

const styles = StyleSheet.create({
  container: {
    width: wp(43),
    padding: 16,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
});
