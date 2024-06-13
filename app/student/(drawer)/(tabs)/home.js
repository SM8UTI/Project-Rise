import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { router, useNavigation } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { API_URL, colors } from "../../../../utils/constant";
import HomeStudentCard from "../../../../components/student/home/HomeStudentCard";
import { Ionicons } from "@expo/vector-icons";
import TextHeadingSection from "../../../../components/TextHeadingSection";
import { HStack, VStack } from "@gluestack-ui/themed";
import SubjectPercentageCard from "../../../../components/student/home/SubjectPercentageCard";
import HomeCarsoul from "../../../../components/student/home/HomeCarsoul";
import ServiceCard from "../../../../components/student/ServiceCard";
import LiveClassesFullImageCard from "../../../../components/LiveClassesFullImageCard";
import ScheduleClassCard from "../../../../components/ScheduleClassCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Box } from "@gluestack-ui/themed";
import { Image } from "expo-image";
import LottieView from "lottie-react-native";

// const dataSubjects = [
//   {
//     subjectName: "Mathematics",
//     chaptersNumber: 10,
//     percentageComplete: 10,
//   },
//   {
//     subjectName: "Science",
//     chaptersNumber: 10,
//     percentageComplete: 20,
//   },
//   {
//     subjectName: "English",
//     chaptersNumber: 10,
//     percentageComplete: 30,
//   },
//   {
//     subjectName: "Hindi",
//     chaptersNumber: 10,
//     percentageComplete: 40,
//   },
//   {
//     subjectName: "Social Science",
//     chaptersNumber: 10,
//     percentageComplete: 50,
//   },
//   {
//     subjectName: "Computer",
//     chaptersNumber: 10,
//     percentageComplete: 60,
//   },
//   {
//     subjectName: "Sanskrit",
//     chaptersNumber: 10,
//     percentageComplete: 70,
//   },
//   {
//     subjectName: "Physics",
//     chaptersNumber: 10,
//     percentageComplete: 80,
//   },
//   {
//     subjectName: "Chemistry",
//     chaptersNumber: 10,
//     percentageComplete: 90,
//   },
//   {
//     subjectName: "Biology",
//     chaptersNumber: 10,
//     percentageComplete: 100,
//   },
// ];

const ExploreServiceList = [
  {
    name: "Library",
    icon: require("../../../../assets/appIcons/book.png"),
    link: "student/(drawer)/(tabs)/(search)",
  },
  {
    name: "Attendance",
    icon: require("../../../../assets/appIcons/attendance.png"),
    link: "student/(screens)/attendance/attendance",
  },
  {
    name: "Performance",
    icon: require("../../../../assets/appIcons/performance.png"),
    link: "student/(drawer)/(tabs)/subjects",
  },
  {
    name: "Exam",
    icon: require("../../../../assets/appIcons/exam.png"),
    link: "student/(drawer)/(tabs)/exam",
  },
  {
    name: "Practice Tests",
    icon: require("../../../../assets/appIcons/choose.png"),
    link: "student/(screens)/Exams/practiceTests",
  },
  {
    name: "Ask Doubt",
    icon: require("../../../../assets/appIcons/question.png"),
    link: "student/(screens)/doubt/doubt",
  },
];

const home = () => {
  const navigation = useNavigation();

  const insets = useSafeAreaInsets();

  const [subjectData, setSubjectData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(AsyncStorage.getItem("userData"));
  const getUser = async () => {
    try {
      const value = await AsyncStorage.getItem("userData");
      if (value !== null) {
        setUser(JSON.parse(value));
      }
    } catch (e) {
      console.error("Error reading value:", e);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  // const [data, setData] = useState(dataSubjects);

  const DrawerToggle = () => {
    navigation.openDrawer();
  };

  const [liveClassesData, setLiveClassesData] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/admin/getSubjects/${user?.classId._id}`
        );
        setSubjectData(res.data.subjects);
        setLoading(false);
      } catch (error) {
        console.log(error);
        alert("Error in fetching subjects");
      }
    };
    if (user?.classId) {
      fetchSubjects();
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.classId?._id) {
        try {
          const response = await axios.get(
            `${API_URL}/teacher/getLiveClassById/${user?.classId?._id}`
          );
          // Filter out upcoming and today's live classes
          const filteredData = response.data.data.filter((item) => {
            const classDate = new Date(item.dateAndTime);
            const currentDate = new Date();
            return classDate >= currentDate;
          });
          // Sort the filtered data by dateAndTime
          const sortedData = filteredData.sort((a, b) => {
            return new Date(a.dateAndTime) - new Date(b.dateAndTime);
          });
          setLiveClassesData(sortedData.slice(0, 2));
          console.log("Live Classes Data", sortedData);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchData();
  }, [user?.classId?._id]);

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
          // Find more Lottie files at https://lottiefiles.com/featured
          source={require("../../../../assets/animation/loading.json")}
        />
        <StatusBar style="dark" />
      </View>
    );

  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.white,
        flex: 1,
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + hp(12),
          paddingTop: hp(2),
        }}
      >
        {/* header  */}

        <HStack
          space="md"
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: wp(4.5),
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => DrawerToggle()}
            activeOpacity={0.8}
            style={{
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Text style={styles.hamMenuLine}></Text>
            <Text style={styles.hamMenuLine2}></Text>
            <Text style={styles.hamMenuLine}></Text>
          </TouchableOpacity>
          <Box
            style={{
              flexDirection: "row",
              gap: wp(4),
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("student/(screens)/notifications")}
            >
              <Box
                style={{
                  width: wp(10),
                  height: wp(10),
                }}
              >
                <Image
                  source={require("../../../../assets/appIcons/notification-bell.svg")}
                  className="w-full h-full object-contain"
                />
              </Box>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("student/(screens)/messages")}
            >
              <Box
                style={{
                  width: wp(10),
                  height: wp(10),
                }}
              >
                <Image
                  source={require("../../../../assets/appIcons/message.png")}
                  className="w-full h-full object-contain"
                />
              </Box>
              <View className="absolute bg-red-500 -top-1 border-2 border-white -right-1 w-[22px] h-[22px] rounded-full text-white text-xs flex items-center justify-center">
                <Text className="text-[8px] text-white">05</Text>
              </View>
            </TouchableOpacity>
          </Box>
        </HStack>

        {/* <View style={styles.header}>
          <View>
            <Pressable
              className="flex flex-col gap-1"
              onPress={() => DrawerToggle()}
            >
              <Text style={styles.hamMenuLine}></Text>
              <Text style={styles.hamMenuLine2}></Text>
              <Text style={styles.hamMenuLine}></Text>
            </Pressable>
          </View>
          <View className="flex flex-row items-center gap-4">
            <View>
              <Pressable
                className="bg-bgColor w-[48px] h-[48px] flex items-center justify-center rounded-md relative"
                onPress={() => router.push("student/(screens)/notifications")}
              >
                <View className="absolute bg-red-500 -top-2 -right-2 w-[22px] h-[22px] rounded-full text-white text-xs flex items-center justify-center">
                  <Text className="text-xs text-white">05</Text>
                </View>
                <View className="relative">
                  <Ionicons
                    name="notifications"
                    size={24}
                    color={colors.black}
                  />
                </View>
              </Pressable>
            </View>
            <View>
              <Pressable
                className="bg-bgColor w-[48px] h-[48px] flex items-center justify-center rounded-md relative"
                onPress={() => router.push("student/(screens)/messages")}
              >
                <View className="absolute bg-red-500 -top-2 -right-2 w-[22px] h-[22px] rounded-full text-white text-xs flex items-center justify-center">
                  <Text className="text-xs text-white">05</Text>
                </View>
                <View className="relative">
                  <AntDesign name="message1" size={20} color={colors.black} />
                </View>
              </Pressable>
            </View>
          </View>
        </View> */}
        <HomeStudentCard
          name={user.name}
          classNumber={user?.classId?.name}
          rollNumber={user.rollNo}
          image={user.profilePic}
        />

        {/* section 1 */}

        <TextHeadingSection
          sectionName="Subjects"
          link={"student/(drawer)/(tabs)/subjects"}
        >
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <HStack
              space="md"
              style={{
                paddingRight: wp(4.5),
              }}
            >
              {subjectData.map((item, index) => (
                <SubjectPercentageCard
                  subjectName={item.name}
                  percentageComplete={""}
                  chaptersNumber={item.chapterCount}
                  subjectId={item._id}
                  key={index}
                />
              ))}
            </HStack>
          </ScrollView>
        </TextHeadingSection>

        {/* section banner  */}

        <TextHeadingSection sectionName="Explore Services">
          <VStack
            space="md"
            style={{
              paddingRight: wp(4.5),
            }}
          >
            <HStack
              space="md"
              style={{
                flexDirection: "row",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {ExploreServiceList.slice(0, 3).map((item, index) => (
                <ServiceCard
                  serviceName={item.name}
                  icon={item.icon}
                  link={item.link}
                  key={index}
                />
              ))}
            </HStack>
            <HStack
              space="md"
              style={{
                flexDirection: "row",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {ExploreServiceList.slice(3, 6).map((item, index) => (
                <ServiceCard
                  serviceName={item.name}
                  icon={item.icon}
                  link={item.link}
                  key={index}
                />
              ))}
            </HStack>
            {/* <HStack
              space="md"
              style={{
                paddingRight: wp(4.5),
              }}
            >
              {servicesList.list1.map((item, index) => (
                <ServiceCard
                  serviceName={item.name}
                  icon={() => item.icon()}
                  link={item.link}
                  key={index}
                />
              ))}
            </HStack>
            <HStack
              space="md"
              style={{
                paddingRight: wp(4),
              }}
            >
              {servicesList.list2.map((item, index) => (
                <ServiceCard
                  serviceName={item.name}
                  icon={() => item.icon()}
                  link={item.link}
                  key={index}
                />
              ))}
            </HStack> */}
          </VStack>
        </TextHeadingSection>

        {/* section 3  */}

        <HomeCarsoul />
        {liveClassesData && liveClassesData.length !== 0 && (
          <TextHeadingSection
            sectionName={"Live Classes"}
            link={"student/(screens)/liveClasses"}
          >
            <VStack
              space="lg"
              style={{
                paddingRight: wp(4.5),
              }}
            >
              {liveClassesData.map((item, index) => (
                <LiveClassesFullImageCard data={item} key={index} />
              ))}
            </VStack>
          </TextHeadingSection>
        )}

        {/* ----- */}
        {/* <View>
        <Text>home</Text>
      </View> */}
      </ScrollView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default home;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: wp(4),
    alignItems: "center",
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(1),
    marginTop: hp(2),
  },
  hamMenuLine: {
    height: 3,
    width: 30,
    margin: 3,
    borderRadius: 2,
    backgroundColor: colors.Primary04,
  },
  hamMenuLine2: {
    height: 3,
    width: 15,
    margin: 3,
    borderRadius: 2,
    backgroundColor: colors.Primary06,
  },
});
