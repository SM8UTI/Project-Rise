import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL, colors } from "../../../utils/constant";
import { HStack, VStack } from "@gluestack-ui/themed";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import LottieView from "lottie-react-native";
import { Box } from "@gluestack-ui/themed";
import { Image } from "expo-image";

const studentDoubts = () => {
  const [teacherData, setTeacherData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTeacher = async () => {
      try {
        const value = await AsyncStorage.getItem("teacherData");
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

  const [doubt, setDoubt] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log(`${API_URL}/teacher/getAssignedDoubts/${teacherData._id}`);
      try {
        const res = await axios.get(
          `${API_URL}/teacher/getAssignedDoubts/${teacherData?._id}`
        );
        setDoubt(res.data.doubts);
        setLoading(false);
        console.log(res.data.doubts);
      } catch (error) {
        console.error(error);
        // alert("Something went wrong");
      }
    };
    if (teacherData?._id) {
      fetchData();
    }
  }, [teacherData]);

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
        paddingTop: heightPercentageToDP(4),
      }}
    >
      <VStack
        space="4xl"
        style={{
          marginHorizontal: widthPercentageToDP(4.5),
        }}
      >
        {doubt && doubt.length > 0 ? (
          doubt.map((item) => (
            <Box
              key={item._id}
              style={{
                backgroundColor: colors.bgColor + "40",
                borderColor: colors.black + "15",
                borderWidth: 1,
                padding: 16,
                borderRadius: 8,
              }}
            >
              <Image
                source={require("../../../assets/appIcons/shock.png")}
                style={{
                  width: 60,
                  height: 60,
                  position: "absolute",
                  top: -30,
                  right: 0,
                  backgroundColor: colors.bgColor + "40",
                }}
              />
              <VStack>
                <Text className="text-mainBlack/80 text-lg pr-8">
                  {item.description}
                </Text>
                <Text className="text-text mt-1 text-xs capitalize">
                  {new Date(item.createdAt)
                    .toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                    .replace(",", " -")}{" "}
                  - {item.doubtType} Doubt
                </Text>
              </VStack>
              <VStack
                space="md"
                style={{
                  marginTop: 16,
                }}
              >
                <Text className="text-sm text-text capitalize">Student :</Text>
                <HStack
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: 8,
                    backgroundColor: colors.bgColor,
                    padding: 8,
                    borderRadius: 4,
                  }}
                  space="md"
                >
                  <Box
                    bg="transparent"
                    style={{
                      width: 40,
                      borderRadius: 4,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {item.student?.profilePic ? (
                      <Image
                        source={item.student.profilePic}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 50,
                        }}
                      />
                    ) : (
                      <Image
                        source={require("../../../assets/appIcons/graduating-student.png")}
                        style={{
                          width: 40,
                          height: 40,
                        }}
                      />
                    )}
                  </Box>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      Linking.openURL(`tel:${item.student.registeredMobileNo}`);
                    }}
                  >
                    <Text className="text-base text-mainBlack/80 font-primary font-bold">
                      {item.student.name}
                    </Text>
                    <Text className="text-text text-xs">
                      +91 {item.student.registeredMobileNo}
                    </Text>
                  </TouchableOpacity>
                </HStack>
              </VStack>
            </Box>
          ))
        ) : (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              minHeight: heightPercentageToDP(50),
            }}
          >
            <LottieView
              autoPlay
              loop
              style={{
                width: 300,
                height: 300,
              }}
              // Find more Lottie files at https://lottiefiles.com/featured
              source={require("../../../assets/animation/search2.json")}
            />
            <Text className="text-xl text-text capitalize font-primary">
              No Doubts found.
            </Text>
          </View>
        )}
      </VStack>
    </ScrollView>
  );
};

export default studentDoubts;

const styles = StyleSheet.create({});
