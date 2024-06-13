import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  VStack,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalBody,
  HStack,
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
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Button,
  ButtonText,
} from "@gluestack-ui/themed";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { API_URL, colors } from "../../../utils/constant";
import Icon from "react-native-remix-icon";
import axios from "axios";
import SearchLabelFilter from "../../../components/SearchLabelFilter";
import { Image } from "expo-image";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import { Fab } from "@gluestack-ui/themed";
import { FabIcon } from "@gluestack-ui/themed";
import { FabLabel } from "@gluestack-ui/themed";

const studentManagement = () => {
  const [search, setSearch] = useState("");
  const [filterSearch, setFilterSearch] = useState("66473ab6471b77bce9d925be");
  const [filterData, setFilterData] = useState([]);
  const [filterDataLoading, setFilterDataLoading] = useState(false);

  const [classData, setClassData] = useState([]);
  const [classDataLoading, setClassDataLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [data, setData] = useState({ classId: "" });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);
  const [bulkBlockLoading, setBulkBlockLoading] = useState(false);

  useEffect(() => {
    console.log(filterSearch);
  }, [filterSearch]);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/getClasses`);
        setClassData(res.data.classes);
      } catch (error) {
        console.log(error);
        alert("Error fetching class data.");
      } finally {
        setClassDataLoading(false);
      }
    };
    fetchClassData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setFilterDataLoading(true); // Show loading indicator
      try {
        const res = await axios.get(
          `${API_URL}/admin/getStudents/${filterSearch}`
        );
        setFilterData(res.data.students);
      } catch (error) {
        console.log(error);
        alert("Error fetching student data.");
      } finally {
        setFilterDataLoading(false); // Hide loading indicator when done
      }
    };
    fetchData();
  }, [filterSearch]);

  const bulkDelete = async () => {
    setBulkDeleteLoading(true);
    // todo : bulk delete
  };

  const bulkBlock = async () => {
    setBulkBlockLoading(true);
    // todo : bulk delete
    try {
      console.log(data.classId);
      const res = await axios.get(`${API_URL}/admin/bulkDeactivateStudent/${data.classId}`);
      setSuccess(res.data.message);
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    } finally {
      setBulkBlockLoading(false);
    }
  };

  if (classDataLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.Primary03} />
      </View>
    );
  }

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: heightPercentageToDP(2),
        }}
      >
        <View
          style={{
            marginHorizontal: widthPercentageToDP(4),
            marginTop: heightPercentageToDP(1),
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
            {classData.map((item, index) => (
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
        <VStack
          space="md"
          style={{
            marginHorizontal: widthPercentageToDP(4),
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
              <ActivityIndicator size="large" color={colors.Primary03} />
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
              <LottieView
                autoPlay
                loop
                style={{
                  width: 300,
                  height: 300,
                }}
                // Find more Lottie files at https://lottiefiles.com/featured
                source={require("../../../assets/animation/search2.json")}
              />
              <Text className="text-sm text-text font-bold text-center w-[250px] mx-auto">
                No Student found. Please Upload Student Data.
              </Text>
            </View>
          ) : (
            filterData.map((item, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                style={{
                  backgroundColor: colors.bgColor + "40",
                  padding: 16,
                  borderRadius: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: colors.black + "15",
                }}
                onPress={() => {
                  router.push(`admin/(screens)/student/${item._id}`);
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
                    }}
                  >
                    {item.profilePic ? (
                      <Image
                        source={item.profilePic}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image
                        source={require("../../../assets/appIcons/graduating-student.png")}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </View>
                  <View className="ml-4 flex-1">
                    <Text className="text-base text-mainBlack/80 font-bold font-primary">
                      {item.name}
                    </Text>
                    <Text className="text-xs text-text mt-[0.5rem] font-primary uppercase">
                      {item.rollNo} - {item.gender}
                    </Text>
                    <Text className="text-sm text-text mt-4 font-primary">
                      +91 {item.registeredMobileNo}
                    </Text>
                  </View>
                </HStack>
              </TouchableOpacity>
            ))
          )}
        </VStack>
        <StatusBar style="dark" />
      </ScrollView>
      <Fab
        size="lg"
        placement="bottom right"
        isHovered={false}
        isDisabled={false}
        isPressed={false}
        bg={colors.red}
        shadowColor="#fff"
        style={{
          marginBottom: heightPercentageToDP(1),
        }}
        onPress={() => setShowModal(true)}
      >
        <FabLabel
          style={{
            marginLeft: 8,
            fontFamily: "Urbanist",
          }}
        >
          Actions
        </FabLabel>
      </Fab>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        size="lg"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalBody
            style={{
              padding: 16,
              backgroundColor: "#fff",
            }}
          >
            <VStack
              space="xs"
              mb="$4"
              style={{
                marginTop: 16,
              }}
            >
              <Text className="text-xl font-bold text-bold text-mainBlack/80">
                Bulk Students Management
              </Text>
              {/* <Text className="font-primary text-sm mt-[0.5rem] text-text">
              S
              </Text> */}
            </VStack>
            {error && (
              <View className="bg-red-50 flex-1 p-2 rounded-[4px] mb-4">
                <Text className="text-sm text-red-500 text-center px-4">
                  Error : {error}
                </Text>
              </View>
            )}
            {success && (
              <View className="bg-green-50 flex-1 p-2 rounded-[4px] mb-4">
                <Text className="text-sm text-green-500 text-center px-4">
                  Success : {success}
                </Text>
              </View>
            )}
            <VStack py="$1" space="lg">
              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText
                    style={{
                      fontFamily: "Urbanist",
                      color: colors.text,
                      fontSize: 15,
                      marginBottom: 4,
                    }}
                  >
                    Class
                  </FormControlLabelText>
                </FormControlLabel>
                <Select
                  defaultValue={data.classId}
                  onValueChange={(val) => {
                    setData({
                      ...data,
                      classId: val,
                    });
                    setError(null);
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
            </VStack>
            <HStack space="md">
              <Button
                mt="$4"
                onPress={() => {
                  setShowModal(false);
                }}
                style={{
                  backgroundColor: colors.red + "20",
                  flex: 1,
                }}
              >
                <ButtonText
                  style={{
                    fontFamily: "Urbanist",
                    color: colors.red,
                  }}
                >
                 Cancel
                </ButtonText>
              </Button>
              <Button
                mt="$4"
                onPress={() => {
                  bulkBlock();
                }}
                style={{
                  backgroundColor: colors.red,
                  flex: 1,
                }}
                disabled={bulkBlockLoading}
              >
                <ButtonText
                  style={{
                    fontFamily: "Urbanist",
                  }}
                >
                  {bulkBlockLoading ? "Blocking..." : "Block"}
                </ButtonText>
              </Button>
            </HStack>
            {/* <Button
              style={{
                backgroundColor: "transparent",
                marginBottom: 8,
                marginTop: 8,
              }}
              onPress={() => {
                setShowModal(false);
              }}
            >
              <ButtonText
                style={{
                  color: colors.red,
                  fontFamily: "Urbanist",
                }}
              >
                Cancel
              </ButtonText>
            </Button> */}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default studentManagement;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
