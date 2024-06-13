import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";

import {
  VStack,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  Button,
  FormControlHelper,
  FormControlHelperText,
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
  ButtonIcon,
  ButtonText,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  HStack,
  ModalFooter,
  set,
} from "@gluestack-ui/themed";
import { Image } from "expo-image";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { API_URL, colors } from "../../../../utils/constant";
import Icon from "react-native-remix-icon";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const createNewTest = () => {
  const insets = useSafeAreaInsets();
  const [data, setData] = useState({
    name: "",
    type: "",
    startDate: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    endDate: new Date(),
    totalTime: "",
    scorePerQuestion: "",
    negativeMark: "",
    questions: [],
    showStartDatePicker: false,
    showStartTimePicker: false,
    showEndTimePicker: false,
    showEndDatePicker: false,
    subjectId: "",
  });
  const [question, setQuestion] = useState({
    question: "",
    isImageRequired: false,
    questionImg: "",
    option1Name: "",
    option1Answer: false,
    option2Name: "",
    option2Answer: false,
    option3Name: "",
    option3Answer: false,
    option4Name: "",
    option4Answer: false,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [subjectData, setSubjectData] = useState([]);
  const [questionModalVisible, setQuestionModalVisible] = useState(false);
  const [questionData, setQuestionData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

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
        setLoading(false);
      } catch (error) {
        console.log(error);
        alert("Error fetching subject data.");
        setLoading(false); // Ensure loading state is set to false in case of error
      }
    };
    fetchSubjectData();
  }, [classId]);

  const handleFileUpload = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "image/*", // This will allow all image types, including PNG and JPG
      });
      console.log("DocumentPicker result:", res.canceled); // Log the response
      if (!res.canceled) {
        setError(null);
        console.log("DocumentPicker result:", res); // Log the response
        setSelectedFile(res.assets[0].uri);
        setQuestion({
          ...question,
          questionImg: res.assets[0],
        });
      } else {
        setError("File selection was canceled.");
      }
    } catch (err) {
      console.error(err);
      setError("Error picking the file.");
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

  const onEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || data.endDate;
    setData((prevState) => ({
      ...prevState,
      endDate: currentDate,
      showEndDatePicker: Platform.OS === "ios",
    }));
  };

  const onEndTimeChange = (event, selectedTime) => {
    const currentDate = data.endTime;
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
      endTime: newDateWithTime,
      showEndTimePicker: Platform.OS === "ios",
    }));
  };

  const handleAddQuestionSubmit = async (data) => {
    const {
      question,
      questionImg,
      option1Name,
      option1Answer,
      option2Name,
      option2Answer,
      option3Name,
      option3Answer,
      option4Name,
      option4Answer,
    } = data;

    const options = [
      { name: option1Name, answer: option1Answer },
      { name: option2Name, answer: option2Answer },
      { name: option3Name, answer: option3Answer },
      { name: option4Name, answer: option4Answer },
    ];

    const correctAnswer = options.find((option) => option.answer)?.name || "";

    const newQuestion = {
      question,
      questionImg,
      options,
      correctAnswer,
    };

    setData((prevData) => ({
      ...prevData,
      questions: [...prevData.questions, newQuestion],
    }));

    setQuestion({
      question: "",
      isImageRequired: false,
      questionImg: "",
      option1Name: "",
      option1Answer: false,
      option2Name: "",
      option2Answer: false,
      option3Name: "",
      option3Answer: false,
      option4Name: "",
      option4Answer: false,
    });

    setQuestionModalVisible(false);
  };

  useEffect(() => {
    console.log(JSON.stringify(data, null, 2));
  }, [data]);

  const validateQuizData = () => {
    return !data.name ||
      !data.type ||
      !data.totalTime ||
      !data.scorePerQuestion ||
      !data.negativeMark ||
      !data.subjectId
      ? "Please fill all the data and check what is missing."
      : null;
  };

  const getSubjectNameById = (id) => {
    const subject = subjectData.find((subject) => subject._id === id);
    return subject ? subject.name : "Unknown Subject";
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

  const handleSubmit = async () => {
    const validationError = validateQuizData();
    if (validationError) {
      setError(validationError);
      return;
    }
    if (data.questions.length === 0) {
      setError("Please add atleast one question to create a test.");
      return;
    }

    const quizData = {
      name: data.name,
      type: data.type,
      startDate: mergeDateTime(data.startDate, data.startTime),
      endDate: mergeDateTime(data.endDate, data.endTime),
      totalTime: data.totalTime,
      scorePerQuestion: data.scorePerQuestion,
      negativeMark: data.negativeMark,
      questions: data.questions,
      subjectId: data.subjectId,
      class: classId,
      teacher: teacherData._id,
      course: "CBSE",
      subject: getSubjectNameById(data.subjectId),
    };

    console.log(JSON.stringify(quizData, null, 2));
    try {
      const response = await axios.post(
        `${API_URL}/teacher/addQuiz`,
        quizData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      setSuccess("Added successfully!");
      setData({
        ...data,
        name: "",
        type: "",
        startDate: new Date(),
        endDate: new Date(),
        totalTime: "",
        scorePerQuestion: "",
        negativeMark: "",
        questions: [],
        subjectId: "",
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Error", `Failed to add quiz. ${error.message}`);
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
        paddingBottom: insets.bottom + heightPercentageToDP(2),
      }}
    >
      <VStack
        space="md"
        style={{
          backgroundColor: "#fff",
          // padding: 8,
          marginHorizontal: widthPercentageToDP(4.5),
          borderRadius: 8,
          marginTop: heightPercentageToDP(1),
        }}
      >
        <Text className="text-mainBlack/80 text-lg"> Basic Test Info. </Text>
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
                Title
              </FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type="text"
                defaultValue={data.name}
                style={{
                  fontFamily: "Urbanist",
                }}
                onChangeText={(text) => {
                  setData({ ...data, name: text });
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
                Select Test Type
              </FormControlLabelText>
            </FormControlLabel>
            <Select
              defaultValue={data.type}
              onValueChange={(val) => {
                setData({ ...data, type: val });
                setError(null);
              }}
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

                  <SelectItem label={"Test"} value={"Test"} />
                  <SelectItem label={"Practice Test"} value={"Practice"} />
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
                Select Subject
              </FormControlLabelText>
            </FormControlLabel>
            <Select
              defaultValue={data.subjectId}
              onValueChange={(val) => {
                setData({ ...data, subjectId: val });
                setError(null);
              }}
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
                Start Date
              </FormControlLabelText>
            </FormControlLabel>
            <View>
              <Button
                onPress={() => setData({ ...data, showStartDatePicker: true })}
                style={{
                  backgroundColor: colors.bgColor,
                  flex: 1,
                }}
              >
                <Text className="text-sm text-text font-primary">
                  {data.startDate
                    ? data.startDate.toDateString()
                    : "Select Start Date"}
                </Text>
              </Button>

              {data.showStartDatePicker && (
                <DateTimePicker
                  testID="startDateTimePicker"
                  value={data.startDate}
                  mode="date"
                  display="default"
                  onChange={onStartDateChange}
                />
              )}
            </View>
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
                Start Time
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
                End Date
              </FormControlLabelText>
            </FormControlLabel>
            <View>
              <Button
                onPress={() => setData({ ...data, showEndDatePicker: true })}
                style={{
                  backgroundColor: colors.bgColor,
                  flex: 1,
                }}
              >
                <Text className="text-sm text-text font-primary">
                  {data.endDate
                    ? data.endDate.toDateString()
                    : "Select End Date"}
                </Text>
              </Button>
              {data.showEndDatePicker && (
                <DateTimePicker
                  testID="endDateTimePicker"
                  value={data.endDate}
                  mode="date"
                  display="default"
                  onChange={onEndDateChange}
                />
              )}
            </View>
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
                End Time
              </FormControlLabelText>
            </FormControlLabel>

            <TouchableOpacity
              onPress={() => setData({ ...data, showEndTimePicker: true })}
            >
              <TextInput
                style={styles.input}
                placeholder="Select Start Time"
                value={
                  data.endTime
                    ? data.endTime.toLocaleTimeString()
                    : "Select Start Time"
                }
                editable={false}
              />
            </TouchableOpacity>
            {data.showEndTimePicker && (
              <DateTimePicker
                testID="startTimePicker"
                value={data.endTime}
                mode="time"
                display="default"
                onChange={onEndTimeChange}
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
                Score Per Question
              </FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type="number"
                defaultValue={data.scorePerQuestion}
                style={{
                  fontFamily: "Urbanist",
                }}
                onChangeText={(text) => {
                  setData({ ...data, scorePerQuestion: text });
                }}
              />
            </Input>
            <FormControlHelper>
              <FormControlHelperText
                style={{
                  fontSize: 12,
                  color: colors.text,
                  fontFamily: "Urbanist",
                }}
              >
                Score per question should be in number. Example 4
              </FormControlHelperText>
            </FormControlHelper>
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
                Score Per Negative Mark
              </FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type="number"
                defaultValue={data.negativeMark}
                style={{
                  fontFamily: "Urbanist",
                }}
                onChangeText={(text) => {
                  setData({ ...data, negativeMark: text });
                }}
              />
            </Input>
            <FormControlHelper>
              <FormControlHelperText
                style={{
                  fontSize: 12,
                  color: colors.text,
                  fontFamily: "Urbanist",
                }}
              >
                Score per question should be in number. Example : 2.5
              </FormControlHelperText>
            </FormControlHelper>
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
                Total Duration
              </FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                type="number"
                defaultValue={data.totalTime}
                style={{
                  fontFamily: "Urbanist",
                }}
                onChangeText={(text) => {
                  setData({ ...data, totalTime: text });
                }}
              />
            </Input>
            <FormControlHelper>
              <FormControlHelperText
                style={{
                  fontSize: 12,
                  color: colors.text,
                  fontFamily: "Urbanist",
                }}
              >
                Total time should be in minutes. Example : 60
              </FormControlHelperText>
            </FormControlHelper>
          </FormControl>
        </VStack>
      </VStack>
      <VStack
        space="md"
        style={{
          backgroundColor: "#fff",
          // padding: 16,
          marginHorizontal: widthPercentageToDP(4.5),
          borderRadius: 8,
          marginTop: heightPercentageToDP(2),
        }}
      >
        <Text className="text-mainBlack/80 text-lg">Questions</Text>
        <Button
          bg={colors.Primary05}
          style={{
            borderRadius: 8,
            flex: 1,
            marginTop: heightPercentageToDP(1),
          }}
          size="lg"
          onPress={() => {
            setQuestionModalVisible(true);
          }}
        >
          <ButtonIcon
            style={{
              marginBottom: 2,
            }}
          >
            <Icon name="add-line" size={20} color={colors.white} />
          </ButtonIcon>
          <ButtonText
            style={{
              marginLeft: 8,
            }}
          >
            <Text
              className="text-mainBlack/80 font-primary font-bold"
              style={{
                fontSize: 16,
                color: colors.white,
              }}
            >
              Add Question
            </Text>
          </ButtonText>
        </Button>
        <VStack space="md">
          {data.questions.map((question, index) => (
            <VStack
              space="md"
              key={index}
              style={{
                borderBottomWidth: index === data.questions.length - 1 ? 0 : 1,
                borderBottomColor: colors.text,
                paddingBottom: index === data.questions.length - 1 ? 0 : 16,
              }}
            >
              <Box>
                <Text className="text-sm text-text font-primary">
                  Question {index + 1}
                </Text>
                <Text className="text-xl text-mainBlack/80 font-bold font-primary mb-4">
                  {question.question}
                </Text>
                {question.questionImg && (
                  <View
                    style={{
                      flex: 1,
                      marginBottom: 16,
                      borderRadius: 4,
                    }}
                  >
                    <Image
                      source={question.questionImg}
                      className="w-full h-48"
                    />
                  </View>
                )}
              </Box>
              <VStack space="md">
                {question.options.map((option, index) => (
                  <Box
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: 4,
                    }}
                  >
                    <Text className="text-sm text-mainBlack/50">
                      {index + 1}. {option.name}
                    </Text>
                    {option.answer && (
                      <Text className="text-xs text-green-500 font-primary">
                        Correct Answer
                      </Text>
                    )}
                  </Box>
                ))}
              </VStack>
            </VStack>
          ))}
        </VStack>
      </VStack>
      <Button
        bg={colors.Primary02}
        style={{
          borderRadius: 8,
          flex: 1,
          marginTop: heightPercentageToDP(2),
          marginHorizontal: widthPercentageToDP(4),
        }}
        size="xl"
        onPress={() => {
          handleSubmit();
        }}
      >
        <ButtonText
          style={{
            marginLeft: 8,
          }}
        >
          <Text
            className="text-mainBlack/80 font-primary font-bold"
            style={{
              fontSize: 16,
              color: colors.white,
            }}
          >
            Create a Test
          </Text>
        </ButtonText>
      </Button>
      <View
        className="mb-4"
        style={{
          marginHorizontal: widthPercentageToDP(4),
          marginTop: heightPercentageToDP(2),
        }}
      >
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
      </View>

      {/* modal  */}
      <Modal
        isOpen={questionModalVisible}
        onClose={() => {
          setQuestionModalVisible(false);
        }}
        size="lg"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Text className="font-primary text-xl text-mainBlack/80">
              Add Question
            </Text>
            <ModalCloseButton>
              <Icon name="close-line" size="24" color={colors.red} />
            </ModalCloseButton>
          </ModalHeader>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              height: heightPercentageToDP(65),
            }}
          >
            <ModalBody>
              <VStack space="md">
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
                      Question
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputField
                      type="text"
                      defaultValue={question.question}
                      style={{
                        fontFamily: "Urbanist",
                      }}
                      onChangeText={(text) => {
                        setQuestion({ ...question, question: text });
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
                      Add Image
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Select
                    defaultValue={question.isImageRequired}
                    selectedValue={question.isImageRequired}
                    onValueChange={(val) => {
                      setQuestion({ ...question, isImageRequired: val });
                      setError(null);
                    }}
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

                        <SelectItem label={"Yes"} value={true} />
                        <SelectItem label={"No"} value={false} />
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                </FormControl>
                {question.isImageRequired && (
                  <FormControl>
                    <FormControlLabel>
                      <FormControlLabelText
                        style={{
                          fontFamily: "Urbanist",
                          color: colors.text,
                          fontSize: 15,
                          marginBottom: 8,
                        }}
                      >
                        Upload Image :
                      </FormControlLabelText>
                    </FormControlLabel>
                    <View>
                      {selectedFile ? (
                        <Box>
                          <View
                            style={{
                              flex: 1,
                              height: 200,
                              width: "100%",
                            }}
                          >
                            <Image
                              source={selectedFile}
                              className="w-full h-full"
                            />
                          </View>
                          <Box
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: 8,
                              backgroundColor: colors.Primary09,
                              borderRadius: 4,
                              padding: 8,
                              marginTop: 16,
                            }}
                          >
                            <Text className="text-base capitalize text-Primary02">
                              {question.questionImg.name &&
                              question.questionImg.name.length > 20
                                ? question.questionImg.name.slice(0, 20) + "..."
                                : question.questionImg.name}
                            </Text>
                            <TouchableOpacity
                              onPress={() => setSelectedFile(null)}
                              style={{
                                padding: 4,
                                backgroundColor: colors.white,
                              }}
                            >
                              <Icon
                                name="close-circle-fill"
                                size="20"
                                color={colors.red}
                              />
                            </TouchableOpacity>
                          </Box>
                        </Box>
                      ) : (
                        <View>
                          <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={handleFileUpload}
                            style={{
                              borderWidth: 2,
                              borderColor: colors.text,
                              borderStyle: "dashed",
                              borderRadius: 4,
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              height: 200,
                              gap: 8,
                            }}
                          >
                            <Icon
                              name="image-add-fill"
                              size="32"
                              color={colors.text}
                            />
                            <Text style={{ color: colors.text }}>
                              Select Image for Banner
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                    <FormControlHelper>
                      <FormControlHelperText>
                        Must be Image ( PNG, JPG, JPEG ) size 600 x 400 px
                      </FormControlHelperText>
                    </FormControlHelper>
                  </FormControl>
                )}
                <Text className="text-base text-text">Options</Text>
                <VStack space="md">
                  <HStack space="sm">
                    <FormControl
                      size="md"
                      isRequired={true}
                      style={{
                        flex: 1,
                        marginTop: 2,
                      }}
                    >
                      <FormControlLabel mb="$1">
                        <FormControlLabelText
                          style={{
                            fontSize: 14,
                            color: colors.text,
                            fontFamily: "Urbanist",
                            marginBottom: 4,
                          }}
                        >
                          Option 1
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Input>
                        <InputField
                          type="text"
                          defaultValue={question.option1Name}
                          style={{
                            fontFamily: "Urbanist",
                          }}
                          onChangeText={(text) => {
                            setQuestion({ ...question, option1Name: text });
                          }}
                        />
                      </Input>
                    </FormControl>
                    <FormControl
                      size="sm"
                      isRequired={true}
                      style={{
                        width: 150,
                      }}
                    >
                      <FormControlLabel mb="$1">
                        <FormControlLabelText
                          style={{
                            fontSize: 14,
                            color: colors.text,
                            fontFamily: "Urbanist",
                            marginBottom: 4,
                          }}
                        >
                          Correct
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Select
                        defaultValue={question.option1Answer}
                        onValueChange={(val) => {
                          setQuestion({ ...question, option1Answer: val });
                          setError(null);
                        }}
                        style={{
                          flex: 1,
                          fontFamily: "Urbanist",
                        }}
                      >
                        <SelectTrigger
                          variant="outline"
                          size="md"
                          style={{
                            flex: 1,
                          }}
                        >
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
                              size={24}
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

                            <SelectItem label={"Yes"} value={true} />
                            <SelectItem label={"No"} value={false} />
                          </SelectContent>
                        </SelectPortal>
                      </Select>
                    </FormControl>
                  </HStack>
                  <HStack space="sm">
                    <FormControl
                      size="md"
                      isRequired={true}
                      style={{
                        flex: 1,
                        marginTop: 2,
                      }}
                    >
                      <FormControlLabel mb="$1">
                        <FormControlLabelText
                          style={{
                            fontSize: 14,
                            color: colors.text,
                            fontFamily: "Urbanist",
                            marginBottom: 4,
                          }}
                        >
                          Option 2
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Input>
                        <InputField
                          type="text"
                          defaultValue={question.option2Name}
                          style={{
                            fontFamily: "Urbanist",
                          }}
                          onChangeText={(text) => {
                            setQuestion({ ...question, option2Name: text });
                          }}
                        />
                      </Input>
                    </FormControl>
                    <FormControl
                      size="sm"
                      isRequired={true}
                      style={{
                        width: 150,
                      }}
                    >
                      <FormControlLabel mb="$1">
                        <FormControlLabelText
                          style={{
                            fontSize: 14,
                            color: colors.text,
                            fontFamily: "Urbanist",
                            marginBottom: 4,
                          }}
                        >
                          Correct
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Select
                        defaultValue={question.option2Answer}
                        onValueChange={(val) => {
                          setQuestion({ ...question, option2Answer: val });
                          setError(null);
                        }}
                        style={{
                          flex: 1,
                          fontFamily: "Urbanist",
                        }}
                      >
                        <SelectTrigger
                          variant="outline"
                          size="md"
                          style={{
                            flex: 1,
                          }}
                        >
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
                              size={24}
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

                            <SelectItem label={"Yes"} value={true} />
                            <SelectItem label={"No"} value={false} />
                          </SelectContent>
                        </SelectPortal>
                      </Select>
                    </FormControl>
                  </HStack>
                  <HStack space="sm">
                    <FormControl
                      size="md"
                      isRequired={true}
                      style={{
                        flex: 1,
                        marginTop: 2,
                      }}
                    >
                      <FormControlLabel mb="$1">
                        <FormControlLabelText
                          style={{
                            fontSize: 14,
                            color: colors.text,
                            fontFamily: "Urbanist",
                            marginBottom: 4,
                          }}
                        >
                          Option 3
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Input>
                        <InputField
                          type="text"
                          defaultValue={question.option3Name}
                          style={{
                            fontFamily: "Urbanist",
                          }}
                          onChangeText={(text) => {
                            setQuestion({ ...question, option3Name: text });
                          }}
                        />
                      </Input>
                    </FormControl>
                    <FormControl
                      size="sm"
                      isRequired={true}
                      style={{
                        width: 150,
                      }}
                    >
                      <FormControlLabel mb="$1">
                        <FormControlLabelText
                          style={{
                            fontSize: 14,
                            color: colors.text,
                            fontFamily: "Urbanist",
                            marginBottom: 4,
                          }}
                        >
                          Correct
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Select
                        defaultValue={question.option3Answer}
                        onValueChange={(val) => {
                          setQuestion({ ...question, option3Answer: val });
                          setError(null);
                        }}
                        style={{
                          flex: 1,
                          fontFamily: "Urbanist",
                        }}
                      >
                        <SelectTrigger
                          variant="outline"
                          size="md"
                          style={{
                            flex: 1,
                          }}
                        >
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
                              size={24}
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

                            <SelectItem label={"Yes"} value={true} />
                            <SelectItem label={"No"} value={false} />
                          </SelectContent>
                        </SelectPortal>
                      </Select>
                    </FormControl>
                  </HStack>
                  <HStack space="sm">
                    <FormControl
                      size="md"
                      isRequired={true}
                      style={{
                        flex: 1,
                        marginTop: 2,
                      }}
                    >
                      <FormControlLabel mb="$1">
                        <FormControlLabelText
                          style={{
                            fontSize: 14,
                            color: colors.text,
                            fontFamily: "Urbanist",
                            marginBottom: 4,
                          }}
                        >
                          Option 4
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Input>
                        <InputField
                          type="text"
                          defaultValue={question.option4Name}
                          style={{
                            fontFamily: "Urbanist",
                          }}
                          onChangeText={(text) => {
                            setQuestion({ ...question, option4Name: text });
                          }}
                        />
                      </Input>
                    </FormControl>
                    <FormControl
                      size="sm"
                      isRequired={true}
                      style={{
                        width: 150,
                      }}
                    >
                      <FormControlLabel mb="$1">
                        <FormControlLabelText
                          style={{
                            fontSize: 14,
                            color: colors.text,
                            fontFamily: "Urbanist",
                            marginBottom: 4,
                          }}
                        >
                          Correct
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Select
                        defaultValue={question.option4Answer}
                        onValueChange={(val) => {
                          setQuestion({ ...question, option4Answer: val });
                          setError(null);
                        }}
                        style={{
                          flex: 1,
                          fontFamily: "Urbanist",
                        }}
                      >
                        <SelectTrigger
                          variant="outline"
                          size="md"
                          style={{
                            flex: 1,
                          }}
                        >
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
                              size={24}
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

                            <SelectItem label={"Yes"} value={true} />
                            <SelectItem label={"No"} value={false} />
                          </SelectContent>
                        </SelectPortal>
                      </Select>
                    </FormControl>
                  </HStack>
                </VStack>
              </VStack>
              <Button
                mt="$4"
                mb="$4"
                onPress={() => {
                  handleAddQuestionSubmit(question);
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
                  {loading ? "Adding..." : "Add Question"}
                </ButtonText>
              </Button>
            </ModalBody>
          </ScrollView>
        </ModalContent>
      </Modal>
    </ScrollView>
  );
};

export default createNewTest;

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
