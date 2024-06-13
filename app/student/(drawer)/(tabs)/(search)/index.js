import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-remix-icon";
import { API_URL, colors } from "../../../../../utils/constant";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import SearchLabelFilter from "../../../../../components/SearchLabelFilter";
import { HStack } from "@gluestack-ui/themed";

import Video from "../../../(screens)/Search/Video";
import Note from "../../../(screens)/Search/Note";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";

const search = () => {
  const [search, setSearch] = useState("");
  const [filterSearch, setFilterSearch] = useState("");
  const [filteredData, setFilteredData] = useState({
    notes: [],
    videos: [],
  });

  const [selectedTab, setSelectedTab] = useState("note");

  const [user, setUser] = useState(AsyncStorage.getItem("userData"));
  const [subjectData, setSubjectData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/admin/getSubjects/${user?.classId._id}`
        );
        console.log(JSON.stringify(res.data.subjects, null, 2));
        setSubjectData(res.data.subjects);
        setFilterSearch(res.data.subjects[0]._id);
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
      try {
        const res = await axios.get(
          `${API_URL}/students/getContent/${user?.classId._id}/${filterSearch}`
        );
        // console.log(JSON.stringify(res.data, null, 2));
        const notes = res.data.content.filter((item) => item.isPdf);
        const youtubeVideos = res.data.content.filter((item) => item.isYoutube);

        if (selectedTab === "note") {
          console.log("Notes ", notes);
          setFilteredData((prevData) => ({
            ...prevData,
            notes: notes,
          }));
        } else {
          setFilteredData((prevData) => ({
            ...prevData,
            videos: youtubeVideos,
          }));
        }
      } catch (error) {
        console.log(error);
        alert("Error in fetching data");
      }
    };
    if (filterSearch && user) {
      fetchData();
    }
  }, [filterSearch, user, selectedTab]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
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
          source={require("../../../../../assets/animation/loading.json")}
        />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        // flex: 1,
        backgroundColor: colors.white,
      }}
    >
      {/* input form  */}
      <View
        style={{
          marginHorizontal: widthPercentageToDP(4.5),
          marginTop: heightPercentageToDP(2),
          backgroundColor: colors.bgColor,
          borderRadius: 8,
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          paddingHorizontal: 8,
          paddingVertical: 4,
        }}
      >
        <Icon name="search-2-line" size={20} color={colors.Primary04} />
        <TextInput
          placeholder="Search..."
          value={search}
          onChangeText={(value) => {
            setSearch(value);
          }}
          style={{
            flex: 1,
            fontSize: 16,
            color: colors.black,
            padding: 8,
            fontFamily: "Urbanist",
          }}
        />
      </View>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{
          marginTop: heightPercentageToDP(2),
        }}
      >
        <HStack
          space="md"
          style={{
            paddingHorizontal: widthPercentageToDP(4),
          }}
        >
          {subjectData.map((item, index) => (
            <SearchLabelFilter
              name={item.name}
              value={item._id}
              filterSearch={filterSearch}
              setFilterSearch={setFilterSearch}
              key={index}
            />
          ))}
        </HStack>
      </ScrollView>
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
              selectedTab === "note" ? colors.Primary04 : colors.text + "20",
            borderBottomWidth: selectedTab === "note" ? 3 : 1,
            paddingVertical: 16,
          }}
          onPress={() => setSelectedTab("note")}
        >
          <Text
            style={{
              fontSize: 16,
              color: selectedTab === "note" ? colors.Primary04 : colors.text,
              fontFamily: "Urbanist",
              marginTop: heightPercentageToDP(2),
              marginLeft: widthPercentageToDP(4),
              textAlign: "center",
              fontWeight: selectedTab === "note" ? "bold" : "normal",
            }}
          >
            Notes
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
              selectedTab === "video" ? colors.Primary04 : colors.text + "20",
            borderBottomWidth: selectedTab === "video" ? 3 : 1,
            paddingVertical: 16,
          }}
          onPress={() => setSelectedTab("video")}
        >
          <Text
            style={{
              fontSize: 16,
              color: selectedTab === "video" ? colors.Primary04 : colors.text,
              fontFamily: "Urbanist",
              marginTop: heightPercentageToDP(2),
              marginLeft: widthPercentageToDP(4),
              textAlign: "center",
              fontWeight: selectedTab === "video" ? "bold" : "normal",
            }}
          >
            Videos
          </Text>
        </TouchableOpacity>
      </HStack>
      <ScrollView
        horizontal={false}
        showsVerticalScrollIndicator={false}
        style={{
          marginHorizontal: widthPercentageToDP(4.5),
          paddingTop: heightPercentageToDP(2),
          height: heightPercentageToDP(68),
        }}
      >
        {selectedTab === "note" ? (
          <Note data={filteredData.notes} />
        ) : (
          <Video data={filteredData.videos} />
        )}
      </ScrollView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default search;

const styles = StyleSheet.create({});
