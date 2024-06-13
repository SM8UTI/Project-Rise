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
  ModalCloseButton,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
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
  Textarea,
  TextareaInput,
  FormControlHelper,
  FormControlHelperText,
} from "@gluestack-ui/themed";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../../../utils/constant";
import Icon from "react-native-remix-icon";
import { Image } from "expo-image";
import LottieView from "lottie-react-native";

const Chapter = ({ data }) => {
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
      <Text className="text-xl text-text capitalize font-primary">
        No Chapters
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
          {data.map((chapter, index) => (
            <AccordionItem
              value={chapter._id}
              key={chapter._id}
              style={{
                borderRadius: 8,
              }}
            >
              <AccordionHeader>
                <AccordionTrigger
                  style={{
                    backgroundColor: colors.bgColor + "10",
                    borderColor: colors.black + "10",
                    borderWidth: 1,
                    borderRadius: 8,
                  }}
                >
                  {({ isExpanded }) => {
                    return (
                      <>
                        <Box
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            style={{
                              alignItems: "center",
                              justifyContent: "center",
                              width: 60,
                              height: 60,
                              backgroundColor: "#E6E8EA40",
                              borderRadius: 4,
                            }}
                          >
                            <Image
                              source={require("../../../../assets/appIcons/bookmark.png")}
                              style={{ width: 32, height: 32 }}
                            />
                          </Box>
                          <Box
                            style={{
                              marginLeft: 12,
                            }}
                          >
                            <Text className="text-xs text-text font-primary">
                              Chapter {index + 1}
                            </Text>
                            <Text className="text-base text-mainBlack/80 font-primary font-bold">
                              {chapter.name}
                            </Text>
                          </Box>
                        </Box>
                        {isExpanded ? (
                          <AccordionIcon as={ChevronUpIcon} ml="$3" />
                        ) : (
                          <AccordionIcon as={ChevronDownIcon} ml="$3" />
                        )}
                      </>
                    );
                  }}
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent
                style={{
                  backgroundColor: colors.bgColor + "20",
                  padding: 16,
                }}
              >
                <Text className="text-sm text-text">{chapter.description}</Text>
                {/* <VStack space="md">
                  {chapter.classes.map((cls, index) => (
                    <Box key={index}>
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
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginLeft: 8,
                          }}
                        >
                          <View>
                            <Text className="text-sm text-mainBlack/80 capitalize">
                              {cls.name}
                            </Text>
                            <Text className="text-xs text-text mt-1">
                              by {cls.teacherName}
                            </Text>
                          </View>
                          <Text className="text-text text-xs uppercase">
                            {cls.date}
                          </Text>
                        </Box>
                      </Box>
                      {cls.description && (
                        <View className="pl-8 py-2 flex-1">
                          <Text className="text-xs text-text mt-1">
                            {cls.description}
                          </Text>
                        </View>
                      )}
                    </Box>
                  ))}
                </VStack> */}
              </AccordionContent>
            </AccordionItem>
          ))}
        </VStack>
      </Accordion>
    </VStack>
  );
};

export default Chapter;

const styles = StyleSheet.create({});
