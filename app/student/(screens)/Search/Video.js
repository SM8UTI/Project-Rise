import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { VStack } from "@gluestack-ui/themed";
import { heightPercentageToDP } from "react-native-responsive-screen";
import VideoCard from "../../../../components/VideoCard";
import LottieView from "lottie-react-native";
import { colors } from "../../../../utils/constant";

const Video = ({ data }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, [data]);

  if (loading)
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          height: heightPercentageToDP(50),
        }}
      >
        <ActivityIndicator size="large" color={colors.Primary02} />
      </View>
    );

  return (
    <VStack
      space="md"
      style={{
        paddingBottom: 24,
      }}
    >
      {data.length > 0 ? (
        data.map((item, index) => <VideoCard data={item} key={index} />)
      ) : (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            minHeight: heightPercentageToDP(50),
          }}
        >
          <LottieView
            autoPlay
            loop
            style={{
              width: 300,
              height: 300,
            }}
            // Find more Lottie files at https://lottiefiles.com/featured
            source={require("../../../../assets/animation/search2.json")}
          />
          <Text className="text-xl text-text capitalize font-primary">
            No Videos found.
          </Text>
        </View>
      )}
    </VStack>
  );
};

export default Video;

const styles = StyleSheet.create({});
