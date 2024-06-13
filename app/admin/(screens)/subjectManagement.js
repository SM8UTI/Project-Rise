import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";

import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import {
  VStack,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  Heading,
  Button,
  ButtonText,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalBody,
  HStack,
  Textarea,
  TextareaInput,
  ButtonIcon,
  Box,
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
} from "@gluestack-ui/themed";
import Icon from "react-native-remix-icon";
import { API_URL, colors } from "../../../utils/constant";
import axios from "axios";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import AdminSubjectCard from "../../../components/AdminSubjectCard";

const subjectManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [classLoading, setClassLoading] = useState(true);
  const [data, setData] = useState({
    name: "",
    description: "",
    classId: "",
  });

  const [filterData, setFilterData] = useState([]);
  const [filterClass, setFilterClass] = useState("");
  const [classData, setClassData] = useState([]);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        setClassLoading(true);
        const res = await axios.get(`${API_URL}/admin/getClasses`);
        setClassData(res.data.classes);
        // setFilterClass(res.data.classes[0]._id);
      } catch (error) {
        console.log(error);
        alert("Error fetching class data.");
      } finally {
        setClassLoading(false);
      }
    };
    fetchClassData();
    fetchClassData();
  }, []);

  const fetchSubjecstData = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/admin/getSubjects/${filterClass}`
      );
      console.log(res.data.subjects);
      setFilterData(res.data.subjects);
    } catch (error) {
      alert("Error fetching subjects data.");
      console.log(error);
    }
  };

  useEffect(() => {
    if (filterClass !== "") {
      fetchSubjecstData();
    }
  }, [filterClass]);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  const handleCreateClass = async () => {
    setLoading(true);
    if (!data.name || !data.classId) {
      setError("Please fill all fields.");
      return;
    }
    try {
      await axios.post(`${API_URL}/admin/addSubject`, data).then(() => {
        setSuccess("Subject created successfully.");
      });
      setData({
        name: "",
        description: "",
        classId: "",
      });

      setLoading(false);
      setTimeout(() => {
        setShowModal(false);
      }, 2000);
    } catch (error) {
      setLoading(false);
      setError("Error creating subject.");
      console.log(error);
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: heightPercentageToDP(2),
      }}
    >
      <VStack
        style={{
          backgroundColor: "#fff",
          marginHorizontal: widthPercentageToDP(4.5),
          flex: 1,
          borderRadius: 8,
        }}
      >
        <Button
          bg={colors.Primary03}
          style={{
            borderRadius: 4,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            setShowModal(true);
            console.log("Create Subject");
            setSuccess("");
            setError("");
          }}
        >
          <ButtonIcon>
            <Icon name="add-line" size={24} color="#fff" />
          </ButtonIcon>
          <ButtonText
            style={{
              fontFamily: "Urbanist",
              marginLeft: 8,
            }}
          >
            Create Subject
          </ButtonText>
        </Button>
      </VStack>
      <VStack
        style={{
          marginHorizontal: widthPercentageToDP(4.5),
          marginTop: 16,
        }}
        space="lg"
      >
        <Text className="text-base text-mainBlack/80 font-bold">
          Subjects Lists
        </Text>
        <HStack
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          space="4xl"
        >
          <Text className="text-sm text-text">Filter :</Text>
          <Select
            defaultValue={filterClass}
            onValueChange={(val) => {
              setFilterClass(val);
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
                defaultValue={filterClass}
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
                  <SelectItem key={index} label={item.name} value={item._id} />
                ))}
              </SelectContent>
            </SelectPortal>
          </Select>
        </HStack>
        {classLoading ? (
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
        ) : (
          <VStack space="md">
            {filterData.length === 0 && (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 500,
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
                <Text className="text-xl text-text  font-primary">
                  {filterClass === "" && "Select a class to view subjects"}
                  {filterClass && "No Subjects found"}
                </Text>
              </View>
            )}
            {filterData.map((item, index) => (
              <AdminSubjectCard
                key={index}
                subjectName={item.name}
                description={item.description}
                createdAt={item.createdAt}
              />
            ))}
            {/* <Box
                key={index}
                bg="#fff"
                style={{
                  padding: 16,
                  borderRadius: 8,
                }}
              >
                <VStack space="md">
                  <HStack
                    space="sm"
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Box
                      style={{
                        width: 30,
                        height: 30,
                        backgroundColor: colors.Primary02,
                        borderRadius: 4,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Icon name="book-2-line" size={16} color={colors.white} />
                    </Box>
                    <Text className="text-mainBlack/80 text-base">
                      {item.name}
                    </Text>
                  </HStack>
                  <View>
                    <Text className="text-xs text-text">Description</Text>
                    <Text className="mt-1 text-sm text-text">
                      {item.description}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-xs text-text/80 ml-auto">
                      {formatDate(item.createdAt)}
                    </Text>
                  </View>
                </VStack>
              </Box> */}
          </VStack>
        )}
      </VStack>
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
                Create a Subject
              </Text>
              <Text className="font-primary text-sm mt-[0.5rem] text-text">
                Subject for a class can be created here.
              </Text>
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
                    Subject Name
                  </FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    style={{
                      fontFamily: "Urbanist",
                    }}
                    value={data.name}
                    onChangeText={(value) => {
                      setError("");
                      setData({
                        ...data,
                        name: value,
                      });
                    }}
                  />
                </Input>
              </FormControl>
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
                    Description
                  </FormControlLabelText>
                </FormControlLabel>
                <Textarea>
                  <TextareaInput
                    style={{
                      fontFamily: "Urbanist",
                    }}
                    value={data.description}
                    onChangeText={(value) => {
                      setData({
                        ...data,
                        description: value,
                      });
                    }}
                  />
                </Textarea>
              </FormControl>
            </VStack>
            <Button
              mt="$4"
              onPress={() => {
                handleCreateClass();
              }}
              style={{
                backgroundColor: colors.Primary03,
              }}
              disabled={loading}
            >
              <ButtonText
                style={{
                  fontFamily: "Urbanist",
                }}
              >
                {loading ? "Loading..." : "Create Subject"}
              </ButtonText>
            </Button>
            <Button
              style={{
                backgroundColor: "transparent",
                marginBottom: 8,
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
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
      <StatusBar style="dark" />
    </ScrollView>
  );
};

export default subjectManagement;

const styles = StyleSheet.create({});
