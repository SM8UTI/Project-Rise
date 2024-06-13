import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { API_URL, colors } from "../../../utils/constant";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { VStack } from "@gluestack-ui/themed";
import UpcomingExamCard from "./UpcomingExamCard";
import LottieView from "lottie-react-native";
import LiveExamCard from "./LiveExamCard";

const LiveExamList = ({ user }) => {
  const [liveExams, setLiveExams] = useState([]);

  useEffect(() => {
    const fetchTestData = async () => {
      if (!user) return;
      try {
        const res = await axios.get(
          `${API_URL}/students/getAllExamQuiz/${user?.classId._id}/${user?._id}`
        );
        const testData = res.data.QuizData.filter((exam) => {
          const startDate = new Date(exam.startDate);
          const endDate = new Date(exam.endDate);
          const currentDate = new Date();
          return startDate <= currentDate && endDate >= currentDate;
        });
        console.log("live", JSON.stringify(testData, null, 2));
        setLiveExams(testData);
      } catch (error) {
        console.log(error);
        alert("Failed to fetch live exams");
        setLoading(false);
      }
    };

    fetchTestData();
  }, [user]);

  return (
    liveExams &&
    liveExams.length > 0 && (
      <View>
        <Text className="text-base text-text">Live Exams</Text>
        <VStack
          space="md"
          style={{
            marginTop: heightPercentageToDP(2),
          }}
        >
          {liveExams.map((exam) => (
            <LiveExamCard key={exam._id} data={exam} userId={user?._id} />
          ))}
        </VStack>
      </View>
    )
  );
};

export default LiveExamList;

const styles = StyleSheet.create({});
