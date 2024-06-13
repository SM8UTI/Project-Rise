import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import {
  VStack,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  Heading,
  Button,
  ButtonText,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalBody,
  HStack,
  Textarea,
  TextareaInput,
  ButtonIcon,
  Box,
} from "@gluestack-ui/themed";
import Icon from "react-native-remix-icon";
import { API_URL, colors } from "../../../utils/constant";
import axios from "axios";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

const ClassManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState({
    className: "",
    classDescription: "",
  });

  const [classData, setClassData] = useState([]);
  const [classDataLoading, setClassDataLoading] = useState(true);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/getClasses`);
        setClassData(res.data.classes);
        // console.log(res.data.classes);
      } catch (error) {
        console.log(error);
        alert("Error fetching class data.");
      } finally {
        setClassDataLoading(false); // Hide loading indicator when done
      }
    };
    fetchClassData();
    const interval = setInterval(() => {
      fetchClassData();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateClass = () => {
    setLoading(true);
    if (!data.className || !data.classDescription) {
      setError("Please fill all the fields.");
      setLoading(false);
      return;
    }

    try {
      axios
        .post(`${API_URL}/admin/addClass`, {
          name: data.className,
          description: data.classDescription,
        })
        .then(() => {
          setLoading(false);
          setSuccess("Class created successfully.");
          setTimeout(() => {
            setShowModal(false);
          }, 2000);
        });
    } catch (error) {
      alert("Error creating class.");
    }
  };

  useEffect(() => {
    console.log(data);
  }, [data]);
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  if (classDataLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.Primary03} />
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: heightPercentageToDP(2),
      }}
    >
      <VStack
        style={{
          backgroundColor: "#fff",
          marginHorizontal: widthPercentageToDP(4.5),
          flex: 1,
          borderRadius: 8,
        }}
      >
        <Button
          bg={colors.Primary03}
          onPress={() => setShowModal(true)}
          style={{
            borderRadius: 4,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ButtonIcon>
            <Icon name="add-line" size={24} color="#fff" />
          </ButtonIcon>
          <ButtonText
            style={{
              fontFamily: "Urbanist",
              marginLeft: 8,
            }}
          >
            Create Class
          </ButtonText>
        </Button>
      </VStack>
      <VStack
        style={{
          marginTop: 16,
          marginHorizontal: widthPercentageToDP(4.5),
        }}
      >
        <Text className="text-base text-mainBlack/80 font-bold">
          Class Lists
        </Text>

        <VStack
          space="md"
          style={{
            marginTop: 16,
          }}
        >
          {classData.map((item, index) => (
            <Box
              key={index}
              bg={colors.bgColor}
              style={{
                padding: 16,
                borderRadius: 8,
              }}
            >
              <VStack space="md">
                <HStack
                  space="sm"
                  style={{
                    alignItems: "center",
                  }}
                >
                  <Box
                    style={{
                      width: 30,
                      height: 30,
                      backgroundColor: colors.Primary02,
                      borderRadius: 4,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <MaterialCommunityIcons
                      name="google-classroom"
                      size={16}
                      color={colors.white}
                    />
                  </Box>
                  <Text className="text-mainBlack/80 text-base">
                    {item.name}
                  </Text>
                </HStack>
                <View>
                  <Text className="text-xs text-text">Description</Text>
                  <Text className="mt-1 text-sm text-text">
                    {item.description}
                  </Text>
                </View>
                <View>
                  <Text className="text-xs text-text/80 ml-auto">
                    {formatDate(item.createdAt)}
                  </Text>
                </View>
              </VStack>
            </Box>
          ))}
        </VStack>
      </VStack>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        size="lg"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalBody
            style={{
              padding: 16,
              backgroundColor: "#fff",
            }}
          >
            <VStack
              space="xs"
              mb="$4"
              style={{
                marginTop: 16,
              }}
            >
              <Text className="text-xl font-bold text-bold text-mainBlack/80">
                Create a Class
              </Text>
              <Text className="font-primary text-sm mt-[0.5rem] text-text">
                Create a new class for the students to join.
              </Text>
            </VStack>
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
            <VStack py="$1" space="lg">
              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText
                    style={{
                      fontFamily: "Urbanist",
                      color: colors.text,
                      fontSize: 15,
                      marginBottom: 4,
                    }}
                  >
                    Class Name
                  </FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    style={{
                      fontFamily: "Urbanist",
                    }}
                    value={data.className}
                    onChangeText={(value) => {
                      setError("");
                      setData({
                        ...data,
                        className: value,
                      });
                    }}
                  />
                </Input>
              </FormControl>
              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText
                    style={{
                      fontFamily: "Urbanist",
                      color: colors.text,
                      fontSize: 15,
                      marginBottom: 4,
                    }}
                  >
                    Class Description
                  </FormControlLabelText>
                </FormControlLabel>
                <Textarea>
                  <TextareaInput
                    style={{
                      fontFamily: "Urbanist",
                    }}
                    value={data.classDescription}
                    onChangeText={(value) => {
                      setData({
                        ...data,
                        classDescription: value,
                      });
                    }}
                  />
                </Textarea>
              </FormControl>
            </VStack>
            <Button
              mt="$4"
              onPress={() => {
                handleCreateClass();
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
                {loading ? "Loading..." : "Create Class"}
              </ButtonText>
            </Button>
            <Button
              style={{
                backgroundColor: "transparent",
                marginBottom: 8,
              }}
              onPress={() => {
                setShowModal(false);
              }}
            >
              <ButtonText
                style={{
                  color: colors.red,
                  fontFamily: "Urbanist",
                }}
              >
                Cancel
              </ButtonText>
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
      <StatusBar style="dark" />
    </ScrollView>
  );
};

export default ClassManagement;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
