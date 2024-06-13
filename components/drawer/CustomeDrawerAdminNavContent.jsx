import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../utils/constant";
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
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Feather } from "@expo/vector-icons";
export default function CustomeDrawerAdminNavContent(props) {
  const navigation = useNavigation();
  const [adminData, setAdminData] = useState(AsyncStorage.getItem("adminData"));
  useEffect(() => {
    const getAdminData = async () => {
      try {
        const value = await AsyncStorage.getItem("adminData");
        if (value !== null) {
          setAdminData(JSON.parse(value));
          console.log("Admin Data", JSON.parse(value));
        }
      } catch (e) {
        console.error("Error reading value:", e);
      }
    };
    getAdminData();
  }, []);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("adminData");
      // Navigate to login screen
      // router.push("/student/login");
      navigation.reset({
        index: 0,
        routes: [{ name: "admin/login" }],
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
            {adminData?.profilePic ? (
              <Box
                w={60}
                h={60}
                style={{
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <Image
                  source={adminData.profilePic}
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
                  {adminData?.name}
                </AvatarFallbackText>
              </Avatar>
            )}
            <View>
              <Text className="text-lg font-primary text-white font-bold ">
                {adminData?.name || "Teacher Name"}
              </Text>
              <Text className="text-xs font-primary text-white uppercase opacity-80">
                Admin Access
              </Text>
            </View>
          </View>
        </LinearGradient>
        <View className="flex-1 flex-col">
          <DrawerItem
            label="Students"
            labelStyle={{
              color: colors.text,
              fontFamily: "Urbanist",
              fontSize: 16,
            }}
            icon={({ color }) => (
              <Feather name="users" size={24} color={color} />
            )}
            onPress={() => router.push("admin/(screens)/studentManagement")}
          />
          <DrawerItem
            label="Teachers"
            labelStyle={{
              color: colors.text,
              fontFamily: "Urbanist",
              fontSize: 16,
            }}
            icon={({ color }) => (
              <Feather name="users" size={24} color={color} />
            )}
            onPress={() => router.push("admin/(screens)/teacherManagement")}
          />

          <DrawerItem
            label="Classes"
            labelStyle={{
              color: colors.text,
              fontFamily: "Urbanist",
              fontSize: 16,
            }}
            icon={({ color }) => (
              <MaterialCommunityIcons
                name="google-classroom"
                size={24}
                color={color}
              />
            )}
            onPress={() => router.push("admin/(screens)/classManagement")}
          />
          <DrawerItem
            label="Subjects"
            labelStyle={{
              color: colors.text,
              fontFamily: "Urbanist",
              fontSize: 16,
            }}
            icon={({ color }) => (
              <Icon name="book-2-line" size={24} color={color} />
            )}
            onPress={() => router.push("admin/(screens)/subjectManagement")}
          />
          <DrawerItem
            label="Banners"
            labelStyle={{
              color: colors.text,
              fontFamily: "Urbanist",
              fontSize: 16,
            }}
            icon={({ color }) => (
              <Icon name="image-line" size={24} color={color} />
            )}
            onPress={() => router.push("admin/(screens)/bannerManagement")}
          />
        </View>
        <View className="px-4 mt-16 flex-col">
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
