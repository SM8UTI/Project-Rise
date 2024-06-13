import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { Box, HStack } from "@gluestack-ui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, colors } from "../../../../utils/constant";
import axios from "axios";
import SubjectCard from "../../../../components/SubjectCard";
import { StatusBar } from "expo-status-bar";
import SubjectPercentageCard2 from "../../../../components/teacher/SubjectPercentage2";

const Subjects = () => {
  const insets = useSafeAreaInsets();

  const [subjects, setSubjects] = useState([]);
  const [classId, setClassId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getId = async () => {
      const id = await AsyncStorage.getItem("classId");
      setClassId(id);
    };
    getId();
  }, []);

  const [classData, setClassData] = useState([]);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/getClasses`);
        setClassData(res.data.classes);

        // console.log(res.data.classes);
      } catch (error) {
        console.log(error);
        alert("Error fetching class data.");
      }
    };
    fetchClassData();
  }, []);

  function getClassById(classId) {
    const classItem = classData.find((classItem) => classItem._id === classId);
    return classItem ? classItem.name : null;
  }

  useEffect(() => {
    const getSubjects = async () => {
      console.log(classId);
      try {
        if (classId) {
          const res = await axios.get(
            `${API_URL}/admin/getSubjects/${classId}`
          );
          console.log(res.data);
          setSubjects(res.data.subjects);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        alert("Error fetching data");
      }
    };
    getSubjects();
  }, [classId]);

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
        <ActivityIndicator size="large" color={colors.Primary04} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#fff",
        flex: 1,
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
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginHorizontal: widthPercentageToDP(4),
            paddingHorizontal: widthPercentageToDP(1),
            paddingVertical: heightPercentageToDP(0.5),
            marginTop: heightPercentageToDP(2),
          }}
        >
          <Text
            className="text-mainBlack/80 font-primary font-bold"
            style={{
              fontSize: 24,
            }}
          >
            Subjects
          </Text>
          <Box
            style={{
              padding: 4,
              paddingHorizontal: 8,
              backgroundColor: colors.Primary02,
              borderRadius: 500,
            }}
          >
            <Text className="text-sm text-white font-primary">
              {getClassById(classId) ? getClassById(classId) : "Class"}
            </Text>
          </Box>
        </View>
        <HStack
          space="md"
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
          {subjects.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: heightPercentageToDP(10),
                height: heightPercentageToDP(50),
              }}
            >
              <Text className="text-sm text-text text-bold">No Subjects</Text>
            </View>
          ) : (
            subjects.map((item) => (
              <SubjectPercentageCard2
                subjectName={item.name}
                percentageComplete={item.percentageComplete || ""}
                chaptersNumber={item.chapterCount}
                subjectId={item._id}
                key={item._id}
              />
            ))
          )}
        </HStack>
      </ScrollView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default Subjects;

const styles = StyleSheet.create({});
