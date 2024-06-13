import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  Box,
  Button,
  ButtonIcon,
  ButtonText,
  HStack,
  VStack,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
  AccordionContentText,
  AccordionIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@gluestack-ui/themed";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../../../utils/constant";
import Icon from "react-native-remix-icon";
import LottieView from "lottie-react-native";

const ClassLog = ({ data }) => {
  return data && data.length === 0 ? (
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
        source={require("../../../../assets/animation/search2.json")}
      />
      <Text className="text-lg text-text capitalize font-primary text-center w-[250px]">
        No Class logs found, please check back later.
      </Text>
    </View>
  ) : (
    <VStack
      style={{
        // marginHorizontal: widthPercentageToDP(4),
        marginTop: heightPercentageToDP(2),
        paddingBottom: heightPercentageToDP(2),
      }}
    >
      <Accordion type="multiple" bg="transparent" shadowColor="transparent">
        <VStack space="md">
          {data.map((classItem, index) => (
            <AccordionItem
              value={classItem._id}
              key={classItem._id}
              style={{
                borderRadius: 8,
              }}
            >
              <AccordionHeader>
                <AccordionTrigger>
                  {({ isExpanded }) => {
                    return (
                      <>
                        <Box
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Box>
                            <Icon
                              name="checkbox-circle-fill"
                              size="24"
                              color="#27AE60"
                            />
                          </Box>
                          <Box
                            style={{
                              marginLeft: 12,
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                              flex: 1,
                            }}
                          >
                            <View>
                              <Text className="text-base text-mainBlack/80 font-primary font-bold">
                                {classItem.title}
                              </Text>
                              <Text className="text-xs text-text font-primary">
                                by {classItem.teacher.name}
                              </Text>
                            </View>
                            <Text className="text-xs text-text font-primary">
                              {new Date(classItem.date).toLocaleDateString(
                                undefined,
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </Text>
                          </Box>
                        </Box>
                        {/* {isExpanded ? (
                          <AccordionIcon as={ChevronUpIcon} ml="$3" />
                        ) : (
                          <AccordionIcon as={ChevronDownIcon} ml="$3" />
                        )} */}
                      </>
                    );
                  }}
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent
                style={{
                  backgroundColor: colors.bgColor,
                  padding: 16,
                }}
              >
                <Text className="text-sm text-text">
                  {classItem.description}
                </Text>
              </AccordionContent>
            </AccordionItem>
          ))}
        </VStack>
      </Accordion>
    </VStack>
  );
};

export default ClassLog;

const styles = StyleSheet.create({});
