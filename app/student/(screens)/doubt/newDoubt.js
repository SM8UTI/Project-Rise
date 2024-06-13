import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  VStack,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  HStack,
  Button,
  ButtonText,
} from "@gluestack-ui/themed";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { API_URL, colors } from "../../../../utils/constant";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
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
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Textarea } from "@gluestack-ui/themed";
import { TextareaInput } from "@gluestack-ui/themed";

const newDoubt = () => {
  const [data, setData] = useState({
    teacher: "",
    student: "",
    supportType: "teacher",
    doubtType: "academic",
    description: "",
    assignedTo: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [filterData, setFilterData] = useState([]);

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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/admin/getTeachers`);
        // Filter out teachers based on isAdmin property
        const filteredTeachers = response.data.teachers.filter(
          (teacher) => teacher.isAdmin === (data.supportType === "admin")
        );
        setFilterData(filteredTeachers);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [data.supportType]);

  const handleInputChange = (key, value) => {
    setData({ ...data, [key]: value });
  };

  const [doubtLoading, setDoubtLoading] = useState(false);

  const handleSubmit = async () => {
    setDoubtLoading(true);
    if (
      !data.supportType ||
      !data.doubtType ||
      !data.assignedTo ||
      !data.description
    ) {
      setError("All fields are required");
      setDoubtLoading(false);
      return;
    }

    try {
      await axios.post(`${API_URL}/students/addDoubt`, {
        supportType: data.supportType,
        doubtType: data.doubtType,
        description: data.description,
        assignedTo: data.assignedTo,
        student: user._id,
      });
      setSuccess("Doubt raised successfully");
      setData({
        teacher: "",
        student: "",
        supportType: "teacher",
        doubtType: "academic",
        description: "",
        assignedTo: "",
      });
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
      setDoubtLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.Primary02} />
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: heightPercentageToDP(2),
        height: "100%",
      }}
    >
      <VStack
        space="md"
        style={{
          backgroundColor: "#fff",
          marginHorizontal: widthPercentageToDP(4.5),
          borderRadius: 8,
          marginTop: heightPercentageToDP(1),
        }}
      >
        <VStack
          space="md"
          style={{
            paddingHorizontal: widthPercentageToDP(1),
          }}
        >
          <FormControl size="md" isRequired={true}>
            <FormControlLabel mb="$1">
              <FormControlLabelText
                style={{
                  fontSize: 14,
                  color: colors.text,
                  fontFamily: "Urbanist",
                  marginBottom: 4,
                }}
              >
                Select Support Type
              </FormControlLabelText>
            </FormControlLabel>

            <Select
              defaultValue={data.supportType}
              onValueChange={(val) => {
                setData({ ...data, supportType: val });
                setError(null);
              }}
            >
              <SelectTrigger>
                <SelectInput
                  placeholder="Select"
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
                  <SelectItem label={"Teacher"} value={"teacher"} />
                  <SelectItem label={"Admin"} value={"admin"} />
                </SelectContent>
              </SelectPortal>
            </Select>
          </FormControl>
          <FormControl size="md" isRequired={true}>
            <FormControlLabel mb="$1">
              <FormControlLabelText
                style={{
                  fontSize: 14,
                  color: colors.text,
                  fontFamily: "Urbanist",
                  marginBottom: 4,
                }}
              >
                Select Doubt Type
              </FormControlLabelText>
            </FormControlLabel>

            <Select
              defaultValue={data.doubtType}
              onValueChange={(val) => {
                setData({ ...data, doubtType: val });
                setError(null);
              }}
            >
              <SelectTrigger>
                <SelectInput
                  placeholder="Select"
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
                  <SelectItem label={"Academic"} value={"academic"} />
                  <SelectItem label={"Technical"} value={"technical"} />
                </SelectContent>
              </SelectPortal>
            </Select>
          </FormControl>
          <FormControl size="md" isRequired={true}>
            <FormControlLabel mb="$1">
              <FormControlLabelText
                style={{
                  fontSize: 14,
                  color: colors.text,
                  fontFamily: "Urbanist",
                  marginBottom: 4,
                }}
              >
                Select Assign
              </FormControlLabelText>
            </FormControlLabel>

            <Select
              defaultValue={data.assignedTo}
              onValueChange={(val) => {
                setData({ ...data, assignedTo: val });
                setError(null);
              }}
            >
              <SelectTrigger>
                <SelectInput
                  placeholder="Select"
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
                  {filterData.map((item, index) => (
                    <SelectItem
                      label={item.name}
                      value={item._id}
                      key={index}
                    />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
          </FormControl>
          <FormControl size="md" isRequired={true}>
            <FormControlLabel mb="$1">
              <FormControlLabelText
                style={{
                  fontSize: 14,
                  color: colors.text,
                  fontFamily: "Urbanist",
                  marginBottom: 4,
                }}
              >
                Description
              </FormControlLabelText>
            </FormControlLabel>
            <Textarea size="lg">
              <TextareaInput
                defaultValue={data.description}
                style={{
                  fontFamily: "Urbanist",
                }}
                onChangeText={(text) => {
                  handleInputChange("description", text);
                }}
              />
            </Textarea>
          </FormControl>
        </VStack>
        <Button
          bg={colors.Primary02}
          size="lg"
          onPress={handleSubmit}
          style={{
            marginTop: heightPercentageToDP(2),
          }}
          disabled={doubtLoading}
        >
          <ButtonText
            style={{
              fontFamily: "Urbanist",
              fontSize: 16,
              textTransform: "uppercase",
            }}
          >
            {doubtLoading ? "Creating..." : "Ask Doubt"}
          </ButtonText>
        </Button>
      </VStack>
      <Modal
        isOpen={error || success}
        onClose={() => {
          setError(null);
          setSuccess(null);
        }}
        size="md"
      >
        <ModalBackdrop />

        <ModalContent>
          <ModalCloseButton
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              padding: 16,
            }}
          >
            <Icon name="close-line" size={32} color={colors.red} />
          </ModalCloseButton>
          <VStack
            space="md"
            style={{
              padding: 16,
              marginVertical: heightPercentageToDP(10),
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {success && (
              <LottieView
                autoPlay
                loop
                style={{
                  width: 200,
                  height: 200,
                }}
                source={require("../../../../assets/animation/success3.json")}
              />
            )}
            {error && (
              <LottieView
                autoPlay
                loop
                style={{
                  width: 200,
                  height: 200,
                }}
                source={require("../../../../assets/animation/error2.json")}
              />
            )}
            <Text
              style={{
                fontFamily: "Urbanist",
                fontSize: 18,
                color: colors.text,
                textAlign: "center",
              }}
            >
              {error || success}
            </Text>
          </VStack>
        </ModalContent>
      </Modal>
    </ScrollView>
  );
};

export default newDoubt;

const styles = StyleSheet.create({});
