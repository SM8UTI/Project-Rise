import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { API_URL, colors } from "../../../../utils/constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {
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
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  Textarea,
  TextareaInput,
  Box,
} from "@gluestack-ui/themed";
import Icon from "react-native-remix-icon";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import * as DocumentPicker from "expo-document-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../utils/firebaseConfig";

const upload = () => {
  const insets = useSafeAreaInsets();
  const [error, setError] = useState(null);
  const [subjectData, setSubjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [selectedType, setSelectedType] = useState("youtube");
  const [subjectId, setSubjectId] = useState(null);
  const [classId, setClassId] = useState(null);
  const [teacherId, setTeacherId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [data, setData] = useState({
    contentName: "",
    smallDescription: "",
    contentUrl: "",
  });

  function getSubjectById(subjectId) {
    const subjectItem = subjectData.find(
      (subjectItem) => subjectItem._id === subjectId
    );
    return subjectItem ? subjectItem.name : null;
  }

  const [classData, setClassData] = useState([]);

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

  function getClassById(classId) {
    const classItem = classData.find((classItem) => classItem._id === classId);
    return classItem ? classItem.name : null;
  }

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

  useEffect(() => {
    if (!classId) return;
    const fetchSubjectData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/admin/getSubjects/${classId}`);
        setSubjectData(res.data.subjects);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching subject data", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        }
        setError("Error fetching subject data.");
        setLoading(false);
      }
    };
    fetchSubjectData();
  }, [classId]);

  const handleSubmit = async () => {
    // // Add your handle submit logic here
    // const res = await DocumentPicker.getDocumentAsync({
    //   type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    // });
    // setError(null);
    // console.log("DocumentPicker result:", res);
    // try {
    // } catch (error) {
    //   console.error("Error uploading content", error);
    //   if (error.response) {
    //     console.error("Response data:", error.response.data);
    //     console.error("Response status:", error.response.status);
    //     console.error("Response headers:", error.response.headers);
    //   }
    //   setError("Error uploading content.");
    // }
    setSuccess("");
    setSubmitLoading(true);
    if (selectedType === "youtube") {
      if (!data.contentUrl) {
        setError("Please enter youtube URL");
        return;
      }
      if (!subjectId) {
        setError("Please select subject");
        return;
      }
      if (!data.contentName) {
        setError("Please enter title");
        return;
      }
      if (!data.smallDescription) {
        setError("Please enter description");
        return;
      }
      try {
        const res = await axios.post(`${API_URL}/teacher/addContent`, {
          isYoutube: true,
          isPdf: false,
          classId: classId,
          teacherId: teacherId,
          contentName: data.contentName,
          smallDescription: data.smallDescription,
          contentUrl: data.contentUrl,
          subject: getSubjectById(subjectId),
          subjectId: subjectId,
        });

        console.log("Response", res.data);
        setSuccess("Content uploaded successfully.");
        setSubmitLoading(false);
        setSelectedFile(null);
        setData({
          contentName: "",
          smallDescription: "",
          contentUrl: "",
        });
      } catch (error) {
        console.error("Error uploading content", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        }
        setError("Error uploading content.");
        setSubmitLoading(false);
      }
    } else {
      if (!selectedFile) {
        setError("Please select file to upload");
        return;
      }
      if (!subjectId) {
        setError("Please select subject");
        return;
      }
      if (!data.contentName) {
        setError("Please enter title");
        return;
      }
      if (!data.smallDescription) {
        setError("Please enter description");
        return;
      }
      try {
        const res = await fetch(selectedFile.uri);
        const blob = await res.blob();
        const storageRef = ref(storage, `content/${selectedFile.name}`);
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        console.log("Download URL", downloadURL);

        const response = await axios.post(`${API_URL}/teacher/addContent`, {
          isYoutube: false,
          isPdf: true,
          classId: classId,
          teacherId: teacherId,
          contentName: data.contentName,
          smallDescription: data.smallDescription,
          contentUrl: downloadURL,
          subject: getSubjectById(subjectId),
          subjectId: subjectId,
        });

        console.log("Response", response.data);
        setSuccess("Content uploaded successfully.");

        setSubmitLoading(false);
        setSelectedFile(null);
        setData({
          contentName: "",
          smallDescription: "",
          contentUrl: "",
        });
      } catch (error) {
        console.error(error);
        setError("Error uploading the banner.");
        setSubmitLoading(false);
      }
    }
  };

  const handleFileUpload = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
      ],
    });
    setError(null);
    console.log("DocumentPicker result:", res.assets[0].uri);
    if (!res.canceled) {
      setError(null);
      setSelectedFile(res.assets[0]);
    }
    try {
    } catch (error) {
      console.error("Error uploading content", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
      setError("Error uploading content.");
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
    <SafeAreaView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + heightPercentageToDP(12),
        }}
      >
        <VStack
          style={{
            marginHorizontal: widthPercentageToDP(4),
            padding: 16,
            marginTop: insets.top,
            borderRadius: 8,
          }}
          bg={colors.white}
          space="lg"
        >
          <View>
            <Text
              style={{
                fontSize: 24,
                color: "#000000",
                fontWeight: "bold",
              }}
            >
              Upload Content
            </Text>
            <Box
              style={{
                padding: 6,
                paddingHorizontal: 8,
                backgroundColor: colors.Primary04,
                borderRadius: 500,
                marginVertical: 8,
              }}
            >
              <Text className="text-sm text-center text-white font-primary">
                {getClassById(classId) ? getClassById(classId) : "Class"}
              </Text>
            </Box>
            <Text
              style={{
                fontSize: 14,
                color: colors.text,
                marginTop: 4,
              }}
            >
              Upload content for the selected subject. You can upload content in
              the form of a video, document, or a file.
            </Text>
          </View>
          <VStack space="lg">
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.text,
                  marginBottom: 4,
                }}
              >
                Select Content Role
              </Text>
              <Select
                defaultValue={selectedType}
                onValueChange={(val) => {
                  setSelectedType(val);
                  setError(null);
                }}
                bg={colors.white}
                style={{ flex: 1 }}
              >
                <SelectTrigger variant="outline" size="lg" style={{ flex: 1 }}>
                  <SelectInput
                    placeholder="Select Content Type"
                    style={{ flex: 1, textTransform: "capitalize" }}
                  />
                  <SelectIcon mr="$3">
                    <Icon
                      name="arrow-drop-down-line"
                      size={24} // Ensure this is a number, not a string
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

                    <SelectItem label={`Note`} value={"note"} />
                    <SelectItem label={`Youtube`} value={"youtube"} />
                  </SelectContent>
                </SelectPortal>
              </Select>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.text,
                  marginBottom: 4,
                }}
              >
                Select Subject
              </Text>
              <Select
                defaultValue={subjectId}
                onValueChange={(val) => {
                  setSubjectId(val);
                  setError(null);
                }}
                bg={colors.white}
                style={{ flex: 1 }}
              >
                <SelectTrigger variant="outline" size="lg" style={{ flex: 1 }}>
                  <SelectInput
                    placeholder="Select Subject"
                    style={{ flex: 1, textTransform: "capitalize" }}
                  />
                  <SelectIcon mr="$3">
                    <Icon
                      name="arrow-drop-down-line"
                      size={24} // Ensure this is a number, not a string
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
                    {subjectData.map((subject) => (
                      <SelectItem
                        label={subject.name}
                        value={subject._id}
                        key={subject._id}
                      />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
            </View>
            <FormControl size="md" isRequired={true}>
              <FormControlLabel mb="$1">
                <FormControlLabelText
                  style={{
                    fontSize: 14,
                    color: colors.text,
                    marginBottom: 4,
                  }}
                >
                  Title
                </FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  type="text"
                  defaultValue={data.contentName}
                  style={{ fontFamily: "Urbanist" }}
                  onChangeText={(text) => {
                    setData({ ...data, contentName: text });
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
                    marginBottom: 4,
                  }}
                >
                  Description
                </FormControlLabelText>
              </FormControlLabel>

              <Textarea>
                <TextareaInput
                  defaultValue={data.smallDescription}
                  style={{ fontFamily: "Urbanist" }}
                  onChangeText={(text) => {
                    setData({ ...data, smallDescription: text });
                  }}
                />
              </Textarea>
            </FormControl>
            {selectedType === "youtube" ? (
              <View>
                <FormControl size="md" isRequired={true}>
                  <FormControlLabel mb="$1">
                    <FormControlLabelText
                      style={{
                        fontSize: 14,
                        color: colors.text,
                        marginBottom: 4,
                      }}
                    >
                      Youtube URL
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputField
                      type="text"
                      defaultValue={data.contentUrl}
                      style={{ fontFamily: "Urbanist" }}
                      onChangeText={(text) => {
                        setData({ ...data, contentUrl: text });
                      }}
                    />
                  </Input>
                </FormControl>
              </View>
            ) : (
              <View>
                {selectedFile ? (
                  <Box
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 8,
                      backgroundColor: colors.Primary09,
                      borderRadius: 4,
                      padding: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#2c3e50",
                      }}
                    >
                      {selectedFile && selectedFile.name
                        ? selectedFile.name.length > 20
                          ? selectedFile.name.slice(0, 20) + "..."
                          : selectedFile.name
                        : "Selected File"}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setSelectedFile(null)}
                      style={{ padding: 4, backgroundColor: colors.white }}
                    >
                      <Icon
                        name="close-circle-fill"
                        size={20} // Ensure this is a number, not a string
                        color={colors.red}
                      />
                    </TouchableOpacity>
                  </Box>
                ) : (
                  <View>
                    <Text className="text-sm text-text mb-2">
                      Please select the file to upload the content. File should
                      be in the format of pdf, doc, docx.
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={handleFileUpload}
                      style={{
                        borderWidth: 2,
                        borderColor: "#000000",
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
                        name="upload-cloud-2-line"
                        size={32} // Ensure this is a number, not a string
                        color={colors.text}
                      />
                      <Text
                        style={{
                          color: colors.text,
                        }}
                      >
                        Select File
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </VStack>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{ marginTop: 16 }}
            onPress={handleSubmit}
            disabled={loading}
          >
            <LinearGradient
              colors={colors.gr1}
              style={{
                padding: 16,
                borderRadius: 4,
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "#FFFFFF",
                }}
              >
                {submitLoading ? "Uploading..." : "Upload"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
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
        </VStack>
      </ScrollView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default upload;
