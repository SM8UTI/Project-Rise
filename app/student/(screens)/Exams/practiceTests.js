import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { VStack } from "@gluestack-ui/themed";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { API_URL, colors } from "../../../../utils/constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import LottieView from "lottie-react-native";
import PracticeExamCard from "../../../../components/student/exam/PracticeExamCard";

const practiceTests = () => {
  const [practiceTestsData, setPracticeTestsData] = useState([]);
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
          `${API_URL}/students/getAllPracticeQuiz/${user?.classId._id}/${user?._id}`
        );
        // const testData = res.data.QuizData.filter((exam) => {
        //   exam.type === "Practice";
        // });
        const testData = res.data.QuizData;

        console.log("Practice Test", JSON.stringify(testData, null, 2));
        setPracticeTestsData(testData);
        setLoading(false);
      } catch (error) {
        console.log(error);
        alert("Failed to fetch upcoming exams");
        setLoading(false);
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
        <ActivityIndicator size="large" color={colors.Primary02} />
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <VStack
        space="md"
        style={{
          marginHorizontal: widthPercentageToDP(4.5),
          marginTop: heightPercentageToDP(2),
        }}
      >
        {practiceTestsData && practiceTestsData.length > 0 ? (
          practiceTestsData.map((exam) => (
            <PracticeExamCard key={exam._id} userId={user?._id} data={exam} />
          ))
        ) : (
          <VStack
            style={{
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              height: heightPercentageToDP(50),
            }}
          >
            <LottieView
              autoPlay
              loop
              style={{
                width: 300,
                height: 300,
              }}
              source={require("../../../../assets/animation/search2.json")}
            />
            <Text className="text-sm text-text text-center max-w-[200px] mx-auto">
              No practice tests available.
            </Text>
          </VStack>
        )}
      </VStack>
    </ScrollView>
  );
};

export default practiceTests;

const styles = StyleSheet.create({});
