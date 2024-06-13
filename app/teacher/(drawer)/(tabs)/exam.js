import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import Icon from "react-native-remix-icon";
import {
  Button,
  ButtonIcon,
  ButtonText,
  VStack,
  Box,
  HStack,
} from "@gluestack-ui/themed";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../../../utils/constant";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { router } from "expo-router";
import { Image } from "expo-image";

const examQuizData = [
  {
    id: "1",
    title: "Quiz 1",
    totalQuestion: 10,
    totalMarks: 100,
    duration: 30,
    users: 100,
    createdDate: "2021-09-01",
  },
  {
    id: "2",
    title: "Quiz 2",
    totalQuestion: 10,
    totalMarks: 100,
    users: 100,
    duration: 30,
    createdDate: "2021-09-01",
  },
];

const exam = () => {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + heightPercentageToDP(12),
        }}
      >
        <VStack
          space="md"
          style={{
            marginHorizontal: widthPercentageToDP(4),
            marginTop: heightPercentageToDP(4),
          }}
        >
          <View
            style={{
              flex: 1,
              marginTop: heightPercentageToDP(2),
            }}
          >
            <Text
              className="text-mainBlack/80 font-primary font-bold"
              style={{
                fontSize: 20,
              }}
            >
              Exam & Quiz Management
            </Text>
          </View>
          {/* <Button
            bg={colors.Primary02}
            style={{
              borderRadius: 8,
              flex: 1,
              marginTop: heightPercentageToDP(1),
            }}
            size="lg"
            onPress={() => router.push("teacher/(screens)/exam/createNewTest")}
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
                Create New Test
              </Text>
            </ButtonText>
          </Button> */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              backgroundColor: colors.Primary04,
              padding: 16,
              borderRadius: 8,
              marginTop: heightPercentageToDP(2),
            }}
            onPress={() => router.push("teacher/(screens)/exam/createNewTest")}
          >
            <Box
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Image
                source={require("../../../../assets/appIcons/exam.png")}
                style={{
                  width: 60,
                  height: 60,
                }}
              />
              <Text className="text-xl text-white text-center w-[250px] mx-auto font-primary font-bold">
                Create a New Test & Quiz
              </Text>
            </Box>
          </TouchableOpacity>
        </VStack>
        {/* <VStack
          space="md"
          style={{
            marginHorizontal: widthPercentageToDP(4),
            marginTop: heightPercentageToDP(2),
          }}
        >
          <Text className="text-base text-text">Test Lists</Text>
          <VStack space="sm">
            <View
              style={{
                backgroundColor: colors.white,
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
            <VStack
              space="md"
              style={{
                marginTop: heightPercentageToDP(2),
              }}
            >
              {examQuizData.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    backgroundColor: colors.white,
                    borderRadius: 8,
                    padding: 16,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 4,
                          backgroundColor: colors.Primary02,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Icon
                          name="survey-line"
                          size={20}
                          color={colors.white}
                        />
                      </Box>
                      <Text className="text-mainBlack/80 font-primary font-bold text-base ml-2">
                        {item.title && item.title.length > 10
                          ? item.title.slice(0, 10) + "..."
                          : item.title}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Icon
                        name="user-3-line"
                        size={16}
                        color={colors.Primary04}
                      />
                      <Text
                        className="text-text font-primary font-bold"
                        style={{
                          fontSize: 14,
                          marginLeft: 4,
                        }}
                      >
                        {item.users}
                      </Text>
                    </View>
                  </View>
                  <VStack
                    space="sm"
                    style={{
                      padding: 8,
                      marginTop: heightPercentageToDP(1),
                    }}
                  >
                    <Box
                      style={{
                        flex: 1,
                      }}
                    >
                      <View
                        className="text-text font-primary"
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text className="text-sm font-primary text-text">
                          Total Questions:
                        </Text>
                        <Text className="font-primary text-mainBlack/50 text-sm font-bold ml-1">
                          {item.totalQuestion} Min.
                        </Text>
                      </View>
                    </Box>
                    <Box
                      style={{
                        flex: 1,
                      }}
                    >
                      <View
                        className="text-text font-primary"
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text className="text-sm font-primary text-text">
                          Total Marks:
                        </Text>
                        <Text className="font-primary text-mainBlack/50 text-sm font-bold ml-1">
                          {item.totalMarks} Min.
                        </Text>
                      </View>
                    </Box>
                    <Box
                      style={{
                        flex: 1,
                      }}
                    >
                      <View
                        className="text-text font-primary"
                        style={{
                          fontSize: 14,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text className="text-sm font-primary text-text">
                          Duration:
                        </Text>
                        <Text className="font-primary text-mainBlack/50 text-sm font-bold ml-1">
                          {item.duration} Min.
                        </Text>
                      </View>
                    </Box>
                    <Box
                      style={{
                        flex: 1,
                      }}
                    >
                      <View
                        className="text-text font-primary"
                        style={{
                          fontSize: 14,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text className="text-sm font-primary text-text">
                          Created Date:
                        </Text>
                        <Text className="font-primary text-mainBlack/50 text-sm font-bold ml-1">
                          {item.createdDate}
                        </Text>
                      </View>
                    </Box>
                  </VStack>
                </TouchableOpacity>
              ))}
            </VStack>
          </VStack>
        </VStack> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default exam;

const styles = StyleSheet.create({});
