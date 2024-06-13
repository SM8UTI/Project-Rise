import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Box, HStack, VStack } from "@gluestack-ui/themed";
import Icon from "react-native-remix-icon";
import { colors } from "../../../../utils/constant";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Image } from "expo-image";

const masterManagementData = [
  {
    name: "Class",
    image: require("../../../../assets/appIcons/blackboard.png"),
    link: "/admin/(screens)/classManagement",
  },
  {
    name: "Subject",
    image: require("../../../../assets/appIcons/books.png"),
    link: "/admin/(screens)/subjectManagement",
  },
  {
    name: "Banner",
    image: require("../../../../assets/appIcons/advertisement.png"),
    link: "/admin/(screens)/bannerManagement",
  },
];

const masterManagement = () => {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      {/* header  */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + heightPercentageToDP(12),
        }}
      >
        <VStack
          space="md"
          style={{
            marginHorizontal: widthPercentageToDP(4.5),
          }}
        >
          <Text className="text-xl text-mainBlack/80 font-bold mb-2 mt-4">
            Master Management
          </Text>
          <VStack space="md">
            {masterManagementData.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  backgroundColor: colors.bgColor + "40",
                  borderRadius: 8,
                  padding: 16,
                  flex: 1,
                  borderColor: colors.black + "15",
                  borderWidth: 1,
                }}
                activeOpacity={0.8}
                onPress={() => {
                  router.push(item.link);
                }}
              >
                <Box
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <Image
                    source={item.image}
                    style={{
                      width: 50,
                      height: 50,
                    }}
                  />
                  <Text className="text-base text-text text-center capitalize ml-4">
                    {item.name} Management
                  </Text>
                </Box>
              </TouchableOpacity>
            ))}
          </VStack>
        </VStack>
      </ScrollView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default masterManagement;

const styles = StyleSheet.create({});
