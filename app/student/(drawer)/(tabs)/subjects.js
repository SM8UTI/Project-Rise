import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../../../utils/constant";
import Icon from "react-native-remix-icon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import SubjectPercentageCard2 from "../../../../components/student/home/SubjectPercentageCard2";
import LottieView from "lottie-react-native";

const API_URL = "https://lms-backend-jr3g.onrender.com/api";

const dataSubjects = [
  // Add subject data as needed
];

const Subjects = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [user, setUser] = useState(null);
  const [subjectData, setSubjectData] = useState([]);
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

  useEffect(() => {
    const fetchSubjects = async () => {
      if (user?.classId) {
        try {
          const res = await axios.get(
            `${API_URL}/admin/getSubjects/${user.classId?._id}`
          );
          setSubjectData(res.data.subjects);
        } catch (error) {
          console.log(error);
          alert("Error in fetching subjects");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchSubjects();
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
        backgroundColor: colors.white,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + heightPercentageToDP(12),
          paddingTop: heightPercentageToDP(2),
        }}
      >
        {/* header  */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginHorizontal: widthPercentageToDP(4.5),
            paddingHorizontal: widthPercentageToDP(1),
            paddingVertical: heightPercentageToDP(0.5),
            marginTop: heightPercentageToDP(4),
          }}
        >
          <Text
            className="text-mainBlack font-primary font-bold"
            style={{ fontSize: 24 }}
          >
            Subjects
          </Text>
        </View>
        <View
          style={{
            marginHorizontal: widthPercentageToDP(4.5),
            paddingHorizontal: widthPercentageToDP(1),
            paddingVertical: heightPercentageToDP(0.5),
            marginTop: heightPercentageToDP(2),
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          {subjectData.map((item, index) => (
            <SubjectPercentageCard2
              subjectName={item.name}
              percentageComplete={item.percentageComplete || ""}
              chaptersNumber={item.chapterCount}
              subjectId={item._id}
              key={index}
            />
          ))}
        </View>
      </ScrollView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default Subjects;

const styles = StyleSheet.create({});
