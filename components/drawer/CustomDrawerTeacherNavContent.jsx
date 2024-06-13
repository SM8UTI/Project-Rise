import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { API_URL, colors } from "../../utils/constant";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Button,
  ButtonText,
  ButtonIcon,
  ButtonSpinner,
  ButtonGroup,
  Avatar,
  AvatarFallbackText,
  Box,
} from "@gluestack-ui/themed";
import { router, useNavigation } from "expo-router";
import Icon from "react-native-remix-icon";
import { Image } from "expo-image";
import axios from "axios";
export default function CustomDrawerTeacherNavContent(props) {
  const navigation = useNavigation();
  const [teacherData, setTeacherData] = useState({});

  useEffect(() => {
    const getTeacher = async () => {
      try {
        const value = await AsyncStorage.getItem("teacherData");
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

  const [classId, setClassId] = useState(null);

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

  // src/api/auth.js
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

  return (
    <DrawerContentScrollView {...props}>
      <View className="flex-1 flex-col justify-between gap-4 h-full pb-4">
        <LinearGradient colors={colors.gr2} className="py-8 px-2">
          <View className="flex flex-row items-center gap-4">
            {teacherData?.profilePic ? (
              <Box
                w={60}
                h={60}
                style={{
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <Image
                  source={teacherData.profilePic}
                  alt="Profile Picture"
                  className="w-full h-full"
                />
              </Box>
            ) : (
              <Avatar bgColor={colors.white} size="md" borderRadius="$sm">
                <AvatarFallbackText
                  style={{
                    color: colors.Primary02,
                  }}
                >
                  {teacherData?.name}
                </AvatarFallbackText>
              </Avatar>
            )}
            <View>
              <Text className="text-lg font-primary text-white font-bold ">
                {teacherData?.name || "Teacher Name"}
              </Text>
              <Box
                style={{
                  padding: 6,
                  paddingHorizontal: 6,
                  backgroundColor: colors.white,
                  borderRadius: 500,
                  marginVertical: 8,
                }}
              >
                <Text className="text-sm text-center text-Primary02 font-primary">
                  {getClassById(classId) ? getClassById(classId) : "Class 00"}
                </Text>
              </Box>
            </View>
          </View>
        </LinearGradient>
        <View className="flex-1 flex-col">
          <DrawerItem
            label="Live Classes"
            labelStyle={{
              color: colors.text,
              fontFamily: "Urbanist",
              fontSize: 16,
            }}
            icon={({ color }) => (
              <MaterialIcons name="ondemand-video" size={24} color={color} />
            )}
            onPress={() =>
              router.push("teacher/(screens)/liveClasses/liveClasses")
            }
          />
          <DrawerItem
            label="Subjects"
            labelStyle={{
              color: colors.text,
              fontFamily: "Urbanist",
              fontSize: 16,
            }}
            icon={({ color }) => (
              <AntDesign name="book" size={24} color={color} />
            )}
            onPress={() => router.push("teacher/(drawer)/(tabs)/subjects")}
          />
          {/* <DrawerItem
            label="Academics"
            labelStyle={{
              color: colors.text,
              fontFamily: "Urbanist",
              fontSize: 16,
            }}
            icon={({ color }) => (
              <MaterialIcons name="bookmark-border" size={24} color={color} />
            )}
          /> */}
          {/* <DrawerItem
            label="Attendance"
            labelStyle={{
              color: colors.text,
              fontFamily: "Urbanist",
              fontSize: 16,
            }}
            icon={({ color }) => (
              <MaterialIcons name="checklist" size={24} color={color} />
            )}
          /> */}

          <DrawerItem
            label="Exam test & Quizss"
            labelStyle={{
              color: colors.text,
              fontFamily: "Urbanist",
              fontSize: 16,
            }}
            icon={({ color }) => (
              <AntDesign name="copy1" size={24} color={color} />
            )}
            onPress={() => router.push("teacher/(drawer)/(tabs)/exam")}
          />
          <DrawerItem
            label="Students Doubts"
            labelStyle={{
              color: colors.text,
              fontFamily: "Urbanist",
              fontSize: 16,
            }}
            icon={({ color }) => (
              <Icon name="questionnaire-line" size={24} color={color} />
            )}
            onPress={() => router.push("teacher/(screens)/studentDoubts")}
          />
          {/* <DrawerItem
            label="Results"
            labelStyle={{
              color: colors.text,
              fontFamily: "Urbanist",
              fontSize: 16,
            }}
            icon={({ color }) => (
              <AntDesign name="filetext1" size={24} color={color} />
            )}
          />
          <DrawerItem
            label="Leaderboards"
            labelStyle={{
              color: colors.text,
              fontFamily: "Urbanist",
              fontSize: 16,
            }}
            icon={({ color }) => (
              <SimpleLineIcons name="badge" size={24} color={color} />
            )}
          /> */}
        </View>
        <View className="px-4 mt-16 flex-col">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("teacher/chooseClass")}
          >
            <Button
              style={{
                backgroundColor: colors.primary,
                borderRadius: 8,
              }}
              size="lg"
            >
              <ButtonIcon
                as={() => (
                  <Icon name="exchange-line" size={20} color={colors.white} />
                )}
              />
              <ButtonText
                style={{
                  color: colors.white,
                  fontSize: 15,
                  fontFamily: "Urbanist",
                  fontWeight: 500,
                  marginLeft: 8,
                }}
                onPress={() => {
                  logout();
                }}
              >
                Change Class
              </ButtonText>
            </Button>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              marginTop: 16,
            }}
            onPress={logout}
          >
            <Button
              style={{
                backgroundColor: colors.Primary09,
                borderWidth: 1,
                borderColor: colors.Primary02,
                borderRadius: 8,
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
            </Button>
          </TouchableOpacity>
        </View>
      </View>
    </DrawerContentScrollView>
  );
}
