import axios from "axios";
import React, { useEffect, useState } from "react";
import { Dimensions, Text, View, StyleSheet } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { API_URL } from "../../../utils/constant";
import { Image } from "expo-image";

const HomeCarsoul = () => {
  const width = Dimensions.get("window").width;
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/getBanners`);
        setData(res.data.banners);
        // console.log("banner", res.data.banners);
      } catch (error) {
        console.log(error);
        alert("Error Fetch Banner List");
      }
    };
    fetchBanner();
  }, []);

  return (
    <View style={styles.Container}>
      <Carousel
        loop
        width={width - 40}
        height={width / 2}
        autoPlay={true}
        data={data}
        scrollAnimationDuration={1000}
        // onSnapToItem={(index) => console.log("current index:", index)}
        style={{ paddingHorizontal: wp(4.5) }}
        renderItem={({ item, index }) => (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              borderRadius: 8,
              backgroundColor: "#fff",
              height: 200,
              overflow: "hidden",
            }}
          >
            <Image source={item.image} className="w-full h-full object-cover" />
          </View>
        )}
      />
    </View>
  );
};

export default HomeCarsoul;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    marginTop: hp(4),
    borderRadius: 8,
    marginHorizontal: wp(4.5),
  },
});
