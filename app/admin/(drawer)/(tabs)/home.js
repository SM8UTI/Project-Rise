import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Box, HStack, VStack } from "@gluestack-ui/themed";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { Image } from "expo-image";
import { colors } from "../../../../utils/constant";
import HomeCarsoul from "../../../../components/student/home/HomeCarsoul";
import LottieView from "lottie-react-native";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import { API_URL } from "../../../../utils/constant";

const home = () => {
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    await axios.get(`${API_URL}/admin/getUserCounts`).then((res) => {
      console.log("Fetching....");
      setData(res.data);
      console.log(res.data);
    });
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.white,
        }}
      >
        <LottieView
          autoPlay
          loop
          style={{
            width: 200,
            height: 200,
          }}
          source={require("../../../../assets/animation/loading.json")}
        />
        <StatusBar style="dark" />
      </View>
    );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      {/* header  */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + heightPercentageToDP(12),
        }}
      >
        <VStack
          space="md"
          style={{
            marginHorizontal: widthPercentageToDP(4.5),
            marginTop: heightPercentageToDP(2),
          }}
        >
          <Text className="text-xl text-mainBlack/80 font-bold">Home</Text>
          <VStack space="md">
            <HStack space="md">
              <Box
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  padding: 16,
                  borderRadius: 8,
                  borderColor: colors.black + "15",
                  borderWidth: 1,
                }}
                bg={colors.bgColor + "40"}
              >
                <Image
                  source={require("../../../../assets/appIcons/graduating-student.png")}
                  style={{
                    width: 60,
                    height: 60,
                  }}
                />
                <View>
                  <Text className="text-sm text-text font-primary">
                    Total Students
                  </Text>
                  <Text className="text-2xl text-mainBlack/80 font-bold font-primary uppercase">
                    {data.studentCount}
                  </Text>
                </View>
              </Box>
              <Box
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  padding: 16,
                  borderRadius: 8,
                  borderColor: colors.black + "15",
                  borderWidth: 1,
                }}
                bg={colors.bgColor + "40"}
              >
                <Image
                  source={require("../../../../assets/appIcons/teacher.png")}
                  style={{
                    width: 60,
                    height: 60,
                  }}
                />
                <View>
                  <Text className="text-sm text-text font-primary">
                    Total Teachers
                  </Text>
                  <Text className="text-2xl text-mainBlack/80 font-bold font-primary uppercase">
                    {data.teacherCount}
                  </Text>
                </View>
              </Box>
            </HStack>
          </VStack>
        </VStack>
        <HomeCarsoul />
      </ScrollView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default home;

const styles = StyleSheet.create({});
