import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as DocumentPicker from "expo-document-picker";

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
  Button,
  ButtonText,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalBody,
  HStack,
  ButtonIcon,
  Box,
  FormControlHelper,
  FormControlHelperText,
} from "@gluestack-ui/themed";
import Icon from "react-native-remix-icon";
import { API_URL, colors } from "../../../utils/constant";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { storage } from "../../../utils/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import LottieView from "lottie-react-native";

const bannerManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [data, setData] = useState({
    title: "",
    image: "",
  });

  const [bannerList, setBannerList] = useState([]);

  const handleFileUpload = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "image/*", // This will allow all image types, including PNG and JPG
      });
      console.log("DocumentPicker result:", res.canceled); // Log the response
      if (!res.canceled) {
        setError(null);
        console.log("DocumentPicker result:", res); // Log the response
        setSelectedFile(res.assets[0].uri);
        setData({
          ...data,
          image: res.assets[0],
        });
      } else {
        setError("File selection was canceled.");
      }
    } catch (err) {
      console.error(err);
      setError("Error picking the file.");
    }
  };

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const handleSubmit = async () => {
    setLoadingSubmit(true);
    if (!data.image.uri) {
      setError("Please select an image.");
      setLoadingSubmit(false);
      return;
    }
    if (!data.title) {
      setError("Please enter the title.");
      setLoadingSubmit(false);
      return;
    }
    try {
      const response = await fetch(data.image.uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `banners/${data.image.name}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      console.log("Download URL", downloadURL);

      const res = await axios.post(`${API_URL}/admin/addBannerFirebase`, {
        title: data.title,
        image: downloadURL,
      });

      console.log("Add Banner", res.data);
      setSuccess("Banner uploaded successfully.");

      setLoadingSubmit(false);
      setTimeout(() => {
        setShowModal(false);
        setSuccess("");
        setData({
          title: "",
          image: "",
        });
        setSelectedFile(null);
      }, 2000);
    } catch (error) {
      console.error(error);
      setError("Error uploading the banner.");
      setLoadingSubmit(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/getBanners`);
        console.log("Banners", res.data);
        setBannerList(res.data.banners);
      } catch (error) {
        console.error(error);
        alert("Error fetching images");
      }
    };
    fetchImages();
    const interVal = setInterval(() => {
      fetchImages();
    }, 10000);
    return () => clearInterval(interVal);
  }, []);

  if (loading) {
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
          style={{
            borderRadius: 4,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            setShowModal(true);
            console.log("Create Subject");
          }}
        >
          <ButtonIcon>
            <Icon name="image-add-fill" size={16} color="#fff" />
          </ButtonIcon>
          <ButtonText
            style={{
              fontFamily: "Urbanist",
              marginLeft: 8,
            }}
          >
            Upload Banner
          </ButtonText>
        </Button>
      </VStack>
      <VStack
        style={{
          marginHorizontal: widthPercentageToDP(4.5),
          marginTop: heightPercentageToDP(2),
        }}
        space="lg"
      >
        <Text className="text-base text-mainBlack/80 font-bold">Banners</Text>
        <VStack space="md">
          {bannerList.length === 0 && (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                height: 500,
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
                source={require("../../../assets/animation/search2.json")}
              />
              <Text className="text-xl text-text capitalize font-primary">
                No Ads Found
              </Text>
            </View>
          )}
          {bannerList.map((banner, index) => (
            <Box
              key={index}
              bg="#fff"
              style={{
                padding: 16,
                borderRadius: 8,
                backgroundColor: colors.bgColor,
              }}
            >
              <Image
                source={banner.image}
                className="w-full h-40 rounded-sm overflow-hidden"
              />
              <Text className="text-base text-mainBlack/80 mt-2">
                {banner.title}
              </Text>
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
                Upload a Banner
              </Text>
              <Text className="font-primary text-sm mt-[0.5rem] text-text">
                Upload a banner for your ad campaign or promotion. it is showing
                student home.
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
                    Title
                  </FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    style={{
                      fontFamily: "Urbanist",
                    }}
                    value={data.title}
                    onChangeText={(value) => {
                      setError("");
                      setData({
                        ...data,
                        title: value,
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
                      marginBottom: 8,
                    }}
                  >
                    Upload Image :
                  </FormControlLabelText>
                </FormControlLabel>
                <View>
                  {selectedFile ? (
                    <Box>
                      <View
                        style={{
                          flex: 1,
                          height: 200,
                          width: "100%",
                        }}
                      >
                        <Image
                          source={selectedFile}
                          className="w-full h-full"
                        />
                      </View>
                      <Box
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 8,
                          backgroundColor: colors.Primary09,
                          borderRadius: 4,
                          padding: 8,
                          marginTop: 16,
                        }}
                      >
                        <Text className="text-base capitalize text-Primary02">
                          {data.image.name && data.image.name.length > 20
                            ? data.image.name.slice(0, 20) + "..."
                            : data.image.name}
                        </Text>
                        <TouchableOpacity
                          onPress={() => setSelectedFile(null)}
                          style={{
                            padding: 4,
                            backgroundColor: colors.white,
                          }}
                        >
                          <Icon
                            name="close-circle-fill"
                            size="20"
                            color={colors.red}
                          />
                        </TouchableOpacity>
                      </Box>
                    </Box>
                  ) : (
                    <View>
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
                        <Icon
                          name="image-add-fill"
                          size="32"
                          color={colors.text}
                        />
                        <Text style={{ color: colors.text }}>
                          Select Image for Banner
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                <FormControlHelper>
                  <FormControlHelperText>
                    Must be Image ( PNG, JPG, JPEG ) size 600 x 400 px
                  </FormControlHelperText>
                </FormControlHelper>
              </FormControl>
            </VStack>
            <Button
              mt="$4"
              onPress={() => {
                handleSubmit();
              }}
              style={{
                backgroundColor: colors.Primary03,
              }}
              disabled={loadingSubmit}
            >
              <ButtonText
                style={{
                  fontFamily: "Urbanist",
                }}
              >
                {loadingSubmit ? "Loading..." : "Upload"}
              </ButtonText>
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
      <StatusBar style="dark" />
    </ScrollView>
  );
};

export default bannerManagement;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
