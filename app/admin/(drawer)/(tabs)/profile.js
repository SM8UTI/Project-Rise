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
    link: "admin/(screens)/profile/personalInformation",
  },
  {
    name: "Notifications",
    icon: "notification-2-line",
    link: "admin/(screens)/profile/notification",
  },
  {
    name: "Help & Support",
    icon: "questionnaire-line",
    link: "admin/(screens)/profile/helpSupport",
  },
];

const profile = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState();

  useEffect(() => {
    const getAdminData = async () => {
      try {
        const value = await AsyncStorage.getItem("adminData");
        setLoading(false);
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
            {adminData?.profilePic ? (
              <Box
                w={110}
                h={110}
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
              <Avatar bgColor={colors.Primary02} size="xl" borderRadius="$sm">
                <AvatarFallbackText>{adminData?.name}</AvatarFallbackText>
              </Avatar>
            )}
            <Box>
              <Text className="text-xl mb-2 pr-4 text-mainBlack/80 font-primary capitalize font-bold whitespace-normal w-full overflow-hidden">
                {adminData?.name && adminData?.name.length > 20
                  ? adminData?.name.slice(0, 20) + "..."
                  : adminData?.name}
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
                    {adminData?.emailId}
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
                    +91 {adminData?.phoneNumber}
                  </Text>
                </Box>
              </VStack>
            </Box>
          </HStack>
          <Box
            style={{
              flex: 1,
              padding: 8,
              borderRadius: 8,
            }}
            bg="$green500"
          >
            <Text className="text-sm text-white font-primary text-center">
              Admin Access
            </Text>
          </Box>
        </VStack>
        <VStack
          space="md"
          style={{
            marginHorizontal: widthPercentageToDP(4),
            marginTop: heightPercentageToDP(2),
          }}
        >
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default profile;

const styles = StyleSheet.create({});
