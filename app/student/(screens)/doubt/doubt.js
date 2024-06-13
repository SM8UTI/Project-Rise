import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Box, HStack, VStack } from "@gluestack-ui/themed";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { router } from "expo-router";
import { API_URL, colors } from "../../../../utils/constant";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import LottieView from "lottie-react-native";

const doubt = () => {
  const [user, setUser] = useState(AsyncStorage.getItem("userData"));
  const [loading, setLoading] = useState(true);
  const getUser = async () => {
    try {
      const value = await AsyncStorage.getItem("userData");
      if (value !== null) {
        setUser(JSON.parse(value));
      }
    } catch (e) {
      console.error("Error reading value:", e);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const [doubt, setDoubt] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log(`${API_URL}/students/getDoubts/${user._id}`);
      try {
        const res = await axios.get(
          `${API_URL}/students/getDoubts/${user?._id}`
        );
        setDoubt(res.data.doubts);
        setLoading(false);
        console.log(res.data.doubts);
      } catch (error) {
        console.error(error);
        // alert("Something went wrong");
      }
    };
    if (user?._id) {
      fetchData();
    }
  }, [user]);

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
    <ScrollView showsVerticalScrollIndicator={false}>
      <VStack
        space="lg"
        style={{
          marginHorizontal: widthPercentageToDP(4.5),
        }}
      >
        <TouchableOpacity activeOpacity={0.8}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              backgroundColor: colors.Primary04,
              padding: 16,
              borderRadius: 8,
              marginTop: heightPercentageToDP(2),
            }}
            onPress={() => router.push("student/(screens)/doubt/newDoubt")}
          >
            <Box
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Image
                source={require("../../../../assets/appIcons/question.png")}
                style={{
                  width: 60,
                  height: 60,
                }}
              />
              <Text className="text-lg text-white text-center w-[250px] mx-auto font-primary font-bold">
                Ask a doubt
              </Text>
            </Box>
          </TouchableOpacity>
        </TouchableOpacity>
        <Text className="text-lg text-text font-primary  mt-4">Doubts</Text>

        <VStack space="4xl">
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
                  source={require("../../../../assets/appIcons/shock.png")}
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
                  <Text className="text-text mt-1 text-xs">
                    {new Date(item.createdAt)
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
                </VStack>
                <VStack
                  space="md"
                  style={{
                    marginTop: 16,
                  }}
                >
                  <Text className="text-sm text-text capitalize">
                    Assign {item.supportType} :
                  </Text>
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
                      {item.assignedToTeacher?.profilePic ? (
                        <Image
                          source={item.assignedToTeacher.profilePic}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 50,
                          }}
                        />
                      ) : (
                        <Image
                          source={require("../../../../assets/appIcons/teacher.png")}
                          style={{
                            width: 40,
                            height: 40,
                          }}
                        />
                      )}
                    </Box>
                    <VStack>
                      <Text className="text-base text-mainBlack/80 font-primary font-bold">
                        {item.assignedToTeacher.name}
                      </Text>
                      <Text className="text-text text-xs">
                        {item.assignedToTeacher.emailId}
                      </Text>
                    </VStack>
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
                source={require("../../../../assets/animation/search2.json")}
              />
              <Text className="text-xl text-text capitalize font-primary">
                No Doubts found.
              </Text>
            </View>
          )}
        </VStack>
      </VStack>
    </ScrollView>
  );
};

export default doubt;

const styles = StyleSheet.create({});
