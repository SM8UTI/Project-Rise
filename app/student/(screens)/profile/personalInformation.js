import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import {
  AvatarFallbackText,
  Box,
  InputField,
  Textarea,
  TextareaInput,
  VStack,
} from "@gluestack-ui/themed";
import { Image } from "expo-image";
import { Avatar } from "@gluestack-ui/themed";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { Input } from "@gluestack-ui/themed";
import { StatusBar } from "expo-status-bar";
import { API_URL, colors } from "../../../../utils/constant";
import AsyncStorage from "@react-native-async-storage/async-storage";

const personalInformation = () => {
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState([]);
  const insets = useSafeAreaInsets();

  const getUser = async () => {
    try {
      const value = await AsyncStorage.getItem("userData");
      if (value !== null) {
        setStudentData(JSON.parse(value));
        setLoading(false);
      }
    } catch (e) {
      console.error("Error reading value:", e);
    }
  };

  useEffect(() => {
    getUser();
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
          {studentData.profilePic ? (
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
                source={{ uri: studentData.profilePic }}
                alt="Profile Picture"
                style={{ width: "100%", height: "100%" }}
              />
            </Box>
          ) : (
            <Avatar bgColor={colors.Primary02} size="2xl" borderRadius="$full">
              <AvatarFallbackText>{studentData.name}</AvatarFallbackText>
            </Avatar>
          )}
          <Box
            style={{
              backgroundColor: colors.Primary02,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 500,
              marginVertical: 8,
            }}
          >
            <Text className="text-white text-sm capitalize">
              {studentData.classId.name}
            </Text>
          </Box>
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
                value={studentData.name || "N/A"}
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
                value={studentData.gender || "N/A"}
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
                value={`${new Date(studentData.dob).toLocaleDateString(
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
            <Text className="text-sm text-text font-primary mb-1">
              Roll Number
            </Text>
            <Input isDisabled={true} size="lg">
              <InputField
                value={studentData.rollNo || "N/A"}
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
              Aadhar Number
            </Text>
            <Input isDisabled={true} size="lg">
              <InputField
                value={studentData.adharNo || "N/A"}
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
              Father's Name
            </Text>
            <Input isDisabled={true} size="lg">
              <InputField
                value={studentData.fathersName || "N/A"}
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
              Mother's Name
            </Text>
            <Input isDisabled={true} size="lg">
              <InputField
                value={studentData.mothersName || "N/A"}
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
                value={studentData.emailId || "N/A"}
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
                value={`+91 ${studentData.registeredMobileNo || "N/A"}`}
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
              Father's Phone Number
            </Text>
            <Input isDisabled={true} size="lg">
              <InputField
                value={`+91 ${studentData.fathersMobileNo || "N/A"}`}
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
              Mother's Phone Number
            </Text>
            <Input isDisabled={true} size="lg">
              <InputField
                value={`+91 ${studentData.mothersMobileNo || "N/A"}`}
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
                value={`${studentData.address}, ${studentData.city}, ${studentData.state}, ${studentData.country}`}
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
        </VStack>
      </VStack>
      <StatusBar style="dark" />
    </ScrollView>
  );
};

export default personalInformation;

const styles = StyleSheet.create({});
