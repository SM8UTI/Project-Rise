import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import axios from "axios";
import { API_URL, colors } from "../../../utils/constant";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { VStack } from "@gluestack-ui/themed";
import UpcomingExamCard from "./UpcomingExamCard";
import LottieView from "lottie-react-native";

const UpcomingExamList = ({ user }) => {
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestData = async () => {
      if (!user) return;
      try {
        const res = await axios.get(
          `${API_URL}/students/getAllExamQuiz/${user?.classId._id}/${user?._id}`
        );
        const testData = res.data.QuizData.filter((exam) => {
          const startDate = new Date(exam.startDate);
          const currentDate = new Date();
          return startDate > currentDate;
        });
        // console.log("upcoming", JSON.stringify(testData, null, 2));
        setUpcomingExams(testData);
        setLoading(false);
      } catch (error) {
        console.log(error);
        alert("Failed to fetch upcoming exams");
        setLoading(false);
      }
    };

    fetchTestData();

    const interVal = setInterval(() => {
      fetchTestData();
    }, 10000);

    return () => {
      clearInterval(interVal);
    };
  }, [user]);

  if (loading) {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          height: widthPercentageToDP("100%"),
        }}
      >
        <ActivityIndicator size="large" color={colors.Primary02} />
      </View>
    );
  }

  return (
    // <View>
    //   <Text>Upcoming Exams:</Text>
    //   {loading ? (
    //     <ActivityIndicator size="large" color="#0000ff" />
    //   ) : (
    //     <FlatList
    //       data={upcomingExams}
    //       renderItem={({ item }) => (
    //         <View>
    //           <Text>{item.name}</Text>
    //           <Text>Start Date: {item.startDate}</Text>
    //           <Text>End Date: {item.endDate}</Text>
    //           Add more details as needed
    //         </View>
    //       )}
    //       keyExtractor={(item) => item._id}
    //     />
    //   )}
    // </View>
    <View>
      <Text className="text-base text-text">Upcoming Exams</Text>
      <VStack
        space="md"
        style={{
          marginTop: heightPercentageToDP(2),
        }}
      >
        {upcomingExams && upcomingExams.length > 0 ? (
          upcomingExams.map((exam) => (
            <UpcomingExamCard data={exam} key={exam._id} />
          ))
        ) : (
          <VStack
            style={{
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
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
            <Text className="text-sm text-text text-center max-w-[200px] mx-auto">
              No Upcoming Exams Found, Please check back later.
            </Text>
          </VStack>
        )}
      </VStack>
    </View>
  );
};

export default UpcomingExamList;
