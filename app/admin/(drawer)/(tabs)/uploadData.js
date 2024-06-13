import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
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
  Box,
} from "@gluestack-ui/themed";
import { API_URL, colors } from "../../../../utils/constant";
import Icon from "react-native-remix-icon";
import { StatusBar } from "expo-status-bar";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";

const uploadData = () => {
  const insets = useSafeAreaInsets();

  const [error, setError] = useState(null);

  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/getClasses`);
        setClasses(res.data.classes);
      } catch (error) {
        console.log(error);
        alert("Error fetching class data.");
      }
    };
    fetchClassData();
    const interval = setInterval(() => {
      fetchClassData();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const [selectedRole, setSelectedRole] = useState("student");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [jsonData, setJsonData] = useState(null);

  const handleFileUpload = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      setError(null);
      console.log("DocumentPicker result:", res); // Log the response
      setSelectedFile(res);
      const selectedFile = res.assets[0]; // Adjusted to access the first asset
      if (!selectedFile || !selectedFile.uri) {
        setError("No file selected or invalid file URI");
        setLoading(false);
        return;
      }

      // Get file information
      const fileInfo = await FileSystem.getInfoAsync(selectedFile.uri);
      if (!fileInfo.exists || fileInfo.isDirectory) {
        setError("Selected item is not a file");
        setLoading(false);
        return;
      }

      // Read the file content
      const fileContent = await FileSystem.readAsStringAsync(selectedFile.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Parse Excel data to JSON
      const workbook = XLSX.read(fileContent, { type: "base64" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);
      console.log("Excel data:", data); // Log the parsed data
      // Set JSON data
      setJsonData(data);
      setSuccess("File converted to JSON successfully");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    console.log(selectedClass);
  }, [selectedClass]);

  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!selectedFile) {
        setError("Please select the XLSX file to upload the data.");
        return;
      }
      if (!selectedRole) {
        setError("Please select the role to upload the bulk data.");
        return;
      }
      if (selectedRole === "student" && !selectedClass) {
        setError("Please select the class to upload the student data.");
        return;
      }

      if (!selectedFile) {
        setError("Please select a file to upload");
        setLoading(false);
        return;
      }
      if (selectedRole === "student") {
        axios
          .post(`${API_URL}/admin/addBulkStudent`, {
            data: jsonData,
            classId: selectedClass,
          })
          .then((res) => {
            console.log(res.data);
            if (res.data.success) {
              setSuccess("Data uploaded successfully");
              setSelectedFile(null);
              setJsonData(null);
              setSelectedRole("student");
              setSelectedClass("");
            } else {
              setError(res.data.message);
            }
          });
      } else {
        axios
          .post(`${API_URL}/admin/addBulkTeacher`, {
            data: jsonData,
          })
          .then((res) => {
            console.log(res.data);
            if (res.data.success) {
              setSuccess("Data uploaded successfully");
              setSelectedFile(null);
              setJsonData(null);
              setSelectedRole("student");
              setSelectedClass("");
            } else {
              setError(res.data.message);
            }
          });
      }
    } catch (err) {
      console.error(err);
      setError("Error converting file to JSON");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      {/* header  */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + heightPercentageToDP(12),
        }}
      >
        <VStack
          style={{
            marginHorizontal: widthPercentageToDP(4.5),
            padding: 16,
            marginTop: heightPercentageToDP(2),
            borderRadius: 8,
          }}
          bg={colors.white}
          space="lg"
        >
          <View>
            <Text className="text-xl text-mainBlack/80 font-bold">
              Upload Bulk Data
            </Text>
            <Text className="text-sm text-text mt-1">
              Please select the role to upload the bulk data in XLSX format.
            </Text>
          </View>
          <VStack space="lg">
            <View
              style={{
                flex: 1,
                marginTop: heightPercentageToDP(2),
              }}
            >
              <Select
                defaultValue={selectedRole}
                onValueChange={(val) => {
                  setSelectedRole(val);
                  setError(null);
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
                    placeholder="Select Role"
                    style={{
                      flex: 1,
                      textTransform: "capitalize",
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

                    <SelectItem label={`Student`} value={"student"} />
                    <SelectItem label={`Teacher`} value={"teacher"} />
                  </SelectContent>
                </SelectPortal>
              </Select>
            </View>
            {selectedRole === "student" && (
              <Select
                defaultValue={selectedClass}
                onValueChange={(val) => {
                  setSelectedClass(val);
                  setError(null);
                }}
                bg={colors.white}
                style={{
                  flex: 1,
                  fontFamily: "Urbanist",
                  marginTop: heightPercentageToDP(0.5),
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
                    placeholder="Select Class"
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
                    {classes.map((item, index) => (
                      <SelectItem
                        key={index}
                        label={item.name}
                        value={item._id}
                      />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
            )}
            <View
              style={{
                marginTop: heightPercentageToDP(0.5),
              }}
            >
              {selectedFile ? (
                <Box
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    backgroundColor: colors.bgColor,
                    borderRadius: 4,
                    padding: 8,
                    paddingVertical: heightPercentageToDP(4),
                  }}
                >
                  <Image
                    source={require("../../../../assets/appIcons/xlsx.png")}
                    style={{
                      width: 60,
                      height: 60,
                    }}
                  />
                  <Text className="text-base font-primary font-bold capitalize text-mainBlack">
                    {selectedFile.assets[0].name &&
                    selectedFile.assets[0].name.length > 20
                      ? selectedFile.assets[0].name.slice(0, 20) + "..."
                      : selectedFile.assets[0].name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedFile(null);
                      setSuccess("");
                      setError("");
                    }}
                    style={{
                      padding: 4,
                      backgroundColor: colors.white,
                      position: "absolute",
                      top: 8,
                      right: 8,
                    }}
                  >
                    <Icon
                      name="close-circle-fill"
                      size={32}
                      color={colors.red}
                    />
                  </TouchableOpacity>
                </Box>
              ) : (
                <View>
                  <Text className="text-sm text-text mb-4">
                    Please select the XLSX file to upload the data.
                  </Text>
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
                    <Image
                      source={require("../../../../assets/appIcons/folder.png")}
                      style={{
                        width: 60,
                        height: 60,
                      }}
                    />
                    <Text style={{ color: colors.text }}>
                      Select File from your Device
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </VStack>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              marginTop: 16,
            }}
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
              <Text className="text-white text-base">
                {loading ? "Uploading..." : "Upload Data"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          {error && (
            <View className="bg-red-50 flex-1 p-2 rounded-[4px]">
              <Text className="text-sm text-red-500 text-center px-4">
                Error : {error}
              </Text>
            </View>
          )}
          {success && (
            <View className="bg-green-50 flex-1 p-2 rounded-[4px]">
              <Text className="text-sm text-green-500 text-center px-4">
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

export default uploadData;

const styles = StyleSheet.create({});
