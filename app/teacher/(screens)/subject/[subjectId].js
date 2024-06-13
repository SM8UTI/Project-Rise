import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-remix-icon";
import { API_URL, colors } from "../../../../utils/constant";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Chapter from "./Chapter";
import ClassLogs from "./ClassLogs";
import { Image } from "expo-image";

const subjectId = () => {
  const insets = useSafeAreaInsets();
  const [openChapterModal, setOpenChapterModal] = useState(false);
  const [openClassModal, setOpenClassModal] = useState(false);
  const [data, setData] = useState({
    chapterName: "",
    chapterDescription: "",
    className: "",
    SelectedChapter: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [subjectData, setSubjectData] = useState({});
  const [success, setSuccess] = useState("");
  const { subjectId } = useLocalSearchParams();
  const [classId, setClassId] = useState(null);
  const [teacherId, setTeacherId] = useState(null);
  const [selectedTab, setSelectedTab] = useState("chapter");
  const [chapterData, setChapterData] = useState([]);
  const [classLogData, setClassLogData] = useState([]);
  useEffect(() => {
    const getItem = async () => {
      try {
        const storedClassId = await AsyncStorage.getItem("classId");
        const storedTeacherId = await AsyncStorage.getItem("teacherId");
        console.log("classId", storedClassId);
        setTeacherId(storedTeacherId);
        setClassId(storedClassId);
      } catch (error) {
        console.error("Failed to fetch classId from AsyncStorage", error);
      }
    };
    getItem();
  }, []);

  const [error, setError] = useState(null);

  useEffect(() => {
    const getSubject = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/admin/getSubjectInfo/${subjectId}`
        );
        // console.log(res.data);
        setSubjectData(res.data);
        setChapterData(res.data.chapters);
        setLoading(false);
        subjectCheck(res.data?.subject?.name);
      } catch (error) {
        console.log(error);
        alert("Error fetching subject");
      }
    };
    getSubject();

    const interVal = setInterval(() => {
      getSubject();
    }, 3000);

    return () => {
      clearInterval(interVal);
    };
  }, [subjectId]);

  useEffect(() => {
    const getCLassLog = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/teacher/getClassLog/${classId}/${subjectId}`
        );
        // console.log("class log ", res.data.classLogs);
        setClassLogData(res.data.classLogs);
      } catch (error) {
        console.log(error);
        alert("Error fetching class log");
      }
    };
    if (classId && subjectId) {
      getCLassLog();

      const interVal = setInterval(() => {
        getCLassLog();
      }, 3000);

      return () => {
        clearInterval(interVal);
      };
    }
  }, [classId, subjectId]);

  const chapterSubmit = async () => {
    try {
      const res = await axios.post(`${API_URL}/teacher/addChapter`, {
        name: data.chapterName,
        description: data.chapterDescription,
        classId: classId,
        subjectId: subjectId,
        teacherId: teacherId,
      });
      console.log(res.data);
      setSuccess("Chapter added successfully");
      setTimeout(() => {
        setOpenChapterModal(false);
        setData({ ...data, chapterName: "", chapterDescription: "" });
      }, 2000);
    } catch (error) {
      console.log(error);
      alert("Error adding chapter");
      setError("Error adding chapter");
    }
    // alert("Chapter added successfully");
  };

  const classLogSubmit = async () => {
    try {
      const res = await axios.post(`${API_URL}/teacher/addClassLog`, {
        title: data.chapterName,
        description: data.description,
        classId: classId,
        subjectId: subjectId,
        teacher: teacherId,
        isActive: true,
      });
      console.log(res.data);
      setSuccess("Class Log added successfully");
      setTimeout(() => {
        setOpenClassModal(false);
        setData({ ...data, chapterName: "", description: "" });
      }, 2000);
    } catch (error) {
      console.log(error);
      alert("Error adding chapter");
      setError("Error adding chapter");
    }
  };

  const subjectIcon = {
    mathematics: require("../../../../assets/appIcons/math.png"),
    biology: require("../../../../assets/appIcons/bio.png"),
    zoology: require("../../../../assets/appIcons/zoo.png"),
    geography: require("../../../../assets/appIcons/geo.png"),
    english: require("../../../../assets/appIcons/eng.png"),
    history: require("../../../../assets/appIcons/his.png"),
    physics: require("../../../../assets/appIcons/physic.png"),
    chemistry: require("../../../../assets/appIcons/chemistry.png"),
  };

  const subjectColor = {
    mathematics: "#5C7CFA",
    biology: "#21A366",
    zoology: "#E91E63",
    geography: "#0B97E8",
    english: "#D6A203",
    history: "#EB7900",
    physics: "#CC5DE8",
    chemistry: "#2196F3",
  };

  const [subjectCSS, setSubjectCSS] = useState({
    image: "",
    color: "",
  });

  const subjectCheck = (subjectName) => {
    const subject = subjectName?.toLowerCase();
    if (subject?.includes("math")) {
      setSubjectCSS({
        image: subjectIcon.mathematics,
        color: subjectColor.mathematics,
      });
    } else if (subject?.includes("bio")) {
      setSubjectCSS({
        image: subjectIcon.biology,
        color: subjectColor.biology,
      });
    } else if (subject?.includes("zoo")) {
      setSubjectCSS({
        image: subjectIcon.zoology,
        color: subjectColor.zoology,
      });
    } else if (subject?.includes("geo")) {
      setSubjectCSS({
        image: subjectIcon.geography,
        color: subjectColor.geography,
      });
    } else if (subject?.includes("eng")) {
      setSubjectCSS({
        image: subjectIcon.english,
        color: subjectColor.english,
      });
    } else if (subject?.includes("his")) {
      setSubjectCSS({
        image: subjectIcon.history,
        color: subjectColor.history,
      });
    } else if (subject?.includes("physic")) {
      setSubjectCSS({
        image: subjectIcon.physics,
        color: subjectColor.physics,
      });
    } else if (subject?.includes("chemi")) {
      setSubjectCSS({
        image: subjectIcon.chemistry,
        color: subjectColor.chemistry,
      });
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.Primary04} />
      </View>
    );
  }

  return (
    <View>
      <VStack
        style={{
          marginHorizontal: widthPercentageToDP(4),
          marginTop: heightPercentageToDP(1),
        }}
        space="md"
      >
        <Box
          bg="#fff"
          style={{
            padding: 16,
            borderRadius: 8,
            backgroundColor: subjectCSS.color + "20",
            flexDirection: "row",
            alignItems: "center",
            overflow: "hidden",
            marginBottom: heightPercentageToDP(1),
          }}
        >
          <Image
            source={subjectCSS.image}
            style={{
              width: 50,
              height: 50,
            }}
          />
          <View
            style={{
              marginLeft: 12,
            }}
          >
            <Text
              className="text-xl  text-mainBlack/80 capitalize font-bold"
              style={{
                fontFamily: "Urbanist",
                color: subjectCSS.color,
              }}
            >
              {subjectData?.subject?.name}
            </Text>
            <Text
              className="text-sm mt-1 text-text"
              style={{
                fontFamily: "Urbanist",
                color: subjectCSS.color,
              }}
            >
              {subjectData.chapters ? subjectData.chapters.length : 0} Chapters
            </Text>
          </View>
        </Box>
        <HStack space="md">
          <Button
            bg={colors.Primary02}
            style={{
              borderRadius: 8,
              flex: 1,
            }}
            size="lg"
            onPress={() => {
              setOpenClassModal(true);
            }}
          >
            <ButtonIcon>
              <Icon name="add-line" size="20" color="#fff" />
            </ButtonIcon>
            <ButtonText
              style={{
                fontSize: 15,
                marginLeft: 8,
              }}
            >
              Add Class
            </ButtonText>
          </Button>
          <Button
            bg={colors.Primary06}
            style={{
              borderRadius: 8,
              flex: 1,
            }}
            size="lg"
            onPress={() => {
              setOpenChapterModal(true);
            }}
          >
            <ButtonIcon>
              <Icon name="add-line" size="20" color="#fff" />
            </ButtonIcon>
            <ButtonText
              style={{
                fontSize: 15,
                marginLeft: 8,
              }}
            >
              Add Chapter
            </ButtonText>
          </Button>
        </HStack>
      </VStack>
      <HStack>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            borderBottomColor:
              selectedTab === "chapter" ? colors.Primary04 : colors.text,
            borderBottomWidth: selectedTab === "chapter" ? 3 : 1,
            paddingVertical: 16,
          }}
          onPress={() => setSelectedTab("chapter")}
        >
          <Text
            style={{
              fontSize: 16,
              color: selectedTab === "chapter" ? colors.Primary04 : colors.text,
              fontFamily: "Urbanist",
              marginTop: heightPercentageToDP(2),
              marginLeft: widthPercentageToDP(4),
              textAlign: "center",
              fontWeight: selectedTab === "chapter" ? "bold" : "normal",
            }}
          >
            Chapters
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            borderBottomColor:
              selectedTab === "classLog" ? colors.Primary04 : colors.text,
            borderBottomWidth: selectedTab === "classLog" ? 3 : 1,
            paddingVertical: 16,
          }}
          onPress={() => setSelectedTab("classLog")}
        >
          <Text
            style={{
              fontSize: 16,
              color:
                selectedTab === "classLog" ? colors.Primary04 : colors.text,
              fontFamily: "Urbanist",
              marginTop: heightPercentageToDP(2),
              marginLeft: widthPercentageToDP(4),
              textAlign: "center",
              fontWeight: selectedTab === "classLog" ? "bold" : "normal",
            }}
          >
            Class Logs
          </Text>
        </TouchableOpacity>
      </HStack>
      <ScrollView
        horizontal={false}
        showsVerticalScrollIndicator={false}
        style={{
          marginHorizontal: widthPercentageToDP(4),
          paddingTop: heightPercentageToDP(1),
          height: heightPercentageToDP(65),
        }}
      >
        {selectedTab === "chapter" ? (
          <Chapter data={chapterData} />
        ) : (
          <ClassLogs data={classLogData} />
        )}
      </ScrollView>
      {/* <VStack
        style={{
          marginHorizontal: widthPercentageToDP(4),
          marginTop: heightPercentageToDP(2),
          paddingBottom: heightPercentageToDP(2),
        }}
      >
        <Accordion type="multiple" bg="transparent" shadowColor="transparent">
          <VStack space="md">
            {chapterData.map((chapter) => (
              <AccordionItem
                value={chapter.id}
                key={chapter.id}
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
                            <LinearGradient
                              colors={colors.gr1}
                              style={{
                                width: 50,
                                height: 50,
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 4,
                              }}
                            >
                              <Icon name="book-3-line" size="24" color="#fff" />
                            </LinearGradient>
                            <Box
                              style={{
                                marginLeft: 12,
                              }}
                            >
                              <Text className="text-xs text-text font-primary">
                                {chapter.chapter}
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
                    backgroundColor: colors.bgColor,
                    padding: 16,
                  }}
                >
                  <VStack space="md">
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
                  </VStack>
                </AccordionContent>
              </AccordionItem>
            ))}
          </VStack>
        </Accordion>
      </VStack> */}
      <Modal
        isOpen={openChapterModal}
        onClose={() => {
          setOpenChapterModal(false);
        }}
        size="lg"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Text className="font-primary text-xl text-mainBlack/80">
              Add Chapter
            </Text>
            <ModalCloseButton>
              <Icon name="close-line" size="24" color={colors.red} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
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
                  Chapter Name
                </FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  type="text"
                  defaultValue={data.chapterName}
                  placeholder="Enter chapter name"
                  style={{
                    fontFamily: "Urbanist",
                  }}
                  onChangeText={(text) => {
                    setData({ ...data, chapterName: text });
                  }}
                />
              </Input>
            </FormControl>
            <FormControl
              size="md"
              isRequired={true}
              style={{
                marginTop: 16,
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
                  Description
                </FormControlLabelText>
              </FormControlLabel>
              <Textarea>
                <TextareaInput
                  type="text"
                  defaultValue={data.chapterDescription}
                  style={{
                    fontFamily: "Urbanist",
                  }}
                  onChangeText={(text) => {
                    setData({ ...data, chapterDescription: text });
                  }}
                />
              </Textarea>
              <FormControlHelper>
                <FormControlHelperText>
                  under 100 characters
                </FormControlHelperText>
              </FormControlHelper>
            </FormControl>
            {error && (
              <View
                style={{
                  backgroundColor: "#ffcccc",
                  padding: 8,
                  borderRadius: 4,
                  marginTop: 16,
                }}
              >
                <Text
                  style={{
                    color: "red",
                    textAlign: "center",
                  }}
                >
                  Error : {error}
                </Text>
              </View>
            )}
            {success && (
              <View
                style={{
                  backgroundColor: "#ccffcc",
                  padding: 8,
                  borderRadius: 4,
                  marginTop: 16,
                }}
              >
                <Text
                  style={{
                    color: "green",
                    textAlign: "center",
                  }}
                >
                  Success : {success}
                </Text>
              </View>
            )}
          </ModalBody>
          <ModalFooter>
            <ModalCloseButton>
              <Button
                variant="outline"
                size="sm"
                action="secondary"
                mr="$1"
                onPress={() => {
                  setOpenChapterModal(false);
                }}
              >
                <ButtonText
                  style={{
                    fontFamily: "Urbanist",
                  }}
                >
                  Cancel
                </ButtonText>
              </Button>
            </ModalCloseButton>

            <Button
              size="sm"
              action="positive"
              borderWidth="$0"
              onPress={() => {
                chapterSubmit();
              }}
              bg={colors.Primary02}
            >
              <ButtonText
                style={{
                  fontFamily: "Urbanist",
                }}
              >
                Add Chapter
              </ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={openClassModal}
        onClose={() => {
          setOpenClassModal(false);
        }}
        size="lg"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Text className="font-primary text-xl text-mainBlack/80">
              Add Class Log
            </Text>
            <ModalCloseButton>
              <Icon name="close-line" size="24" color={colors.red} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
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
                  Class Name
                </FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  type="text"
                  defaultValue={data.chapterName}
                  style={{
                    fontFamily: "Urbanist",
                  }}
                  onChangeText={(text) => {
                    setData({ ...data, chapterName: text });
                  }}
                />
              </Input>
            </FormControl>
            <FormControl
              size="md"
              isRequired={false}
              style={{
                marginTop: 16,
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
                  Description (Optional)
                </FormControlLabelText>
              </FormControlLabel>
              <Textarea>
                <TextareaInput
                  type="text"
                  defaultValue={data.description}
                  style={{
                    fontFamily: "Urbanist",
                  }}
                  onChangeText={(text) => {
                    setData({ ...data, description: text });
                  }}
                />
              </Textarea>
              <FormControlHelper>
                <FormControlHelperText>
                  under 100 characters
                </FormControlHelperText>
              </FormControlHelper>
            </FormControl>
            {/* <FormControl size="md" isRequired={true}>
              <FormControlLabel mb="$1">
                <FormControlLabelText
                  style={{
                    fontSize: 14,
                    color: colors.text,
                    fontFamily: "Urbanist",
                    marginBottom: 4,
                    marginTop: 16,
                  }}
                >
                  Chapter
                </FormControlLabelText>
              </FormControlLabel>
              <Select
                defaultValue={data.SelectedChapter}
                onValueChange={(val) => {
                  setData({ ...data, SelectedChapter: val });
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

                    <SelectItem label={"Chapter 1"} value={"Chapter 1"} />
                    <SelectItem label={"Chapter 2"} value={"Chapter 2"} />
                    <SelectItem label={"Chapter 3"} value={"Chapter 3"} />
                  </SelectContent>
                </SelectPortal>
              </Select>
            </FormControl> */}
            {error && (
              <View
                style={{
                  backgroundColor: "#ffcccc",
                  padding: 8,
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{
                    color: "red",
                    textAlign: "center",
                  }}
                >
                  Error : {error}
                </Text>
              </View>
            )}
            {success && (
              <View
                style={{
                  backgroundColor: "#ccffcc",
                  padding: 8,
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{
                    color: "green",
                    textAlign: "center",
                  }}
                >
                  Success : {success}
                </Text>
              </View>
            )}
          </ModalBody>
          <ModalFooter>
            <ModalCloseButton>
              <Button
                variant="outline"
                size="sm"
                action="secondary"
                mr="$1"
                onPress={() => {
                  setOpenClassModal(false);
                }}
              >
                <ButtonText
                  style={{
                    fontFamily: "Urbanist",
                  }}
                >
                  Cancel
                </ButtonText>
              </Button>
            </ModalCloseButton>

            <Button
              size="sm"
              action="positive"
              borderWidth="$0"
              onPress={() => {
                classLogSubmit();
              }}
              bg={colors.Primary02}
            >
              <ButtonText
                style={{
                  fontFamily: "Urbanist",
                }}
              >
                Add
              </ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </View>
  );
};

export default subjectId;

const styles = StyleSheet.create({});
