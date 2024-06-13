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
import Icon from "react-native-remix-icon";
import { Image } from "expo-image";
import axios from "axios";
import { router, useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../../../../utils/constant";
import LottieView from "lottie-react-native";

const linkData = [
  {
    name: "Personal Information",
    icon: "user-line",
    link: "student/(screens)/profile/personalInformation",
  },
  {
    name: "Notifications",
    icon: "notification-2-line",
    link: "student/(screens)/notifications",
  },
  {
    name: "Help & Support",
    icon: "questionnaire-line",
    link: "student/(screens)/profile/helpSupport",
  },
];

const profile = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(AsyncStorage.getItem("userData"));

  const getUser = async () => {
    try {
      const value = await AsyncStorage.getItem("userData");
      if (value !== null) {
        setUser(JSON.parse(value));
        setLoading(false);
      }
    } catch (e) {
      console.error("Error reading value:", e);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userData");
      await AsyncStorage.removeItem("userToken");
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

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.white,
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
        }}
      >
        <HStack
          space="md"
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginHorizontal: widthPercentageToDP(4.5),
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
          space="lg"
          style={{
            marginHorizontal: widthPercentageToDP(4.5),
            marginTop: heightPercentageToDP(2),
          }}
        >
          <HStack
            space="md"
            style={{
              backgroundColor: colors.white,
              padding: 4,
              flexDirection: "row",
              flex: 1,
              borderRadius: 8,
            }}
          >
            {user?.profilePic ? (
              <Box
                w={110}
                h={110}
                style={{
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <Image
                  source={user?.profilePic}
                  alt="Profile Picture"
                  className="w-full h-full"
                />
              </Box>
            ) : (
              <Avatar bgColor={colors.Primary02} size="xl" borderRadius="$sm">
                <AvatarFallbackText>{user?.name}</AvatarFallbackText>
              </Avatar>
            )}
            <Box>
              <Text className="text-xl mb-2 text-mainBlack/80 font-primary capitalize font-bold">
                {user?.name}
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
                    {user?.emailId && user?.emailId.length > 26
                      ? user?.emailId.slice(0, 26) + "..."
                      : user?.emailId}
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
                    +91 {user?.registeredMobileNo}
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
                  padding: 8,
                  flexDirection: "row",
                  flex: 1,
                  borderRadius: 8,
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 12,
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
