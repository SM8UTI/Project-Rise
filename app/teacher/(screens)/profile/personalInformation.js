import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { API_URL, colors } from "../../../../utils/constant";
import axios from "axios";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import {
  Input,
  InputField,
  VStack,
  Textarea,
  TextareaInput,
} from "@gluestack-ui/themed";
import { Box, AvatarFallbackText, Avatar } from "@gluestack-ui/themed";
import { Image } from "expo-image";
import { HStack } from "@gluestack-ui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";

const personalInformation = () => {
  const insets = useSafeAreaInsets();
  const [teacherData, setTeacherData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTeacher = async () => {
      try {
        const value = await AsyncStorage.getItem("teacherData");
        setLoading(false);
        if (value !== null) {
          setTeacherData(JSON.parse(value));
          console.log("Teacher Data", JSON.parse(value));
        }
      } catch (e) {
        console.error("Error reading value:", e);
      }
    };
    getTeacher();
  }, []);

  

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.Primary02} />
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: insets.bottom + heightPercentageToDP(2),
      }}
    >
      <VStack
        space="2xl"
        style={{
          marginHorizontal: widthPercentageToDP(4),
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: heightPercentageToDP(4),
          }}
        >
          {teacherData.profilePic ? (
            <Box
              w={150}
              h={150}
              style={{
                borderRadius: 8,
                overflow: "hidden",
                borderColor: colors.white,
                borderWidth: 4,
                borderRadius: 500,
              }}
            >
              <Image
                source={{ uri: teacherData.profilePic }}
                alt="Profile Picture"
                style={{ width: "100%", height: "100%" }}
              />
            </Box>
          ) : (
            <Avatar bgColor={colors.Primary02} size="2xl" borderRadius="$full">
              <AvatarFallbackText>{teacherData.name}</AvatarFallbackText>
            </Avatar>
          )}
        </View>
        <VStack
          space="md"
          style={{
            backgroundColor: colors.white,
            padding: 16,
            borderRadius: 8,
          }}
        >
          <Box style={{ flex: 1 }}>
            <Text className="text-sm text-text font-primary mb-1">Name</Text>
            <Input isDisabled={true} size="lg">
              <InputField
                value={teacherData.name}
                style={{
                  color: colors.black,
                  paddingVertical: 8,
                  fontFamily: "Urbanist",
                  fontSize: 16,
                }}
              />
            </Input>
          </Box>
          <Box style={{ flex: 1 }}>
            <Text className="text-sm text-text font-primary mb-1">Email</Text>
            <Input isDisabled={true} size="lg">
              <InputField
                value={teacherData.emailId}
                style={{
                  color: colors.black,
                  paddingVertical: 8,
                  fontFamily: "Urbanist",
                  fontSize: 16,
                }}
              />
            </Input>
          </Box>
          <Box style={{ flex: 1 }}>
            <Text className="text-sm text-text font-primary mb-1">
              Phone Number
            </Text>
            <Input isDisabled={true} size="lg">
              <InputField
                value={`+91 ${teacherData.phoneNumber}`}
                style={{
                  color: colors.black,
                  paddingVertical: 8,
                  fontFamily: "Urbanist",
                  fontSize: 16,
                }}
              />
            </Input>
          </Box>
          <Box style={{ flex: 1 }}>
            <Text className="text-sm text-text font-primary mb-1">Gender</Text>
            <Input isDisabled={true} size="lg">
              <InputField
                value={`${teacherData.gender}`}
                style={{
                  color: colors.black,
                  paddingVertical: 8,
                  fontFamily: "Urbanist",
                  fontSize: 16,
                }}
              />
            </Input>
          </Box>
          <Box style={{ flex: 1 }}>
            <Text className="text-sm text-text font-primary mb-1">
              Date of Birth
            </Text>
            <Input isDisabled={true} size="lg">
              <InputField
                value={`${new Date(teacherData.dob).toLocaleDateString(
                  undefined,
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}`}
                style={{
                  color: colors.black,
                  paddingVertical: 8,
                  fontFamily: "Urbanist",
                  fontSize: 16,
                }}
              />
            </Input>
          </Box>
          <Box style={{ flex: 1 }}>
            <Text className="text-sm text-text font-primary mb-1">Address</Text>
            <Textarea isDisabled={true} size="lg">
              <TextareaInput
                value={`${teacherData.address}, ${teacherData.city}, ${teacherData.state}, ${teacherData.country}`}
                style={{
                  color: colors.black,
                  paddingVertical: 8,
                  fontFamily: "Urbanist",
                  fontSize: 16,
                }}
                numberOfLines={4}
                multiline={true}
              />
            </Textarea>
          </Box>
          <Box style={{ flex: 1 }}>
            <Text className="text-sm text-text font-primary mb-1">
              Created At
            </Text>
            <Input isDisabled={true} size="lg">
              <InputField
                value={`${new Date(teacherData.createdAt).toLocaleDateString(
                  undefined,
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}`}
                style={{
                  color: colors.black,
                  paddingVertical: 8,
                  fontFamily: "Urbanist",
                  fontSize: 16,
                }}
              />
            </Input>
          </Box>
          <Box>
            <Text className="text-sm text-text font-primary mb-2">
              Subjects
            </Text>
            <HStack space="sm">
              {teacherData?.subjects?.map((elem) => (
                <Box
                  key={elem._id}
                  style={{
                    backgroundColor: colors.Primary02,
                    padding: 8,
                    borderRadius: 500,
                    paddingHorizontal: 12,
                  }}
                >
                  <Text className="text-sm text-white">{elem.name}</Text>
                </Box>
              ))}
            </HStack>
          </Box>
          <Box>
            <Text className="text-sm text-text font-primary mb-2">Classes</Text>
            <HStack space="sm">
              {teacherData?.classes?.map((elem) => (
                <Box
                  key={elem._id}
                  style={{
                    backgroundColor: colors.Primary02,
                    padding: 8,
                    borderRadius: 500,
                    paddingHorizontal: 12,
                  }}
                >
                  <Text className="text-sm text-white">{elem.name}</Text>
                </Box>
              ))}
            </HStack>
          </Box>
        </VStack>
      </VStack>
    </ScrollView>
  );
};

export default personalInformation;

const styles = StyleSheet.create({});
