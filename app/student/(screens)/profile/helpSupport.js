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
    url: "https://www.facebook.com/prayasinstituteofficial",
    icon: "facebook-line",
  },
  {
    name: "Twitter Page Link",
    url: "https://twitter.com/mantra_prayas",
    icon: "twitter-line",
  },
  {
    name: "Instagram Page Link",
    url: "https://www.instagram.com/prayas_institute_bhl/",
    icon: "instagram-line",
  },
  {
    name: "LinkedIn Page Link",
    url: "https://www.linkedin.com/in/prayas-institute-13831b232/",
    icon: "linkedin-box-line",
  },
  {
    name: "YouTube Channel",
    url: "https://www.youtube.com/channel/UCO4AGHWrJF9byVPncMVqqAw",
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
            Address: F-799 near Solanki vatika shastri nagar main road, Bhilwara
            311001
          </Text>
          <Text className="text-sm text-text font-primary text-center mt-1">
            Contact Number: 8982845157
          </Text>
          <Text className="text-sm text-text font-primary text-center mt-1">
            Email: Mantra.prayas@gmail.com
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
