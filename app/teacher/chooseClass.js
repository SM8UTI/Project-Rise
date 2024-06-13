import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { HStack, Button, ButtonIcon, ButtonText } from "@gluestack-ui/themed";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { router, useNavigation } from "expo-router";
import { API_URL, colors } from "../../utils/constant";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-remix-icon";

const chooseClass = () => {
  const navigation = useNavigation();
  const [classID, setClassID] = useState(null);

  const [classData, setClassData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [teacherData, setTeacherData] = useState(null);

  useEffect(() => {
    const getTeacher = async () => {
      try {
        const value = await AsyncStorage.getItem("teacherData");
        setLoading(false);
        if (value !== null) {
          setTeacherData(JSON.parse(value));
          console.log("Teacher Data", JSON.parse(value));
        }
      } catch (e) {
        console.error("Error reading value:", e);
      }
    };
    getTeacher();
  }, []);

  useEffect(() => {
    setClassData(teacherData?.classes || []);
  }, [teacherData]);

  // useEffect(() => {
  //   const fetchClass = async () => {
  //     consol.log("teacherData", teacherData?._id);
  //     try {
  //       const response = await axios.get(
  //         `${API_URL}/admin/getTeacher/${teacherData?._id}`
  //       );
  //       console.log(response.data.teacher);
  //       setClassData(response.data.teacher.classes);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error(error);
  //       alert("Error fetching data");
  //     }
  //   };
  //   if (teacherData?._id) {
  //     fetchClass();
  //   }
  // }, []);

  const handleClick = (id) => {
    setClassID(id);
    AsyncStorage.setItem("classId", id);
    router.push("teacher/(drawer)/(tabs)/home");
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("teacherData");
      await AsyncStorage.removeItem("classId");
      // Navigate to login screen
      // router.push("/student/login");
      navigation.reset({
        index: 0,
        routes: [{ name: "teacher/login" }],
      });
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.Primary04} />
      </View>
    );
  }

  return (
    <SafeAreaView className="bg-white pt-0 w-full h-full flex-1 items-center justify-center">
      <View>
        <Text className="text-center text-mainBlack text-3xl font-primary font-bold w-[300px] mx-auto">
          Choose your Class to Update Content.
        </Text>
        <Text className="text-sm text-text px-6 text-center mt-2">
          This is the chooseClass screen for the teacher. You can start by
          selecting a class to view the students and other details.
        </Text>
        <HStack
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            marginHorizontal: widthPercentageToDP(4.5),
            marginTop: heightPercentageToDP(4),
          }}
        >
          {classData.length === 0 ? (
            <View
              style={{
                fontFamily: "Urbanist",
              }}
            >
              <Text
                className="text-center px-3 py-2 rounded-[4px]  text-red-500 bg-red-50 text-sm font-primary w-[300px] mx-auto"
                style={{
                  fontFamily: "Urbanist",
                }}
              >
                No classes assigned to you. Contact Admin.
              </Text>
              {/* <Button
                onPress={logout}
                style={{
                  backgroundColor: colors.Primary09,
                  borderWidth: 1,
                  borderColor: colors.Primary02,
                  borderRadius: 8,
                  marginHorizontal: widthPercentageToDP(4.5),
                  marginTop: heightPercentageToDP(4),
                }}
                size="lg"
              >
                <ButtonIcon
                  as={() => (
                    <Icon
                      name="logout-circle-line"
                      size={20}
                      color={colors.Primary02}
                    />
                  )}
                />
                <ButtonText
                  style={{
                    color: colors.Primary02,
                    fontSize: 15,
                    fontFamily: "Urbanist",
                    fontWeight: 500,
                    marginLeft: 8,
                  }}
                  onPress={() => {
                    logout();
                  }}
                >
                  Logout
                </ButtonText>
              </Button> */}
              <Button
                onPress={logout}
                style={{
                  backgroundColor: colors.Primary02,
                  borderWidth: 1,
                  borderColor: colors.Primary02,
                  borderRadius: 8,
                  marginTop: heightPercentageToDP(4),
                }}
                size="lg"
              >
                <ButtonIcon
                  as={() => (
                    <Icon
                      name="logout-circle-line"
                      size={20}
                      color={colors.white}
                    />
                  )}
                />
                <ButtonText
                  style={{
                    fontFamily: "Urbanist",
                    marginLeft: 8,
                  }}
                >
                  Logout
                </ButtonText>
              </Button>
            </View>
          ) : (
            classData.map((item, index) => (
              <TouchableOpacity
                activeOpacity={0.8}
                key={index}
                className="w-[100px] h-[100px] bg-Primary04 rounded-md p-4 m-2 items-center justify-center"
                onPress={() => handleClick(item.classId)}
              >
                <Text className="text-lg text-center text-white font-primary font-bold">
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </HStack>
      </View>
    </SafeAreaView>
  );
};

export default chooseClass;

const styles = StyleSheet.create({});
