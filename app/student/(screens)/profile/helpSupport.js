import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Linking,
  Image,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { Box, VStack, Avatar, HStack } from "@gluestack-ui/themed";
import { colors } from "../../../../utils/constant";
import Icon from "react-native-remix-icon";
const socialMediaLinks = [
  {
    name: "Facebook Page Link",
    url: "",
    icon: "facebook-line",
  },
  {
    name: "Twitter Page Link",
    url: "",
    icon: "twitter-line",
  },
  {
    name: "Instagram Page Link",
    url: "",
    icon: "instagram-line",
  },
  {
    name: "LinkedIn Page Link",
    url: "",
    icon: "linkedin-box-line",
  },
  {
    name: "YouTube Channel",
    url: "",
    icon: "youtube-line",
  },
];

const helpSupport = () => {
  const insets = useSafeAreaInsets();

  const openLink = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't load page", err)
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: insets.bottom + hp(12),
        paddingHorizontal: wp(4),
      }}
    >
      <VStack
        space="2xl"
        style={{
          marginTop: hp(2),
          paddingHorizontal: wp(4),
          backgroundColor: colors.white,
          padding: 16,
          borderRadius: 8,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          style={{
            width: wp(40),
            height: wp(40),
            borderRadius: wp(2),
            marginTop: hp(2),
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <Image
            source={require("../../../../assets/icon.png")}
            className="w-full h-full"
            resizeMode="contain"
          />
        </Box>
        <View
          style={{
            paddingVertical: hp(2),
          }}
        >
          <Text className="text-base font-primary text-center font-bold">
            Contact Information – Head Office
          </Text>
          <Text className="text-sm text-text font-primary text-center mt-1">
            Address: 
          </Text>
          <Text className="text-sm text-text font-primary text-center mt-1">
            Contact Number: 
          </Text>
          <Text className="text-sm text-text font-primary text-center mt-1">
            Email: 
          </Text>
        </View>

        <HStack
          space="md"
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: hp(2),
          }}
        >
          {socialMediaLinks.map((item, index) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => openLink(item.url)}
              style={{
                backgroundColor: colors.Primary02,
                padding: wp(2),
                borderRadius: 500,
              }}
              key={index}
            >
              <Icon name={item.icon} size="24" color={colors.white} />
            </TouchableOpacity>
          ))}
        </HStack>
      </VStack>
    </ScrollView>
  );
};

export default helpSupport;
