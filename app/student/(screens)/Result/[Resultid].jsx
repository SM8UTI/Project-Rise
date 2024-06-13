import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  Alert,
  AlertIcon,
  AlertText,
  Box,
  Button,
  ButtonIcon,
  ButtonText,
  HStack,
  VStack,
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
  Radio,
  RadioGroup,
  RadioIndicator,
  RadioIcon,
  RadioLabel,
} from "@gluestack-ui/themed";
import { InfoIcon } from "@gluestack-ui/themed";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { API_URL, colors } from "../../../../utils/constant";
import { Image } from "expo-image";
import Icon from "react-native-remix-icon";
import axios from "axios";
import { CircleIcon } from "@gluestack-ui/themed";

const Resultid = () => {
  const { Resultid, Studentid } = useLocalSearchParams();
  const [resultUserData, setResultUserData] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const insets = useSafeAreaInsets();

  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    const getUser = async () => {
      try {
        const value = await AsyncStorage.getItem("userData");
        if (value !== null) {
          setUser(JSON.parse(value));
        } else {
          console.error("No user data found in AsyncStorage");
        }
      } catch (e) {
        console.error("Error reading userData from AsyncStorage:", e);
      }
    };

    const fetchResultData = async () => {
      console.log("Fetch Result Call");
      console.log("resultid", Resultid, "studentid", Studentid);
      try {
        const res = await axios.get(
          `${API_URL}/students/quizResult/${Resultid}/${Studentid}`
        );
        setResultUserData(res.data.quizResult);
        console.log(
          "Result Data:",
          JSON.stringify(res.data.quizResult, null, 2)
        );
        console.log(res.data.quizResult.answers[0].isCorrect);
        console.log(res.data.quizResult.answers[1].isCorrect);
      } catch (error) {
        console.error("Error fetching result data:", error);
        setError("Error fetching result data");
      }
    };

    getUser();
    fetchResultData();
  }, [Resultid, Studentid]);

  const calculateCorrectAndFailedAnswers = (answers) => {
    let correctAnswers = 0;
    let failedAnswers = 0;

    answers.forEach((answer) => {
      if (answer.isAttempted) {
        if (answer.isCorrect) {
          correctAnswers += 1;
        } else {
          failedAnswers += 1;
        }
      }
    });

    return { correctAnswers, failedAnswers };
  };

  if (error) {
    return (
      <Alert mx="$2.5" action="error" variant="solid">
        <AlertIcon as={InfoIcon} mr="$3" />
        <AlertText>{error}</AlertText>
      </Alert>
    );
  }

  if (!resultUserData) {
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

  const { correctAnswers, failedAnswers } = calculateCorrectAndFailedAnswers(
    resultUserData.answers
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + heightPercentageToDP(12),
        }}
      >
        <VStack
          style={{
            marginHorizontal: widthPercentageToDP(4.5),
            marginTop: heightPercentageToDP(2),
          }}
          space="md"
        >
          <HStack style={styles.card} space="md">
            <View style={styles.userInfo}>
              {user ? (
                <>
                  <View>
                    <Text className="text-sm text-text font-primary mb-1">
                      Result Report
                    </Text>
                    <Text className="text-2xl text-mainBlack capitalize font-primary font-bold my-1">
                      {user.name}
                    </Text>
                    <Text style={styles.userRollNo}>#{user.rollNo}</Text>
                  </View>
                </>
              ) : (
                <Text>Loading user data...</Text>
              )}
            </View>
            {user && (
              <LinearGradient
                colors={colors.gr2}
                className=" w-[80px] h-[80px] rounded-full flex items-center justify-end overflow-hidden"
              >
                <Image
                  source={user.profilePic}
                  className=" w-full h-full object-center object-cover"
                />
              </LinearGradient>
            )}
          </HStack>
          <VStack space="md">
            {resultUserData.finalScore < 0 && (
              <Box
                bg="#F4433680"
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: heightPercentageToDP(4),
                  borderRadius: 8,
                  gap: 8,
                }}
              >
                <Image
                  source={require("../../../../assets/appIcons/failed.png")}
                  style={{
                    width: 80,
                    height: 80,
                  }}
                />
                <Text className="text-white text-xl  font-bold font-primary">
                  Failed Exam
                </Text>
              </Box>
            )}

            <Box
              style={{
                backgroundColor: colors.bgColor + "30",
                padding: 16,
                borderRadius: 8,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderColor: colors.black + "15",
                borderWidth: 1,
              }}
            >
              <Text className="text-sm text-text font-primary">Marks</Text>
              <Box
                style={{
                  flexDirection: "row-reverse",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Text className="text-xl text-mainBlack font-bold uppercase font-primary">
                  {resultUserData.score}
                </Text>
              </Box>
            </Box>
            <Box
              style={{
                backgroundColor: colors.bgColor + "30",
                padding: 16,
                borderRadius: 8,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderColor: colors.black + "15",
                borderWidth: 1,
              }}
            >
              <Text className="text-sm text-text font-primary">
                Negative Marks
              </Text>
              <Box
                style={{
                  flexDirection: "row-reverse",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Text className="text-xl text-red-500 font-bold uppercase font-primary">
                  - {resultUserData.negativeScore}
                </Text>
              </Box>
            </Box>
            <Box
              style={{
                backgroundColor: colors.bgColor + "30",
                padding: 16,
                borderRadius: 8,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderColor: colors.black + "15",
                borderWidth: 1,
              }}
            >
              <Text className="text-sm text-text font-primary">
                Final Marks
              </Text>
              <Box
                style={{
                  flexDirection: "row-reverse",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Image
                  source={require("../../../../assets/appIcons/score.png")}
                  style={{
                    width: 40,
                    height: 40,
                  }}
                />
                <Text className="text-xl text-mainBlack font-bold uppercase font-primary">
                  {resultUserData.finalScore}
                </Text>
              </Box>
            </Box>
          </VStack>
          <VStack space="md">
            <HStack space="md" style={styles.card}>
              <Box style={styles.statBox}>
                <Text style={styles.statText}>Total Questions</Text>
                <Text style={styles.statNumber}>
                  {resultUserData.totalAttemptedQuestions +
                    resultUserData.totalUnattemptedQuestions}
                </Text>
              </Box>
              <Box style={styles.statBox}>
                <Text style={styles.statText}>Attempted</Text>
                <Text style={styles.statNumber}>
                  {resultUserData.totalAttemptedQuestions}
                </Text>
              </Box>
              <Box style={styles.statBox}>
                <Text style={styles.statText}>Unattempted</Text>
                <Text style={styles.statNumber}>
                  {resultUserData.totalUnattemptedQuestions}
                </Text>
              </Box>
            </HStack>
            <HStack space="md">
              <Box
                style={{
                  flex: 1,
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#4BAE4F15",
                  padding: 8,
                  borderRadius: 8,
                  paddingVertical: 16,
                }}
              >
                <Image
                  source={require("../../../../assets/appIcons/correct.png")}
                  style={{
                    width: 30,
                    height: 30,
                  }}
                />
                <Text className="text-sm my-2 text-green-500 font-primary">
                  Correct Ans
                </Text>
                <Text className="text-2xl text-green-500 font-bold font-primary">
                  {correctAnswers}
                </Text>
              </Box>
              <Box
                style={{
                  flex: 1,
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#F4433615",
                  padding: 8,
                  borderRadius: 8,
                  paddingVertical: 16,
                }}
              >
                <Image
                  source={require("../../../../assets/appIcons/remove.png")}
                  style={{
                    width: 30,
                    height: 30,
                  }}
                />
                <Text className="text-sm my-2 text-red-500 font-primary">
                  Failed Ans
                </Text>
                <Text className="text-2xl text-red-500 font-bold font-primary">
                  {failedAnswers}
                </Text>
              </Box>
            </HStack>
          </VStack>
          <VStack space="md">
            <Text className="text-base text-text mt-2">Answers</Text>
            <Select
              defaultValue={currentQuestion}
              onValueChange={(value) => {
                setCurrentQuestion(value);
                console.log("Current Question:", value);
              }}
              bg={colors.white}
              style={{
                flex: 1,
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
                  placeholder="Select Question"
                  style={{
                    flex: 1,
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
                  {resultUserData?.answers.map((item, index) => (
                    <SelectItem
                      label={`Question ${index + 1}`}
                      value={index}
                      key={index}
                    />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
            {resultUserData.answers && resultUserData.answers.length > 0 && (
              <Box
                bg={colors.bgColor + "40"}
                style={{
                  borderRadius: 8,
                  padding: 16,
                  overflow: "hidden",
                  borderColor: colors.black + "15",
                  borderWidth: 1,
                }}
              >
                <Text className="text-sm text-text font-normal font-primary">
                  Question {currentQuestion + 1} of{" "}
                  {resultUserData.totalAttemptedQuestions +
                    resultUserData.totalUnattemptedQuestions}
                </Text>
                {/* <LinearGradient
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
                    {resultUserData?.subject || "NA"}
                  </Text>
                </LinearGradient> */}
                {resultUserData.answers[currentQuestion]?.question && (
                  <Text className="text-[18px] text-mainBlack/80 mb-1 mt-2 font-bold">
                    {resultUserData.answers[currentQuestion].question}
                  </Text>
                )}
                {resultUserData[currentQuestion]?.questionImg && (
                  <Image
                    source={
                      resultUserData?.answers[currentQuestion]?.questionImg
                    }
                  />
                )}
                {/* {resultUserData.answers[0]?.isCorrect === true ? (
                  <View className="bg-green-50 border border-green-500 max-w-fit p-2 py-2 my-3 rounded-[4px] flex flex-row items-center">
                    <Icon name="check-line" size={16} color="green" />
                    <Text className="text-xs text-green-500 font-normal ml-1">
                      Correct Answer
                    </Text>
                  </View>
                ) : (
                  <View className="bg-red-50 border border-red-500 max-w-fit p-2 py-2 my-3 rounded-[4px] flex flex-row items-center">
                    <Icon name="close-line" size={16} color="red" />
                    <Text className="text-xs text-red-500 font-normal ml-1">
                      {resultUserData.answers[currentQuestion].isAttempted
                        ? "Wrong Answer"
                        : "Not Attempted Question"}
                    </Text>
                  </View>
                )} */}
              </Box>
            )}
            <VStack
              space="md"
              style={{
                marginTop: heightPercentageToDP(1),
                marginHorizontal: widthPercentageToDP(0.25),
              }}
            >
              <RadioGroup
                style={{
                  flexDirection: "column",
                  gap: 12,
                }}
                isReadOnly
                // value={
                //   selectedOptions.find(
                //     (item) =>
                //       item.questionId ===
                //       question.questions[currentQuestion]._id
                //   )?.choosedOptionId || null
                // }
                // onChange={(value) =>
                //   handleOptionSelect(
                //     question.questions[currentQuestion]._id,
                //     value
                //   )
                // }
              >
                {resultUserData?.answers[currentQuestion].options.map(
                  (option, index) => (
                    <Radio
                      value={option._id}
                      size="lg"
                      isInvalid={false}
                      isDisabled={true}
                      key={index}
                      style={
                        resultUserData.answers[currentQuestion]
                          .choosedOption === option._id
                          ? {
                              padding: 16,
                              borderRadius: 8,
                              backgroundColor: option.answer
                                ? "#F0FDF4"
                                : "#FEF2F2",
                              borderColor: option.answer
                                ? "#4CAF50"
                                : "#EF4444",
                              borderWidth: 1,
                            }
                          : {
                              backgroundColor: option.answer
                                ? "#F0FDF4"
                                : colors.white,
                              padding: 16,
                              borderRadius: 8,
                              borderWidth: 1,
                              borderColor: option.answer
                                ? "#4caf50"
                                : colors.black + "20",
                            }
                      }
                    >
                      <Text
                        className={`p-2 mr-2 `}
                        style={
                          resultUserData.answers[currentQuestion]
                            .choosedOption === option._id
                            ? {
                                color: option.answer ? "#4CAF50" : "#EF4444",
                                fontFamily: "Urbanist",
                              }
                            : {
                                color: option.answer ? "#4CAF50" : colors.text,
                                fontFamily: "Urbanist",
                              }
                        }
                      >
                        {index + 1}.
                      </Text>
                      <RadioLabel
                        style={
                          resultUserData.answers[currentQuestion]
                            .choosedOption === option._id
                            ? {
                                color: option.answer ? "#4CAF50" : "#EF4444",
                                fontFamily: "Urbanist",
                                fontWeight: "bold",
                                fontSize: 16,
                              }
                            : {
                                color: option.answer ? "#4CAF50" : colors.text,
                                fontFamily: "Urbanist",
                              }
                        }
                      >
                        {option.name} {option.answer === true && "(Correct)"}{" "}
                        {resultUserData.answers[currentQuestion]
                          .choosedOption === option._id && "(Your Answer)"}
                      </RadioLabel>
                    </Radio>
                  )
                )}
              </RadioGroup>
            </VStack>
          </VStack>
        </VStack>
        <StatusBar style="dark" />
      </ScrollView>
      <HStack style={styles.footer} space="md">
        <Button
          size="lg"
          style={styles.footerButton}
          bg={colors.red}
          onPress={() => router.push("/student/(drawer)/(tabs)/exam")}
        >
          <ButtonIcon style={styles.buttonIcon}>
            <Icon name="home-4-line" size={16} color={colors.white} />
          </ButtonIcon>
          <ButtonText style={styles.buttonText}>Home</ButtonText>
        </Button>
        {/* <Button
          bg={colors.Primary02}
          size="lg"
          style={styles.footerButton}
          onPress={() => router.push("/leaderboards")}
        >
          <ButtonIcon style={styles.buttonIcon}>
            <Icon name="medal-line" size={16} color={colors.white} />
          </ButtonIcon>
          <ButtonText style={styles.buttonText}>Leaderboards</ButtonText>
        </Button> */}
      </HStack>
    </SafeAreaView>
  );
};

export default Resultid;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  card: {
    backgroundColor: colors.bgColor + "30",
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: colors.black + "15",
    borderWidth: 1,
  },
  userInfo: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  userRollNo: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  scoreContainer: {
    padding: 8,
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  scoreText: {
    color: "#fff",
    fontSize: 14,
  },
  scoreBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  score: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 4,
  },
  profilePicContainer: {
    width: 150,
    height: 120,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  profilePic: {
    width: "100%",
    height: "100%",
  },
  statBox: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  statText: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 4,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  footerButton: {
    borderRadius: 8,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonIcon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    marginLeft: 4,
  },
});
