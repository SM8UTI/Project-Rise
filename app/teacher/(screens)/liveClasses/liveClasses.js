import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { VStack } from "@gluestack-ui/themed";
import { Image } from "expo-image";
import { Box } from "@gluestack-ui/themed";
import { API_URL, colors } from "../../../../utils/constant";
import LottieView from "lottie-react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import LiveClassesFullImageCard from "../../../../components/LiveClassesFullImageCard";

const liveClasses = () => {
  const [liveClassesData, setLiveClassesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classId, setClassId] = useState(null);
  const [teacherData, setTeacherData] = useState({});

  useEffect(() => {
    const getId = async () => {
      const id = await AsyncStorage.getItem("classId");
      console.log(id);
      setClassId(id);
      const value = await AsyncStorage.getItem("teacherData");
      if (value !== null) {
        setTeacherData(JSON.parse(value));
      }
    };
    getId();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (classId) {
        try {
          const response = await axios.get(
            `${API_URL}/teacher/getLiveClassById/${classId}`
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
  }, [classId]);

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
        paddingBottom: heightPercentageToDP(4),
        paddingHorizontal: widthPercentageToDP(4.5),
      }}
    >
      <VStack space="lg">
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            backgroundColor: colors.Primary04,
            padding: 16,
            borderRadius: 8,
            marginTop: heightPercentageToDP(2),
          }}
          onPress={() =>
            router.push("teacher/(screens)/liveClasses/newLiveClasses")
          }
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
              source={require("../../../../assets/appIcons/liveClasses.png")}
              style={{
                width: 60,
                height: 60,
              }}
            />
            <Text className="text-lg text-white text-center w-[250px] mx-auto font-primary font-bold">
              Create New Live Class
            </Text>
          </Box>
        </TouchableOpacity>
        <Text className="text-lg text-text font-primary">Live Classes</Text>
        <VStack space="md">
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
                source={require("../../../../assets/animation/search2.json")}
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
      </VStack>
    </ScrollView>
  );
};

export default liveClasses;

const styles = StyleSheet.create({});
