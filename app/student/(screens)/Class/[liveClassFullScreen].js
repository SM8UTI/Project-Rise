import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { Box, VStack, HStack } from "@gluestack-ui/themed";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../../../utils/constant";
import Icon from "react-native-remix-icon";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  AvatarGroup,
} from "@gluestack-ui/themed";
import TextHeadingSection from "../../../../components/TextHeadingSection";

const imagesData = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  "https://images.unsplash.com/photo-1618245472177-2a74ad3b994a",
  "https://images.unsplash.com/photo-1609081524998-a1163e2d44cb",
  "https://images.unsplash.com/photo-1615464867300-6d74f8e40cc1",
];

import zoom from "../../../../assets/icons/zoom.png";
import meet from "../../../../assets/icons/meet.png";
import TeacherCard from "../../../../components/student/TeacherCard";

const liveClassFullScreen = () => {
  const { liveClassFullScreen } = useLocalSearchParams();

  const navigation = useNavigation();

  const meetingPlatformOption = (value) => {
    if (value === "zoom") {
      return zoom;
    } else {
      return meet;
    }
  };

  useEffect(() => {
    navigation.setOptions({
      title: liveClassFullScreen,
      headerStyle: {
        fontFamily: "Urbanist",
      },
    });
  }, []);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <VStack
        style={{
          marginHorizontal: widthPercentageToDP(4),
          marginTop: widthPercentageToDP(2),
        }}
        space="md"
      >
        <View
          style={{
            width: "100%",
            height: 200,
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <Image
            source={"https://images.unsplash.com/photo-1557862921-37829c790f19"}
            contentFit="cover"
            className="w-full flex-1 object-center"
            style={{
              height: 200,
            }}
          />
          <Box
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              padding: 6,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              borderRadius: 8,
            }}
            bgColor="#fff"
          >
            <Box w={8} h={8} bg="$red500" rounded="$full" />
            <Text className="text-red-500 font-primary uppercase font-bold">
              Live
            </Text>
          </Box>
          <LinearGradient
            colors={colors.gr1}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              padding: 8,
              borderTopRightRadius: 8,
            }}
          >
            <Text className="text-white text-sm">Mathmetics</Text>
          </LinearGradient>
        </View>
        <Box
          style={{
            backgroundColor: "#fff",
            padding: 16,
            borderRadius: 8,
          }}
        >
          <View className="flex-col gap-1">
            <Text className="text-mainBlack text-base capitalize font-bold">
              Linear Equations in one variable
            </Text>
            <Text className="text-sm text-text">by Aditya Sir</Text>
          </View>
          <View
            className="flex-col gap-2"
            style={{
              marginTop: 8,
            }}
          >
            <Box
              style={{
                backgroundColor: colors.Primary09,
                borderRadius: 4,
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                padding: 8,
              }}
            >
              <Icon name="book-read-line" size="24" color={colors.Primary04} />
              <Text className="text-sm text-Primary04">
                Chapter 01 - Chapter Name
              </Text>
            </Box>
            <Box
              style={{
                backgroundColor: colors.Primary09,
                borderRadius: 4,
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                padding: 8,
              }}
            >
              <Icon name="time-line" size="24" color={colors.Primary04} />
              <Text className="text-sm text-Primary04">
                12th May 2021, 12:00 PM
              </Text>
            </Box>
          </View>
          <HStack
            style={{
              padding: 8,
              marginTop: 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <AvatarGroup>
              {imagesData.map((item, index) => (
                <Avatar size="sm" key={index}>
                  <AvatarFallbackText>User Name</AvatarFallbackText>
                  <AvatarImage
                    style={{
                      borderWidth: 2,
                      borderColor: "#fff",
                      shadowColor: "#fff",
                    }}
                    alt="user"
                    source={{
                      uri: item,
                    }}
                  />
                </Avatar>
              ))}
            </AvatarGroup>
            <View
              className="w-[72px] h-[40px] bg-bgColor p-2"
              style={{ borderRadius: 4 }}
            >
              <Image
                source={meetingPlatformOption("zoom")}
                contentFit="contain"
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </View>
          </HStack>
          <HStack
            style={{
              marginTop: 16,
            }}
            space="md"
          >
            <TouchableOpacity style={{ flex: 1 }}>
              <View
                className="flex-row items-center justify-center border-2 border-text/40"
                style={{
                  height: 50,
                  borderRadius: 8,
                }}
              >
                <Icon name="body-scan-line" size="20" color={colors.text} />
                <Text className="font-primary text-base text-text text-center ml-4">
                  Attendance
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1 }}>
              <LinearGradient
                colors={colors.gr1}
                style={{
                  height: 50,
                  borderRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text className="font-primary text-base text-white text-center">
                  Join Now
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </HStack>
        </Box>
      </VStack>
      <TextHeadingSection sectionName={"Teacher Information"}>
        <VStack
          style={{
            paddingRight: widthPercentageToDP(4),
          }}
        >
          <TeacherCard
            name={"Aditya Mathur"}
            experience={"06"}
            subjects={["Mathematics", "Algebra"]}
            languages={["English", "Hindi"]}
            imageUrl={
              "https://plus.unsplash.com/premium_photo-1682089892133-556bde898f2c"
            }
          />
        </VStack>
      </TextHeadingSection>
    </ScrollView>
  );
};

export default liveClassFullScreen;

const styles = StyleSheet.create({});
