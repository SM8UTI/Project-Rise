import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios from "axios";
import { API_URL, colors } from "../../../utils/constant";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import {
  Input,
  InputField,
  VStack,
  Textarea,
  TextareaInput,
  ButtonText,
  ButtonIcon,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@gluestack-ui/themed";
import { Box, AvatarFallbackText, Avatar } from "@gluestack-ui/themed";
import { Image } from "expo-image";
import { HStack } from "@gluestack-ui/themed";
import { Button } from "@gluestack-ui/themed";
import Icon from "react-native-remix-icon";
import { StatusBar } from "expo-status-bar";
const teacherid = () => {
  const { teacherid } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [teacherData, setTeacherData] = useState({});
  const [loading, setLoading] = useState(true);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [classData, setClassData] = useState([]);
  const [assignClass, setAssignClass] = useState([]);
  const [filterClassData, setFilterClassData] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingAssignClass, setLoadingAssignClass] = useState("");
  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/getClasses`);
        setClassData(res.data.classes);

        // console.log(res.data.classes);
      } catch (error) {
        console.log(error);
        alert("Error fetching class data.");
      }
    };
    fetchClassData();
  }, []);

  const teacherFetch = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/getTeacher/${teacherid}`);
      setTeacherData(res.data.teacher);
      setLoading(false);
    } catch (error) {
      console.log(error);
      alert("An error occurred. Please try again later.");
    }
  };

  useEffect(() => {
    teacherFetch();
  }, [teacherid]);

  useEffect(() => {
    // Check if teacherData and teacherData.classes are defined
    if (teacherData && teacherData.classes) {
      // Filter out teacher's classes from classData and store in filterClassData
      const filteredClasses = classData.filter(
        (elem) =>
          !teacherData.classes.find(
            (teacherClass) => teacherClass.classId === elem._id
          )
      );
      setFilterClassData(filteredClasses);
    }
  }, [classData, teacherData]);

  useEffect(() => {
    console.log(
      "Teacher Classes : ",
      JSON.stringify(teacherData.classes, null, 2)
    );
    console.log("Filter Classes : ", JSON.stringify(filterClassData, null, 2));
    console.log("Assign Classes : ", JSON.stringify(assignClass, null, 2));
  }, [filterClassData, assignClass]);

  const handleClassToggle = (elem) => {
    // Check if the class is already assigned
    const isAssigned = assignClass.some(
      (assignedClass) => assignedClass.classId === elem._id
    );

    // If the class is not assigned, add it to the assignClass state
    if (!isAssigned) {
      setAssignClass([...assignClass, { name: elem.name, classId: elem._id }]);
    } else {
      // If the class is already assigned, remove it from the assignClass state
      setAssignClass(
        assignClass.filter(
          (assignedClass) => assignedClass.classId !== elem._id
        )
      );
    }
  };

  const AssignClassesSubmit = async () => {
    setLoadingAssignClass(true);
    try {
      const res = await axios.post(
        `${API_URL}/admin/assignClass/${teacherid}`,
        {
          classes: assignClass,
        }
      );
      console.log(res);
      setSuccess("Class Assigned");
      setLoadingAssignClass(false);
      teacherFetch();
      setTimeout(() => {
        setAssignModalVisible(false);
        setAssignClass([]);
        setError("");
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.log(error);
      alert("Error Assign Class to the teacher");
      setError("Error Assign Class");
      setLoadingAssignClass(false);
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
      <HStack
        space="md"
        style={{
          marginHorizontal: widthPercentageToDP(4),
          marginTop: heightPercentageToDP(1),
        }}
      >
        <Button
          bg={colors.Primary02}
          style={{
            flex: 1,
          }}
          onPress={() => {
            setAssignModalVisible(true);
          }}
        >
          <ButtonIcon
            as={() => <Icon name="add-line" color={colors.white} size={20} />}
          />
          <ButtonText
            style={{
              color: colors.white,
              fontFamily: "Urbanist",
            }}
          >
            Assign Class
          </ButtonText>
        </Button>
      </HStack>
      <VStack
        space="2xl"
        style={{
          marginHorizontal: widthPercentageToDP(4),
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: heightPercentageToDP(4.5),
          }}
        >
          {teacherData.profilePic ? (
            <Box
              w={150}
              h={150}
              style={{
                borderRadius: 8,
                overflow: "hidden",
                borderColor: colors.white,
                borderWidth: 4,
                borderRadius: 500,
              }}
            >
              <Image
                source={{ uri: teacherData.profilePic }}
                alt="Profile Picture"
                style={{ width: "100%", height: "100%" }}
              />
            </Box>
          ) : (
            <Avatar bgColor={colors.Primary02} size="2xl" borderRadius="$full">
              <AvatarFallbackText>{teacherData.name}</AvatarFallbackText>
            </Avatar>
          )}
        </View>
        <VStack
          space="md"
          style={{
            backgroundColor: colors.white,
            padding: 16,
            borderRadius: 8,
          }}
        >
          <Box style={{ flex: 1 }}>
            <Text className="text-sm text-text font-primary mb-1">Name</Text>
            <Input isDisabled={true} size="lg">
              <InputField
                value={teacherData.name}
                style={{
                  color: colors.black,
                  paddingVertical: 8,
                  fontFamily: "Urbanist",
                  fontSize: 16,
                }}
              />
            </Input>
          </Box>
          <Box style={{ flex: 1 }}>
            <Text className="text-sm text-text font-primary mb-1">Email</Text>
            <Input isDisabled={true} size="lg">
              <InputField
                value={teacherData.emailId}
                style={{
                  color: colors.black,
                  paddingVertical: 8,
                  fontFamily: "Urbanist",
                  fontSize: 16,
                }}
              />
            </Input>
          </Box>
          <Box style={{ flex: 1 }}>
            <Text className="text-sm text-text font-primary mb-1">
              Phone Number
            </Text>
            <Input isDisabled={true} size="lg">
              <InputField
                value={`+91 ${teacherData.phoneNumber}`}
                style={{
                  color: colors.black,
                  paddingVertical: 8,
                  fontFamily: "Urbanist",
                  fontSize: 16,
                }}
              />
            </Input>
          </Box>
          <Box style={{ flex: 1 }}>
            <Text className="text-sm text-text font-primary mb-1">Gender</Text>
            <Input isDisabled={true} size="lg">
              <InputField
                value={`${teacherData.gender}`}
                style={{
                  color: colors.black,
                  paddingVertical: 8,
                  fontFamily: "Urbanist",
                  fontSize: 16,
                }}
              />
            </Input>
          </Box>
          <Box style={{ flex: 1 }}>
            <Text className="text-sm text-text font-primary mb-1">
              Date of Birth
            </Text>
            <Input isDisabled={true} size="lg">
              <InputField
                value={`${new Date(teacherData.dob).toLocaleDateString(
                  undefined,
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}`}
                style={{
                  color: colors.black,
                  paddingVertical: 8,
                  fontFamily: "Urbanist",
                  fontSize: 16,
                }}
              />
            </Input>
          </Box>
          <Box style={{ flex: 1 }}>
            <Text className="text-sm text-text font-primary mb-1">Address</Text>
            <Textarea isDisabled={true} size="lg">
              <TextareaInput
                value={`${teacherData.address}, ${teacherData.city}, ${teacherData.state}, ${teacherData.country}`}
                style={{
                  color: colors.black,
                  paddingVertical: 8,
                  fontFamily: "Urbanist",
                  fontSize: 16,
                }}
                numberOfLines={4}
                multiline={true}
              />
            </Textarea>
          </Box>
          <Box style={{ flex: 1 }}>
            <Text className="text-sm text-text font-primary mb-1">
              Created At
            </Text>
            <Input isDisabled={true} size="lg">
              <InputField
                value={`${new Date(teacherData.createdAt).toLocaleDateString(
                  undefined,
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}`}
                style={{
                  color: colors.black,
                  paddingVertical: 8,
                  fontFamily: "Urbanist",
                  fontSize: 16,
                }}
              />
            </Input>
          </Box>
          <Box>
            <Text className="text-sm text-text font-primary mb-2">
              Subjects
            </Text>
            {teacherData.subjects.length === 0 ? (
              <Text className="text-sm text-text font-primary mb-2 mt-2 text-center">
                No Subjects
              </Text>
            ) : (
              <HStack space="sm">
                {teacherData.subjects.map((elem) => (
                  <Box
                    key={elem._id}
                    style={{
                      backgroundColor: colors.Primary02,
                      padding: 8,
                      borderRadius: 500,
                      paddingHorizontal: 12,
                    }}
                  >
                    <Text className="text-sm text-white">{elem.name}</Text>
                  </Box>
                ))}
              </HStack>
            )}
          </Box>
          <Box>
            <Text className="text-sm text-text font-primary mb-2">Classes</Text>
            {teacherData.classes.length === 0 ? (
              <Text className="text-sm text-text font-primary mb-2 mt-2 text-center">
                No Classes
              </Text>
            ) : (
              <HStack space="sm">
                {teacherData.classes.map((elem) => (
                  <Box
                    key={elem._id}
                    style={{
                      backgroundColor: colors.Primary02,
                      padding: 8,
                      borderRadius: 500,
                      paddingHorizontal: 12,
                    }}
                  >
                    <Text className="text-sm text-white">{elem.name}</Text>
                  </Box>
                ))}
              </HStack>
            )}
          </Box>
        </VStack>
      </VStack>
      <Modal
        isOpen={assignModalVisible}
        onClose={() => {
          setAssignModalVisible(false);
        }}
        size="lg"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Text className="text-lg text-mainBlack/80 font-bold">
              Assign Class to{" "}
              <Text className="text-primary font-bold">{teacherData.name}</Text>
            </Text>
            <ModalCloseButton>
              <Icon name="close-line" size={24} color={colors.red} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            {error && (
              <View className="bg-red-50 flex-1 p-2 mt-2 rounded-[4px] mb-4">
                <Text className="text-sm text-red-500 text-center px-4">
                  Error : {error}
                </Text>
              </View>
            )}
            {success && (
              <View className="bg-green-50 flex-1 p-2 rounded-[4px] mt-2 mb-4">
                <Text className="text-sm text-green-500 text-center px-4">
                  Success : {success}
                </Text>
              </View>
            )}
            <HStack space="sm" flexWrap="wrap">
              {filterClassData.map((elem) => (
                <TouchableOpacity
                  key={elem._id}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    backgroundColor: assignClass.some(
                      (assignedClass) => assignedClass.classId === elem._id
                    )
                      ? colors.Primary06
                      : colors.bgColor,
                    borderRadius: 500,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => handleClassToggle(elem)}
                >
                  {assignClass.some(
                    (assignedClass) => assignedClass.classId === elem._id
                  ) ? (
                    <Icon name="check-line" size={20} color={colors.white} />
                  ) : (
                    <Icon name="add-line" size={20} color={colors.text} />
                  )}
                  <Text
                    style={{
                      color: assignClass.some(
                        (assignedClass) => assignedClass.classId === elem._id
                      )
                        ? colors.white
                        : colors.text,
                    }}
                  >
                    {elem.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </HStack>
          </ModalBody>
          <ModalFooter>
            <Button
              bg={colors.Primary02}
              onPress={() => {
                AssignClassesSubmit();
              }}
              style={{
                flex: 1,
                marginBottom: heightPercentageToDP(2),
              }}
            >
              <ButtonText style={{ color: colors.white }}>Assign</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <StatusBar style="dark" />
    </ScrollView>
  );
};

export default teacherid;

const styles = StyleSheet.create({});
