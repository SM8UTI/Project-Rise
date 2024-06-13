import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { API_URL, colors } from "../../../../utils/constant";
import {
  VStack,
  HStack,
  Box,
  Button,
  ButtonIcon,
  ButtonText,
} from "@gluestack-ui/themed";
import Icon from "react-native-remix-icon";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Chapter from "./Chapter";
import ClassLog from "./ClassLog";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import LottieView from "lottie-react-native";
const subjectId = () => {
  const { subjectId } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [subjectData, setSubjectData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("chapter");
  const [chapterData, setChapterData] = useState([]);
  const [classLogData, setClassLogData] = useState([]);
  // const [classId, setClassId] = useState("");
  const [user, setUser] = useState({});

  const getUser = async () => {
    try {
      const value = await AsyncStorage.getItem("userData");
      if (value !== null) {
        setUser(JSON.parse(value));
        // setLoading(false);
      }
    } catch (e) {
      console.error("Error reading value:", e);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    const getSubject = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/admin/getSubjectInfo/${subjectId}`
        );
        console.log(res.data);
        setSubjectData(res.data);
        setChapterData(res.data.chapters);
        subjectCheck(res.data?.subject?.name);

        setLoading(false);
      } catch (error) {
        console.log(error);
        alert("Error fetching subject");
      }
    };
    getSubject();
  }, [subjectId]);

  const subjectIcon = {
    mathematics: require("../../../../assets/appIcons/math.png"),
    biology: require("../../../../assets/appIcons/bio.png"),
    zoology: require("../../../../assets/appIcons/zoo.png"),
    geography: require("../../../../assets/appIcons/geo.png"),
    english: require("../../../../assets/appIcons/eng.png"),
    history: require("../../../../assets/appIcons/his.png"),
    physics: require("../../../../assets/appIcons/physic.png"),
    chemistry: require("../../../../assets/appIcons/chemistry.png"),
  };

  const subjectColor = {
    mathematics: "#5C7CFA",
    biology: "#21A366",
    zoology: "#E91E63",
    geography: "#0B97E8",
    english: "#D6A203",
    history: "#EB7900",
    physics: "#CC5DE8",
    chemistry: "#2196F3",
  };

  const [subjectCSS, setSubjectCSS] = useState({
    image: "",
    color: "",
  });

  const subjectCheck = (subjectName) => {
    const subject = subjectName?.toLowerCase();
    if (subject?.includes("math")) {
      setSubjectCSS({
        image: subjectIcon.mathematics,
        color: subjectColor.mathematics,
      });
    } else if (subject?.includes("bio")) {
      setSubjectCSS({
        image: subjectIcon.biology,
        color: subjectColor.biology,
      });
    } else if (subject?.includes("zoo")) {
      setSubjectCSS({
        image: subjectIcon.zoology,
        color: subjectColor.zoology,
      });
    } else if (subject?.includes("geo")) {
      setSubjectCSS({
        image: subjectIcon.geography,
        color: subjectColor.geography,
      });
    } else if (subject?.includes("eng")) {
      setSubjectCSS({
        image: subjectIcon.english,
        color: subjectColor.english,
      });
    } else if (subject?.includes("his")) {
      setSubjectCSS({
        image: subjectIcon.history,
        color: subjectColor.history,
      });
    } else if (subject?.includes("physic")) {
      setSubjectCSS({
        image: subjectIcon.physics,
        color: subjectColor.physics,
      });
    } else if (subject?.includes("chemi")) {
      setSubjectCSS({
        image: subjectIcon.chemistry,
        color: subjectColor.chemistry,
      });
    }
  };

  useEffect(() => {
    const getCLassLog = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/teacher/getClassLog/${user?.classId._id}/${subjectId}`
        );
        // console.log("class log ", res.data.classLogs);
        setClassLogData(res.data.classLogs);
      } catch (error) {
        console.log(error);
        alert("Error fetching class log");
      }
    };
    if (user?.classId && subjectId) {
      getCLassLog();
    }
  }, [user, subjectId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
    <View
      contentContainerStyle={{
        paddingBottom: insets.bottom,
        flex: 1,
      }}
    >
      <VStack
        style={{
          marginHorizontal: widthPercentageToDP(4.5),
          marginTop: heightPercentageToDP(1),
        }}
        space="md"
      >
        <Box
          bg="#fff"
          style={{
            padding: 16,
            borderRadius: 8,
            backgroundColor: subjectCSS.color + "20",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            source={subjectCSS.image}
            style={{
              width: 50,
              height: 50,
            }}
          />
          <View
            style={{
              marginLeft: 12,
            }}
          >
            <Text
              className="text-xl  text-mainBlack/80 capitalize font-bold"
              style={{
                fontFamily: "Urbanist",
                color: subjectCSS.color,
              }}
            >
              {subjectData?.subject?.name}
            </Text>
            <Text
              className="text-sm mt-1 text-text"
              style={{
                fontFamily: "Urbanist",
                color: subjectCSS.color,
              }}
            >
              {subjectData.chapters ? subjectData.chapters.length : 0} Chapters
            </Text>
          </View>
        </Box>
      </VStack>
      <HStack>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            borderBottomColor:
              selectedTab === "chapter" ? colors.Primary04 : colors.text + "20",
            borderBottomWidth: selectedTab === "chapter" ? 3 : 1,
            paddingVertical: 16,
          }}
          onPress={() => setSelectedTab("chapter")}
        >
          <Text
            style={{
              fontSize: 16,
              color: selectedTab === "chapter" ? colors.Primary04 : colors.text,
              fontFamily: "Urbanist",
              marginTop: heightPercentageToDP(2),
              marginLeft: widthPercentageToDP(4),
              textAlign: "center",
              fontWeight: selectedTab === "chapter" ? "bold" : "normal",
            }}
          >
            Chapters
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            borderBottomColor:
              selectedTab === "classLog"
                ? colors.Primary04
                : colors.text + "20",
            borderBottomWidth: selectedTab === "classLog" ? 3 : 1,
            paddingVertical: 16,
          }}
          onPress={() => setSelectedTab("classLog")}
        >
          <Text
            style={{
              fontSize: 16,
              color:
                selectedTab === "classLog" ? colors.Primary04 : colors.text,
              fontFamily: "Urbanist",
              marginTop: heightPercentageToDP(2),
              marginLeft: widthPercentageToDP(4),
              textAlign: "center",
              fontWeight: selectedTab === "classLog" ? "bold" : "normal",
            }}
          >
            Class Logs
          </Text>
        </TouchableOpacity>
      </HStack>
      <ScrollView
        horizontal={false}
        showsVerticalScrollIndicator={false}
        style={{
          marginHorizontal: widthPercentageToDP(4.5),
          paddingTop: heightPercentageToDP(1),
          height: heightPercentageToDP(70),
        }}
      >
        {selectedTab === "chapter" ? (
          <Chapter data={chapterData} />
        ) : (
          <ClassLog data={classLogData} />
        )}
      </ScrollView>
    </View>
  );
};

export default subjectId;

const styles = StyleSheet.create({});
