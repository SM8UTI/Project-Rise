import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-remix-icon";
import { API_URL, colors } from "../../../../utils/constant";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import {
  Modal,
  ModalBackdrop,
  ModalFooter,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Heading,
  ModalBody,
  Button,
  ButtonText,
  Progress,
  ProgressFilledTrack,
  HStack,
  Box,
  VStack,
  RadioGroup,
  Radio,
  RadioIndicator,
  RadioIcon,
  RadioLabel,
  CircleIcon,
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  ChevronDownIcon,
  SelectItem,
  ButtonIcon,
} from "@gluestack-ui/themed";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

// const dataQuiz = {
//   _id: "664b906229d25c709dfd2767",
//   name: "Math Quiz",
//   type: "Test",
//   startDate: "2023-05-01T00:00:00.000Z",
//   endDate: "2023-05-10T23:59:59.000Z",
//   totalTime: 60,
//   scorePerQuestion: 1,
//   negativeMark: 0.25,
//   questions: [
//     {
//       question: "What is 2 + 2?",
//       questionImg: "",
//       options: [
//         {
//           name: "2",
//           answer: false,
//           _id: "664b906229d25c709dfd2769",
//         },
//         {
//           name: "3",
//           answer: false,
//           _id: "664b906229d25c709dfd276a",
//         },
//         {
//           name: "4",
//           answer: true,
//           _id: "664b906229d25c709dfd276b",
//         },
//       ],
//       correctAnswer: "4",
//       _id: "664b906229d25c709dfd2768",
//     },
//     {
//       question: "What is the capital of France?",
//       questionImg: "",
//       options: [
//         {
//           name: "London",
//           answer: false,
//           _id: "664b906229d25c709dfd276d",
//         },
//         {
//           name: "Paris",
//           answer: true,
//           _id: "664b906229d25c709dfd276e",
//         },
//         {
//           name: "Berlin",
//           answer: false,
//           _id: "664b906229d25c709dfd276f",
//         },
//       ],
//       correctAnswer: "Paris",
//       _id: "664b906229d25c709dfd276c",
//     },
//   ],
//   subject: "Mathematics",
//   class: "Class 10",
//   teacher: "66462dd04499fb50a25cb0d8",
//   course: "CBSE",
//   date: "2024-05-20T18:03:14.662Z",
//   __v: 0,
// };

const Question = () => {
  const { questionid } = useLocalSearchParams();
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const ref = useRef(null);
  const [question, setQuestion] = useState({});

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [percentageValue, setPercentageValue] = useState(null);

  const [selectedOptions, setSelectedOptions] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isLive, setIsLive] = useState(false);

  // Function to check if the exam is live
  const isExamLive = (startDate, endDate) => {
    const now = new Date();
    const examStartDate = new Date(startDate);
    const examEndDate = new Date(endDate);
    return now >= examStartDate && now <= examEndDate;
  };

  useEffect(() => {
    // Check if the exam is live when the component mounts and whenever the start and end dates change
    setIsLive(isExamLive(question.startDate, question.endDate));
  }, [question.startDate, question.endDate]);

  useEffect(() => {
    setPercentageValue(
      ((currentQuestion + 1) / (question.questions?.length || 1)) * 100
    );
  }, [currentQuestion, question]);

  const handleOptionSelect = (questionId, optionId) => {
    setSelectedOptions((prevSelectedOptions) => {
      const updatedOptions = prevSelectedOptions.filter(
        (item) => item.questionId !== questionId
      );
      return [...updatedOptions, { questionId, choosedOptionId: optionId }];
    });
  };

  useEffect(() => {
    console.log(selectedOptions);
  }, [selectedOptions]);

  // Function to format time from seconds to minutes and seconds
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} min ${seconds < 10 ? "0" : ""}${seconds} sec`;
  };

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axios.get(
          //   `${API_URL}/students/getQuize/${questionid}`
          `${API_URL}/students/getQuize/${questionid}`
        );
        setQuestion(res.data.quiz);
        setIsLoading(false);
        console.log(res.data.quiz);
        setRemainingTime(res.data.quiz.totalTime * 60);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    fetchQuestion();
  }, [questionid]);

  const [remainingTime, setRemainingTime] = useState(); // Convert minutes to seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          // Redirect to home screen when remaining time is 0
          handleSubmit();
          return prevTime;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${API_URL}/students/saveResult`, {
        quizId: questionid,
        studentId: user._id,
        answers: selectedOptions,
      });

      navigation.navigate("student/(screens)/Result/[Resultid]", {
        Resultid: res.data.quizResult.quiz,
        Studentid: user._id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.Primary02} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* header  */}
        <HStack
          style={{
            marginHorizontal: widthPercentageToDP(4),
            paddingVertical: 10,
          }}
          space="md"
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowModal(true)}
            ref={ref}
          >
            <Icon name="close-fill" size="32" color={colors.red} />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
            }}
          >
            <Progress
              value={percentageValue}
              size="md"
              bgColor="$coolGray200"
              style={{
                flex: 1,
              }}
            >
              <ProgressFilledTrack bgColor={colors.Primary02} />
            </Progress>
            <Text className="ml-4 text-base font-bold text-Primary02">
              {currentQuestion + 1} of {question.questions?.length || 0}
            </Text>
          </View>
        </HStack>

        {/* timer live  */}
        <HStack
          style={{
            marginHorizontal: widthPercentageToDP(4),
            marginTop: heightPercentageToDP(2),
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {isLive && (
            <Box
              bgColor="#E75A5A"
              style={{
                padding: 8,
                borderRadius: 4,
                width: 50,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 500,
                  backgroundColor: "#fff",
                }}
              />
              <Text className="uppercase text-xs text-white ml-1">Live</Text>
            </Box>
          )}
          <Box
            style={{
              backgroundColor: "#E75A5A20",
              padding: 8,
              borderRadius: 4,
            }}
          >
            <Text
              className="text-sm font-primary"
              style={{
                color: colors.red,
              }}
            >
              {formatTime(remainingTime)}
            </Text>
          </Box>
        </HStack>

        <VStack
          space="md"
          style={{
            marginHorizontal: widthPercentageToDP(4),
            marginTop: heightPercentageToDP(2),
          }}
        >
          {question.questions && question.questions.length > 0 && (
            <Box
              bgColor="#fff"
              style={{
                borderRadius: 8,
                padding: 16,
                overflow: "hidden",
                borderColor: colors.black + "15",
                backgroundColor: colors.bgColor + "40",
                borderWidth: 1,
              }}
            >
              <Text className="text-sm text-text font-normal font-primary">
                Question
              </Text>
              <LinearGradient
                colors={colors.gr1}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  padding: 8,
                  borderBottomLeftRadius: 8,
                }}
              >
                <Text className="text-white text-sm">
                  {question.subject || "NA"}
                </Text>
              </LinearGradient>
              {question.questions[currentQuestion]?.question && (
                <Text className="text-[18px] text-mainBlack mt-2 font-bold pr-6">
                  {question.questions[currentQuestion].question}
                </Text>
              )}
              {question.questions[currentQuestion]?.questionImg && (
                <Image
                  source={question.questions[currentQuestion].questionImg}
                />
              )}
              <Box
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 16,
                  backgroundColor: colors.Primary09,
                  padding: 8,
                  borderRadius: 4,
                }}
              >
                <Icon
                  name="error-warning-line"
                  size="20"
                  color={colors.Primary05}
                />
                <Text className="text-xs ml-2 text-Primary04">
                  Note : Correct ans is {question.scorePerQuestion} Mark.
                </Text>
              </Box>
            </Box>
          )}
          <VStack
            space="md"
            style={{
              marginTop: heightPercentageToDP(1),
            }}
          >
            <RadioGroup
              style={{
                flexDirection: "column",
                gap: 12,
              }}
              value={
                selectedOptions.find(
                  (item) =>
                    item.questionId === question.questions[currentQuestion]._id
                )?.choosedOptionId || null
              }
              onChange={(value) =>
                handleOptionSelect(
                  question.questions[currentQuestion]._id,
                  value
                )
              }
            >
              {question.questions[currentQuestion].options.map(
                (option, index) => (
                  <Radio
                    value={option._id}
                    size="lg"
                    isInvalid={false}
                    isDisabled={false}
                    key={index}
                    style={
                      selectedOptions.find(
                        (item) =>
                          item.questionId ===
                            question.questions[currentQuestion]._id &&
                          item.choosedOptionId === option._id
                      )
                        ? {
                            borderWidth: 1,
                            borderColor: colors.Primary02,
                            backgroundColor: colors.Primary09,
                            padding: 16,
                            borderRadius: 8,
                          }
                        : {
                            backgroundColor: colors.bgColor + "30",
                            padding: 16,
                            borderRadius: 8,
                            borderColor: colors.black + "15",
                            borderWidth: 1,
                          }
                    }
                  >
                    <RadioIndicator mr="$2">
                      <RadioIcon
                        as={CircleIcon}
                        strokeWidth={1}
                        style={{
                          color: colors.Primary02,
                          borderColor: colors.Primary02,
                        }}
                      />
                    </RadioIndicator>
                    <RadioLabel
                      style={
                        selectedOptions.find(
                          (item) =>
                            item.questionId ===
                              question.questions[currentQuestion]._id &&
                            item.choosedOptionId === option._id
                        )
                          ? {
                              fontFamily: "Urbanist",
                              color: colors.Primary02,
                              fontSize: 16,
                              marginLeft: 10,
                              fontWeight: "bold",
                            }
                          : {
                              fontFamily: "Urbanist",
                              color: colors.text,
                              fontSize: 16,
                              marginLeft: 10,
                            }
                      }
                    >
                      {option.name}
                    </RadioLabel>
                  </Radio>
                )
              )}
            </RadioGroup>
          </VStack>
        </VStack>

        <View>
          <Modal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
            }}
            finalFocusRef={ref}
            size="lg"
          >
            <ModalBackdrop />
            <ModalContent>
              <ModalHeader>
                <Heading
                  size="lg"
                  style={{
                    fontFamily: "Urbanist",
                    color: colors.black,
                  }}
                >
                  Are you sure?
                </Heading>
                <ModalCloseButton>
                  <Icon name="close-fill" size="32" color={colors.red} />
                </ModalCloseButton>
              </ModalHeader>
              <ModalBody>
                <Text
                  style={{
                    fontFamily: "Urbanist",
                    color: colors.text,
                  }}
                >
                  to close the question and go back to the exam list.
                </Text>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="outline"
                  size="sm"
                  action="secondary"
                  mr="$3"
                  onPress={() => {
                    setShowModal(false);
                  }}
                >
                  <ButtonText>Cancel</ButtonText>
                </Button>
                <Button
                  size="sm"
                  action="positive"
                  borderWidth="$0"
                  onPress={() => {
                    setShowModal(false);
                    router.push("/student/(drawer)/(tabs)/exam");
                  }}
                  style={{
                    backgroundColor: colors.red,
                  }}
                >
                  <ButtonText>Exit Test</ButtonText>
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </View>
      </ScrollView>
      <HStack
        bg="#fff"
        space="md"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          flex: 1,
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 16,
          alignItems: "center",
        }}
      >
        <Select
          defaultValue={currentQuestion}
          onValueChange={(value) => {
            setCurrentQuestion(value);
          }}
        >
          <SelectTrigger
            variant="outline"
            size="lg"
            style={{
              flex: 1,
              width: 200,
            }}
          >
            <SelectInput placeholder="Select Question" />
            <SelectIcon mr="$3">
              <Icon name="arrow-drop-down-line" size="24" color={colors.text} />
            </SelectIcon>
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              {question.questions?.map((item, index) => (
                <SelectItem
                  label={`Question ${index + 1}`}
                  value={index}
                  key={index}
                />
              ))}
            </SelectContent>
          </SelectPortal>
        </Select>
        {currentQuestion + 1 === question.questions?.length ? (
          <Button
            bgColor={colors.Primary02}
            onPress={() => {
              // alert(JSON.stringify(selectedOptions));
              handleSubmit();
            }}
            size="lg"
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <ButtonText>Submit</ButtonText>
            <ButtonIcon
              style={{
                marginLeft: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 6,
              }}
            >
              <Icon name="arrow-right-line" size="16" color={colors.white} />
            </ButtonIcon>
          </Button>
        ) : (
          <Button
            bgColor={colors.Primary02}
            onPress={() => {
              setCurrentQuestion(currentQuestion + 1);
            }}
            size="lg"
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <ButtonText>Next</ButtonText>
            <ButtonIcon
              style={{
                marginLeft: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 6,
              }}
            >
              <Icon name="arrow-right-line" size="16" color={colors.white} />
            </ButtonIcon>
          </Button>
        )}
      </HStack>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default Question;

const styles = StyleSheet.create({});
