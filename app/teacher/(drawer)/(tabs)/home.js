import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { HStack, VStack } from "@gluestack-ui/themed";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import HomeCarsoul from "../../../../components/student/home/HomeCarsoul";
import LottieView from "lottie-react-native";
import { colors } from "../../../../utils/constant";
import ServiceCard from "../../../../components/student/ServiceCard";

const services = [
  {
    name: "Live Classes",
    image: require("../../../../assets/appIcons/liveClasses.png"),
    link: "teacher/(screens)/liveClasses/liveClasses",
  },
  {
    name: "Student Doubts",
    image: require("../../../../assets/appIcons/question.png"),
    link: "teacher/(screens)/studentDoubts",
  },
];

const home = () => {
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  if (loading)
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
          source={require("../../../../assets/animation/loading.json")}
        />
        <StatusBar style="dark" />
      </View>
    );

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
            marginTop: heightPercentageToDP(2),
          }}
        >
          <Text className="text-2xl text-mainBlack/80 font-bold">Home</Text>
        </VStack>
        <VStack
          space="md"
          style={{
            marginHorizontal: widthPercentageToDP(4.5),
            marginTop: heightPercentageToDP(2.5),
          }}
        >
          <Text className="text-xl font-primary font-medium text-text">
            Explore Services
          </Text>
          <HStack
            space="md"
            style={{
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
              marginTop: heightPercentageToDP(1),
            }}
          >
            {services.map((item, index) => (
              <ServiceCard
                serviceName={item.name}
                icon={item.image}
                link={item.link}
                key={index}
              />
            ))}
          </HStack>
        </VStack>
        <HomeCarsoul />
      </ScrollView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default home;

const styles = StyleSheet.create({});
