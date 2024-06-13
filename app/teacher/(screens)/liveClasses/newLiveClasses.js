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

const NewLiveClasses = () => {
  const [data, setData] = useState({
    topic: "",
    dateAndTime: new Date(),
    meetingID: "",
    passcode: "",
    inviteLink: "",
    startDate: new Date(),
    startTime: new Date(),
    showStartDatePicker: false,
    showStartTimePicker: false,
    subjectId: "",
  });
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(false);
  const [subjectLoading, setSubjectLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInputChange = (key, value) => {
    setData({ ...data, [key]: value });
  };

  function mergeDateTime(startDate, startTime) {
    // Extract date components from startDate
    const startDateOnly = new Date(startDate);
    const year = startDateOnly.getFullYear();
    const month = startDateOnly.getMonth() + 1;
    const day = startDateOnly.getDate();

    // Extract time components from startTime
    const startTimeOnly = new Date(startTime);
    const hours = startTimeOnly.getHours();
    const minutes = startTimeOnly.getMinutes();
    const seconds = startTimeOnly.getSeconds();

    // Construct a new Date object with combined date and time
    const mergedDateTime = new Date(
      year,
      month - 1,
      day,
      hours,
      minutes,
      seconds
    );

    return mergedDateTime;
  }

  const [subjectData, setSubjectData] = useState([]);
  const [classId, setClassId] = useState(null);
  const [teacherData, setTeacherData] = useState({});

  useEffect(() => {
    const getId = async () => {
      const id = await AsyncStorage.getItem("classId");
      setClassId(id);
      const value = await AsyncStorage.getItem("teacherData");
      if (value !== null) {
        setTeacherData(JSON.parse(value));
      }
    };
    getId();
  }, []);

  useEffect(() => {
    if (!classId) return;

    const fetchSubjectData = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/getSubjects/${classId}`);
        setSubjectData(res.data.subjects);
        // console.log(subjectData);
        setSubjectLoading(false);
      } catch (error) {
        console.log(error);
        alert("Error fetching subject data.");
        setSubjectLoading(false); // Ensure loading state is set to false in case of error
      }
    };
    fetchSubjectData();
  }, [classId]);

  const handleSubmit = async () => {
    console.log("Submitted data: ", data);
    setLoading(true);
    // Handle form submission logic here
    if (
      data.topic === "" ||
      data.meetingID === "" ||
      data.passcode === "" ||
      data.inviteLink === "" ||
      data.startDate === "" ||
      data.startTime === ""
    ) {
      setError("Please fill all the fields");
      setLoading(false);
      return;
    }

    // console.log({
    //   classId: classId,
    //   teacherId: teacherData._id,
    //   subjectId: data.subjectId,
    //   topic: data.topic,
    //   dateAndTime: mergeDateTime(data.startDate, data.startTime).toString(),
    //   meetingID: data.meetingID,
    //   passcode: data.passcode,
    //   inviteLink: data.inviteLink,
    // });

    try {
      const res = await axios.post(`${API_URL}/teacher/addLiveClass`, {
        classId: classId,
        teacherId: teacherData._id,
        subjectId: data.subjectId,
        topic: data.topic,
        dateAndTime: mergeDateTime(data.startDate, data.startTime).toString(),
        meetingID: data.meetingID,
        passcode: data.passcode,
        inviteLink: data.inviteLink,
      });
      console.log(res.data);
      setLoading(false);
      setSuccess("Live class created successfully.");
      setData({
        topic: "",
        dateAndTime: new Date(),
        meetingID: "",
        passcode: "",
        inviteLink: "",
        startDate: new Date(),
        startTime: new Date(),
        showStartDatePicker: false,
        showStartTimePicker: false,
        subjectId: "",
      });
    } catch (error) {
      console.log(error);
      setError("Error creating live class.");
      setLoading(false);
    }
  };

  const onStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || data.startDate;
    setData((prevState) => ({
      ...prevState,
      startDate: currentDate,
      showStartDatePicker: Platform.OS === "ios",
    }));
  };

  const onStartTimeChange = (event, selectedTime) => {
    const currentDate = data.startDate;
    const currentHours = selectedTime.getHours();
    const currentMinutes = selectedTime.getMinutes();
    const newDateWithTime = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      currentHours,
      currentMinutes
    );

    setData((prevState) => ({
      ...prevState,
      startTime: newDateWithTime,
      showStartTimePicker: Platform.OS === "ios",
    }));
  };

  if (subjectLoading) {
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
        paddingBottom: insets.bottom + heightPercentageToDP(2),
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
                Topic Name
              </FormControlLabelText>
            </FormControlLabel>
            <Input size="lg">
              <InputField
                type="text"
                defaultValue={data.topic}
                style={{
                  fontFamily: "Urbanist",
                }}
                onChangeText={(text) => {
                  handleInputChange("topic", text);
                }}
              />
            </Input>
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
                Date
              </FormControlLabelText>
            </FormControlLabel>
            <TouchableOpacity
              onPress={() => setData({ ...data, showStartDatePicker: true })}
            >
              <TextInput
                style={styles.input}
                placeholder="Select Start Date"
                value={
                  data.startDate
                    ? data.startDate.toDateString()
                    : "Select Start Date"
                }
                editable={false}
              />
            </TouchableOpacity>
            {data.showStartDatePicker && (
              <DateTimePicker
                testID="startDateTimePicker"
                value={data.startDate}
                mode="date"
                display="default"
                onChange={onStartDateChange}
              />
            )}
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
                Time
              </FormControlLabelText>
            </FormControlLabel>

            <TouchableOpacity
              onPress={() => setData({ ...data, showStartTimePicker: true })}
            >
              <TextInput
                style={styles.input}
                placeholder="Select Start Time"
                value={
                  data.startTime
                    ? data.startTime.toLocaleTimeString()
                    : "Select Start Time"
                }
                editable={false}
              />
            </TouchableOpacity>
            {data.showStartTimePicker && (
              <DateTimePicker
                testID="startTimePicker"
                value={data.startTime}
                mode="time"
                display="default"
                onChange={onStartTimeChange}
              />
            )}
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
                Meeting ID
              </FormControlLabelText>
            </FormControlLabel>
            <Input size="lg">
              <InputField
                type="text"
                defaultValue={data.meetingID}
                style={{
                  fontFamily: "Urbanist",
                }}
                onChangeText={(text) => {
                  handleInputChange("meetingID", text);
                }}
              />
            </Input>
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
                Passcode
              </FormControlLabelText>
            </FormControlLabel>
            <Input size="lg">
              <InputField
                type="text"
                defaultValue={data.passcode}
                style={{
                  fontFamily: "Urbanist",
                }}
                onChangeText={(text) => {
                  handleInputChange("passcode", text);
                }}
              />
            </Input>
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
                Invite Link
              </FormControlLabelText>
            </FormControlLabel>
            <Input size="lg">
              <InputField
                type="text"
                defaultValue={data.inviteLink}
                style={{
                  fontFamily: "Urbanist",
                }}
                onChangeText={(text) => {
                  handleInputChange("inviteLink", text);
                }}
              />
            </Input>
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
                Select Subject
              </FormControlLabelText>
            </FormControlLabel>
            {/* <Select
              defaultValue={data.subjectId}
              onValueChange={(val) => {
                setData({ ...data, subjectId: val });
                setError(null);
              }}
              style={{
                flex: 1,
                fontFamily: "Urbanist",
              }}
              size="lg"
            >
              <SelectTrigger
                variant="outline"
                size="lg"
                style={{
                  flex: 1,
                  height: 40,
                }}
              >
                <SelectInput
                  placeholder="Select"
                  style={{
                    flex: 1,
                    textTransform: "capitalize",
                    fontFamily: "Urbanist",
                    height: 40,
                  }}
                  size="lg"
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
                  {subjectData.map((subject, index) => (
                    <SelectItem
                      label={subject.name}
                      value={subject._id}
                      key={index}
                    />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select> */}
            <Select
              defaultValue={data.subjectId}
              onValueChange={(val) => {
                setData({ ...data, subjectId: val });
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
                  {subjectData.map((subject, index) => (
                    <SelectItem
                      label={subject.name}
                      value={subject._id}
                      key={index}
                    />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
          </FormControl>
        </VStack>
      </VStack>
      <HStack
        style={{
          marginHorizontal: widthPercentageToDP(4.5),
          position: "absolute",
          bottom: heightPercentageToDP(2),
          left: 0,
        }}
      >
        <Button
          style={{
            flex: 1,
          }}
          bg={colors.Primary02}
          size="lg"
          onPress={handleSubmit}
          disabled={loading}
        >
          <ButtonText
            style={{
              fontFamily: "Urbanist",
              fontSize: 16,
              textTransform: "uppercase",
            }}
          >
            {loading ? "Creating..." : "Create"}
          </ButtonText>
        </Button>
      </HStack>
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
            {true && (
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

export default NewLiveClasses;

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    fontSize: 16,
    color: colors.text,
  },
});
