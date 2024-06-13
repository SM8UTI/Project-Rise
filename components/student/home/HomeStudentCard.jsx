import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../../utils/constant";
import { Box, HStack } from "@gluestack-ui/themed";
import { Image } from "expo-image";

const HomeStudentCard = ({ name, classNumber, rollNumber, image }) => {
  return (
    <View style={styles.container}>
      <View className="flex-row justify-between items-center pb-0">
        <View className="flex-1 flex-col gap-1 mt-2 w-1/2 h-full">
          <Text className="text-base font-primary text-text">Welcome Back</Text>
          <Text className="text-2xl font-primary font-extrabold  text-mainBlack/80  capitalize">
            {/* name  */}
            {name}
          </Text>
        </View>
        <LinearGradient
          colors={colors.gr2}
          className=" w-[80px] h-[80px] rounded-full flex items-center justify-end overflow-hidden"
        >
          <Image
            source={image}
            className=" w-full h-full object-center object-cover"
          />
        </LinearGradient>
      </View>
      <HStack
        space="md"
        style={{
          marginTop: hp(3),
        }}
      >
        <Box
          bg={colors.bgColor}
          style={{
            flexDirection: "row",
            flex: 1,
            padding: 8,
            gap: 4,
            borderRadius: 4,
          }}
        >
          <Text className="text-sm text-text  font-primary">Class :</Text>
          <Text className="text-sm text-text  font-bold font-primary">
            {classNumber}
          </Text>
        </Box>
        <Box
          bg={colors.bgColor}
          style={{
            flexDirection: "row",
            flex: 1,
            padding: 8,
            gap: 4,
            borderRadius: 4,
          }}
        >
          <Text className="text-sm text-text  font-primary ">Roll No :</Text>
          <Text className="text-sm text-text uppercase font-bold font-primary">
            {rollNumber}
          </Text>
        </Box>
        {/* <View className="p-2 bg-bgColor mt-4 flex-1 flex-row justify-between px-4 rounded-md">
          <Text className="text-sm text-text  font-primary">Class :</Text>
          <Text className="text-sm text-text  font-bold font-primary">
            {classNumber}
          </Text>
        </View>
        <View className="p-2 bg-bgColor flex-1 flex-row justify-between px-4 rounded-md">
          <Text className="text-sm text-text  font-primary ">Roll No :</Text>
          <Text className="text-sm text-text uppercase font-bold font-primary">
            {rollNumber}
          </Text>
        </View> */}
      </HStack>
    </View>
  );
};

export default HomeStudentCard;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: wp(4.5),
    marginTop: hp(1),
    backgroundColor: "white",
    borderRadius: 8,
    paddingTop: hp(3),
    paddingBottom: hp(0),
  },
});
