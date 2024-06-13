import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { VStack } from "@gluestack-ui/themed";
import LiveClassesFullImageCard from "../../../components/LiveClassesFullImageCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import ScheduleClassCard from "../../../components/ScheduleClassCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, colors } from "../../../utils/constant";
import axios from "axios";
import LottieView from "lottie-react-native";

const messages = () => {
  const navigation = useNavigation();
  const [liveClassesData, setLiveClassesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(AsyncStorage.getItem("userData"));
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

  useEffect(() => {
    const fetchData = async () => {
      if (user?.classId?._id) {
        try {
          const response = await axios.get(
            `${API_URL}/teacher/getLiveClassById/${user?.classId?._id}`
          );
          // Filter out upcoming and today's live classes
          const filteredData = response.data.data.filter((item) => {
            const classDate = new Date(item.dateAndTime);
            const currentDate = new Date();
            return classDate >= currentDate;
          });
          // Sort the filtered data by dateAndTime
          const sortedData = filteredData.sort((a, b) => {
            return new Date(a.dateAndTime) - new Date(b.dateAndTime);
          });
          setLiveClassesData(sortedData);
          setLoading(false);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchData();
  }, [user?.classId?._id]);

  useEffect(() => {
    navigation.setOptions({
      title: "Live Classes",
      headerStyle: {
        fontFamily: "Urbanist",
      },
    });
  }, []);

  const insets = useSafeAreaInsets();

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
        style={{
          marginHorizontal: wp(4),
          paddingVertical: hp(0.5),
          paddingHorizontal: wp(1),
          marginTop: hp(2),
          marginBottom: hp(4),
        }}
        space="lg"
      >
        {liveClassesData && liveClassesData.length === 0 ? (
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
            <Text className="text-sm text-text capitalize font-primary">
              No Live Classes found.
            </Text>
          </View>
        ) : (
          liveClassesData.map((item, index) => (
            <LiveClassesFullImageCard data={item} key={index} />
          ))
        )}
      </VStack>
    </ScrollView>
  );
};

export default messages;

const styles = StyleSheet.create({});
