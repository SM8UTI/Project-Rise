import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { API_URL, colors } from "../../../utils/constant";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Icon from "react-native-remix-icon";
import {
  HStack,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
  Box,
  VStack,
  Button,
  ButtonIcon,
} from "@gluestack-ui/themed";
import axios from "axios";
import { Image } from "expo-image";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

const teacherManagement = () => {
  const [filterSearch, setFilterSearch] = useState({
    classId: "",
    subjectId: "",
  });

  const [filterData, setFilterData] = useState([]);
  const [filterDataLoading, setFilterDataLoading] = useState(false);
  const [filterToggle, setFilterToggle] = useState(false);

  const [search, setSearch] = useState("");

  const [classData, setClassData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/getClasses`);
        setClassData(res.data.classes);
        setLoading(false);
      } catch (error) {
        console.log(error);
        alert("Error fetching class data.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!filterSearch.classId) return;
    const fetchSubjectData = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/admin/getSubjects/${filterSearch.classId}`
        );
        setSubjectData(res.data.subjects);
      } catch (error) {
        console.log(error);
        alert("Error fetching subject data.");
      }
    };
    fetchSubjectData();
  }, [filterSearch.classId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/getTeachers`);
        setFilterData(res.data.teachers);
      } catch (error) {
        console.log(error);
        alert("Error fetching student data.");
      }
    };

    fetchData();
  }, [filterSearch.classId, filterSearch.subjectId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.Primary04} />
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: heightPercentageToDP(2),
      }}
    >
      <HStack
        style={{
          marginHorizontal: widthPercentageToDP(4.5),
          marginTop: heightPercentageToDP(1),
        }}
        space="md"
      >
        <View
          style={{
            backgroundColor: colors.bgColor,
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            paddingHorizontal: 8,
            paddingVertical: 3.8,
            flex: 1,
          }}
        >
          <Icon name="search-2-line" size={20} color={colors.Primary04} />
          <TextInput
            placeholder="Search Name"
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
        <Button
          bgColor={filterToggle ? colors.Primary04 : colors.bgColor}
          onPress={() => setFilterToggle(!filterToggle)}
          style={{
            borderRadius: 8,
          }}
          size="xl"
        >
          <ButtonIcon>
            <Icon
              name="equalizer-line"
              size={24}
              color={filterToggle ? colors.white : colors.text}
            />
          </ButtonIcon>
        </Button>
      </HStack>
      {filterToggle && (
        <HStack
          space="md"
          style={{
            marginHorizontal: widthPercentageToDP(4.5),
            padding: 8,
            backgroundColor: colors.bgColor + "10",
            borderRadius: 8,
            marginTop: heightPercentageToDP(1),
          }}
        >
          <Box
            style={{
              flex: 1,
            }}
          >
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText
                  style={{
                    fontFamily: "Urbanist",
                    fontSize: 14,
                    color: colors.text,
                    marginBottom: 4,
                  }}
                >
                  Class
                </FormControlLabelText>
              </FormControlLabel>
              <Select
                defaultValue={filterSearch.classId}
                onValueChange={(val) => {
                  setFilterSearch({ ...filterSearch, classId: val });
                }}
                bg={colors.white}
                style={{
                  flex: 1,
                  fontFamily: "Urbanist",
                }}
              >
                <SelectTrigger
                  variant="outline"
                  size="lg"
                  style={{
                    flex: 1,
                  }}
                >
                  <SelectInput
                    placeholder="Select Class"
                    style={{
                      flex: 1,
                      textTransform: "capitalize",
                      fontFamily: "Urbanist",
                    }}
                  />
                  <SelectIcon mr="$3">
                    <Icon
                      name="arrow-drop-down-line"
                      size="24"
                      color={colors.text}
                    />
                  </SelectIcon>
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {classData.map((item, index) => (
                      <SelectItem
                        key={index}
                        label={item.name}
                        value={item._id}
                      />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
            </FormControl>
          </Box>
          {filterSearch.classId && (
            <Box
              style={{
                flex: 1,
              }}
            >
              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText
                    style={{
                      fontFamily: "Urbanist",
                      fontSize: 14,
                      color: colors.text,
                      marginBottom: 4,
                    }}
                  >
                    Subject
                  </FormControlLabelText>
                </FormControlLabel>
                <Select
                  defaultValue={filterSearch.subjectId}
                  onValueChange={(val) => {
                    setFilterSearch({ ...filterSearch, subjectId: val });
                  }}
                  bg={colors.white}
                  style={{
                    flex: 1,
                    fontFamily: "Urbanist",
                  }}
                >
                  <SelectTrigger
                    variant="outline"
                    size="lg"
                    style={{
                      flex: 1,
                    }}
                  >
                    <SelectInput
                      placeholder="Select Class"
                      style={{
                        flex: 1,
                        textTransform: "capitalize",
                        fontFamily: "Urbanist",
                      }}
                    />
                    <SelectIcon mr="$3">
                      <Icon
                        name="arrow-drop-down-line"
                        size="24"
                        color={colors.text}
                      />
                    </SelectIcon>
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      {subjectData.map((item, index) => (
                        <SelectItem
                          key={index}
                          label={item.name}
                          value={item._id}
                        />
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </FormControl>
            </Box>
          )}
        </HStack>
      )}
      <VStack
        space="md"
        style={{
          marginHorizontal: widthPercentageToDP(4.5),
          marginTop: heightPercentageToDP(2),
        }}
      >
        {filterDataLoading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              height: heightPercentageToDP(50),
            }}
          >
            <ActivityIndicator size="large" color={colors.Primary04} />
          </View>
        ) : filterData.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              height: heightPercentageToDP(50),
            }}
          >
            <Text className="text-sm text-text font-bold text-center">
              No data found.
            </Text>
          </View>
        ) : (
          filterData.map((item, index) => (
            <TouchableOpacity
              activeOpacity={0.8}
              key={index}
              style={{
                backgroundColor: "#fff",
                padding: 16,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                borderColor: colors.black + "15",
                borderWidth: 1,
              }}
              onPress={() => {
                // router.push(`admin/(screens)/[teacherid]`, {
                //   teacherid: item._id,
                // });
                router.push(`admin/(screens)/${item._id}`);
              }}
            >
              <HStack
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 4,
                    overflow: "hidden",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.profilePic ? (
                    <Image
                      source={item.profilePic}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      source={require("../../../assets/appIcons/teacher.png")}
                      className="w-[60px] h-[60px] object-contain"
                    />
                  )}
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-base text-mainBlack/80 font-bold font-primary">
                    {item.name}
                  </Text>
                  <Text className="text-xs text-text mt-[0.5rem] font-primary capitalize">
                    {item.gender}
                  </Text>
                  <Text className="text-sm text-text mt-4 font-primary">
                    +91 {item.phoneNumber}
                  </Text>
                </View>
              </HStack>
            </TouchableOpacity>
          ))
        )}
      </VStack>
      <StatusBar style="dark" />
    </ScrollView>
  );
};

export default teacherManagement;

const styles = StyleSheet.create({});
