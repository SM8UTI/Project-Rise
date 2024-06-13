import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";
import { API_URL, colors } from "../../../../utils/constant";
import Icon from "react-native-remix-icon";
import TextHeadingSection from "../../../../components/TextHeadingSection";
import LiveExamCard from "../../../../components/LiveExamCard";
import { VStack } from "@gluestack-ui/themed";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";
import UpcomingExamList from "../../../../components/student/exam/UpcomingExamList";
import LiveExamList from "../../../../components/student/exam/LiveExamList";

const exam = () => {
  const insets = useSafeAreaInsets();

  const [testData, setTestData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

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
    const fetchTestData = async () => {
      if (!user) return;
      try {
        const res = await axios.get(
          `${API_URL}/students/getAllExamQuiz/${user?.classId._id}/${user?._id}`
        );
        setTestData(res.data.QuizData);
        setLoading(false);
        console.log(JSON.stringify(res.data.QuizData, null, 2));
      } catch (error) {
        console.log(error);
        alert("Failed to fetch test data");
      }
    };

    fetchTestData();
  }, [user]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <LottieView
          autoPlay
          loop
          style={{
            width: 200,
            height: 200,
          }}
          // Find more Lottie files at https://lottiefiles.com/featured
          source={require("../../../../assets/animation/loading.json")}
        />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + heightPercentageToDP(12),
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginHorizontal: widthPercentageToDP(4.5),
            // paddingHorizontal: widthPercentageToDP(1),
            paddingVertical: heightPercentageToDP(0.5),
            marginTop: heightPercentageToDP(2),
          }}
        >
          <Text
            className="text-mainBlack font-primary font-bold"
            style={{
              fontSize: 24,
            }}
          >
            Exams
          </Text>
          {/* <TouchableOpacity
            activeOpacity={0.8}
            style={{
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <LinearGradient
              colors={colors.gr1}
              style={{
                height: 50,
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                paddingHorizontal: 16,
                maxWidth: 150,
              }}
            >
              <Icon name="medal-line" size="20" color={"#fff"} />
              <Text className="text-sm text-center capitalize ml-2 text-white">
                Leaderboards
              </Text>
            </LinearGradient>
          </TouchableOpacity> */}
        </View>

        {/* <TextHeadingSection sectionName={"Live Exam"}>
          <VStack
            style={{
              paddingRight: widthPercentageToDP(4.5),
            }}
            space="md"
          >
            {testData.map((exam) => (
              <LiveExamCard
                key={exam._id}
                data={{
                  title: exam.name,
                  subject: exam.subject,
                  time: exam.totalTime,
                  id: exam._id,
                  teacher: exam.teacher,
                  startDate: exam.startDate,
                  endDate: exam.endDate,
                  date: exam.date,
                  scorePerQuestion: exam.scorePerQuestion,
                  negativeMark: exam.negativeMark,
                }}
              />
            ))}
          </VStack>
        </TextHeadingSection> */}
        <VStack
          space="md"
          style={{
            marginHorizontal: widthPercentageToDP(4.5),
          }}
        >
          <LiveExamList user={user} />
          <UpcomingExamList user={user} />
        </VStack>
      </ScrollView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default exam;

const styles = StyleSheet.create({});
