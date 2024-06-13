import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import {
  Box,
  Button,
  ButtonIcon,
  HStack,
  VStack,
  Avatar,
  AvatarFallbackText,
  ButtonText,
} from "@gluestack-ui/themed";
import { API_URL, colors } from "../../../../utils/constant";
import Icon from "react-native-remix-icon";
import { Image } from "expo-image";
import axios from "axios";
import { router, useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const linkData = [
  {
    name: "Personal Information",
    icon: "user-line",
    link: "teacher/(screens)/profile/personalInformation",
  },
  {
    name: "Notifications",
    icon: "notification-2-line",
    link: "teacher/(screens)/profile/notification",
  },
  {
    name: "Help & Support",
    icon: "questionnaire-line",
    link: "teacher/(screens)/profile/helpSupport",
  },
];

const profile = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [teacherData, setTeacherData] = useState({});
  const [loading, setLoading] = useState(true);

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

  // useEffect(() => {
  //   const teacherFetch = async () => {
  //     try {
  //       const res = await axios.get(`${API_URL}/admin/getTeacher/${teacherId}`);
  //       console.log(res.data.teacher);
  //       setTeacherData(res.data.teacher);
  //       setLoading(false);
  //     } catch (error) {
  //       console.log(error);
  //       alert("An error occurred. Please try again later.");
  //     }
  //   };

  //   teacherFetch();
  // }, [teacherId]);

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
    <SafeAreaView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + heightPercentageToDP(12),
        }}
      >
        <HStack
          space="md"
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginHorizontal: widthPercentageToDP(4),
            marginTop: heightPercentageToDP(1),
          }}
        >
          <Text className="text-xl text-mainBlack/80 font-primary">
            Profile
          </Text>
          <Button
            bg={colors.Primary02}
            borderRadius="$full"
            size="lg"
            p="$3.5"
            w={50}
            h={50}
            onPress={logout}
          >
            <ButtonIcon
              name="Logout"
              as={() => (
                <Icon name="logout-circle-r-line" size="20" color="#fff" />
              )}
            />
          </Button>
        </HStack>
        <VStack
          space="md"
          style={{
            marginHorizontal: widthPercentageToDP(4),
            marginTop: heightPercentageToDP(2),
          }}
        >
          <HStack
            space="md"
            style={{
              backgroundColor: colors.white,
              padding: 16,
              flexDirection: "row",
              flex: 1,
              borderRadius: 8,
            }}
          >
            {teacherData.profilePic ? (
              <Box
                w={110}
                h={110}
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
              <Avatar bgColor={colors.Primary02} size="xl" borderRadius="$sm">
                <AvatarFallbackText>{teacherData.name}</AvatarFallbackText>
              </Avatar>
            )}
            <Box>
              <Text className="text-xl mb-2 text-mainBlack/80 font-primary capitalize font-bold">
                {teacherData.name}
              </Text>
              <VStack space="sm">
                <Box
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Icon name="mail-line" size="16" color={colors.text} />
                  <Text className="text-sm text-mainBlack/60 font-primary ml-1">
                    {teacherData.emailId}
                  </Text>
                </Box>
                <Box
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Icon name="phone-line" size="16" color={colors.text} />
                  <Text className="text-sm text-mainBlack/60 font-primary ml-1">
                    +91 {teacherData.phoneNumber}
                  </Text>
                </Box>
              </VStack>
            </Box>
          </HStack>
        </VStack>
        <VStack
          space="md"
          style={{
            marginHorizontal: widthPercentageToDP(4),
            marginTop: heightPercentageToDP(2),
          }}
        >
          <Box
            style={{
              padding: 8,
              paddingHorizontal: 8,
              backgroundColor: colors.Primary04,
              borderRadius: 500,
              marginVertical: 8,
            }}
          >
            <Text className="text-sm text-center text-white font-primary">
              {getClassById(classId) ? getClassById(classId) : "Class"}
            </Text>
          </Box>
          {linkData.map((data, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={() => router.push(data.link)}
            >
              <HStack
                space="md"
                style={{
                  backgroundColor: colors.white,
                  padding: 16,
                  flexDirection: "row",
                  flex: 1,
                  borderRadius: 8,
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Icon name={data.icon} size="20" color={colors.Primary02} />
                  <Text className="text-base text-text font-primary capitalize ml-2">
                    {data.name}
                  </Text>
                </Box>
                <Icon
                  name="arrow-right-s-line"
                  size="24"
                  color={colors.Primary04}
                />
              </HStack>
            </TouchableOpacity>
          ))}
        </VStack>
        <Button
          size="lg"
          style={{
            marginHorizontal: widthPercentageToDP(4),
            marginTop: heightPercentageToDP(2),
            backgroundColor: colors.Primary09,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.Primary02,
          }}
          onPress={() => router.push("teacher/chooseClass")}
        >
          <ButtonIcon
            as={() => (
              <Icon
                name="arrow-left-right-line"
                size={18}
                color={colors.Primary02}
              />
            )}
          />
          <ButtonText
            style={{
              color: colors.Primary02,
              fontSize: 15,
              fontWeight: "bold",
              marginLeft: 4,
            }}
          >
            Switch Class
          </ButtonText>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

export default profile;

const styles = StyleSheet.create({});
