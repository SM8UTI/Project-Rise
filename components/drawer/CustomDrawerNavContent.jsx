import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { API_URL, colors } from "../../utils/constant";
import { Image, View, Text, TouchableOpacity } from "react-native";
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
} from "@gluestack-ui/themed";
import { router, useNavigation } from "expo-router";
import axios from "axios";
export default function CustomDrawerNavContent(props) {
  const navigation = useNavigation();
  const [user, setUser] = useState(AsyncStorage.getItem("userData"));

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

  // src/api/auth.js
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");
      // Navigate to login screen
      // router.push("/student/login");
      navigation.reset({
        index: 0,
        routes: [{ name: "student/login" }],
      });
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

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

  return (
    <DrawerContentScrollView {...props}>
      <View className="flex-1 flex-col justify-between gap-4 h-full pb-4">
        <LinearGradient colors={colors.gr1} className="py-8 px-2">
          <View className="flex flex-row items-center gap-4">
            <View className=" w-[60px] h-[60px] rounded-full flex items-center justify-end overflow-hidden bg-white border-2 border-white">
              <Image
                source={{
                  uri: user.profilePic,
                }}
                className="w-full  h-full object-center object-cover"
              />
            </View>
            <View>
              <Text className="text-lg font-primary text-white font-bold ">
                {user.name}
              </Text>
              <Text className="text-xs font-primary text-white uppercase opacity-80">
                {user.classId?.name} - {user.rollNo}
              </Text>
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
            onPress={() => router.push("student/(screens)/liveClasses")}
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
            onPress={() => router.push("student/(drawer)/(tabs)/subjects")}
          />
          <DrawerItem
            label="Library"
            labelStyle={{
              color: colors.text,
              fontFamily: "Urbanist",
              fontSize: 16,
            }}
            icon={({ color }) => (
              <MaterialIcons name="bookmark-border" size={24} color={color} />
            )}
            onPress={() => router.push("student/(drawer)/(tabs)/(search)")}
          />
          <DrawerItem
            label="Attendance"
            labelStyle={{
              color: colors.text,
              fontFamily: "Urbanist",
              fontSize: 16,
            }}
            icon={({ color }) => (
              <MaterialIcons name="checklist" size={24} color={color} />
            )}
            onPress={() => {
              router.push("student/(screens)/attendance/attendance");
            }}
          />

          <DrawerItem
            label="Exam test"
            labelStyle={{
              color: colors.text,
              fontFamily: "Urbanist",
              fontSize: 16,
            }}
            icon={({ color }) => (
              <AntDesign name="copy1" size={24} color={color} />
            )}
            onPress={() => router.push("student/(drawer)/(tabs)/exam")}
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
          /> */}
          {/* <DrawerItem
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
        {/* <View className="px-4 mt-12">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              logout();
            }}
          >
            <Button
              style={{
                backgroundColor: colors.primary,
                borderRadius: 8,
              }}
            >
              <ButtonIcon
                as={() => (
                  <MaterialIcons name="logout" size={20} color={colors.white} />
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
              >
                Logout
              </ButtonText>
            </Button>
          </TouchableOpacity>
        </View> */}
      </View>
    </DrawerContentScrollView>
  );
}
