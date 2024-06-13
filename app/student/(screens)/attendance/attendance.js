import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Box,
  Button,
  ButtonIcon,
  ButtonText,
  HStack,
  VStack,
  Modal,
} from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { API_URL, colors } from "../../../../utils/constant";
import { Image } from "expo-image";
import Icon from "react-native-remix-icon";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { StatusBar } from "expo-status-bar";
import { storage } from "../../../../utils/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as Location from "expo-location";
import axios from "axios";
import LottieView from "lottie-react-native";
import AttendanceCalenderView from "../../../../components/AttendanceCalenderView";

const attendance = () => {
  const insets = useSafeAreaInsets();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();
  const [statusLocation, setStatusLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [success, setSuccess] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);

  const [data, setData] = useState({
    clickedImage: "",
  });

  const [submitLoading, setSubmitLoading] = useState(false);

  const cameraRef = useRef(null);

  const getUser = async () => {
    try {
      const value = await AsyncStorage.getItem("userData");
      if (value !== null) {
        setUser(JSON.parse(value));
      }
      setLoading(false);
    } catch (e) {
      console.error("Error reading value:", e);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    (async () => {
      let dataLocation = await Location.requestForegroundPermissionsAsync();
      setStatusLocation(dataLocation.status);
    })();
  }, [statusLocation]);

  const generateUuid = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

  const checkAttendanceForToday = async () => {
    if (!user) return;
    try {
      const response = await axios.post(
        `${API_URL}/students/getAttendanceCalanderView`,
        {
          studentId: user?._id,
          month: getCurrentDate().split("-")[1],
          year: getCurrentDate().split("-")[0],
        }
      );
      const data = response.data;
      const todayAttendance = data.formattedAttendanceData.find(
        (entry) => entry.date === getCurrentDate()
      );
      setAttendanceMarked(todayAttendance !== undefined);
    } catch (error) {
      console.error("Error checking attendance for today:", error);
    }
  };

  useEffect(() => {
    checkAttendanceForToday();
  }, [user?._id]);

  const capturePhoto = async () => {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync();
        console.log(photo);
        setData({
          ...data,
          clickedImage: photo.uri,
        });
        console.log("user id", user._id);
        console.log("random ", generateUuid());
      }
    } catch (error) {
      console.log(error);
      alert("Failed to capture photo");
    }
  };

  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(currentDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const submitAttendance = async () => {
    setSubmitLoading(true);
    try {
      if (statusLocation !== "granted") {
        setErrorMsg("Permission to access location was denied");
        setErrorMsg("Please allow location permission to submit attendance");
        let { status } = await Location.requestForegroundPermissionsAsync();
        // console.log(status);
        setTimeout(() => {
          setStatusLocation(status);
          setSubmitLoading(false);
          setErrorMsg(null);
        }, 2000);
        return;
      }
      const response = await fetch(data.clickedImage);
      const blob = await response.blob();
      const storageRef = ref(
        storage,
        `attendance/${user._id}/${generateUuid()}`
      );
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      let location = await Location.getCurrentPositionAsync({});
      // console.log(
      //   "Location",
      //   location.coords.latitude,
      //   location.coords.longitude
      // );

      // console.log("Download URL", downloadURL);

      // console.log({
      //   dateFromApp: getCurrentDate(),
      //   studentId: user._id,
      //   latitude: location.coords.latitude,
      //   longitude: location.coords.longitude,
      //   selfie: downloadURL,
      // });

      const res = await axios.post(`${API_URL}/students/markAttendance`, {
        dateFromApp: getCurrentDate(),
        studentId: user._id,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        selfie: downloadURL,
      });
      // console.log(res.data);
      setTimeout(() => {
        setSubmitLoading(false);
        setSuccess(true);
        checkAttendanceForToday();
      }, 3000);
    } catch (error) {
      console.log(error);
      alert("Failed to submit attendance");
    }
  };

  if (loading)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.white,
        }}
      >
        <ActivityIndicator size="large" color={colors.Primary02} />
      </View>
    );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: insets.bottom,
        paddingTop: insets.top + heightPercentageToDP(8),
      }}
    >
      <Box
        style={{
          marginHorizontal: widthPercentageToDP(4.5),
          padding: 16,
          borderRadius: 8,
          borderColor: colors.black + "15",
          borderWidth: 1,
        }}
      >
        <VStack space="lg">
          <View className="flex-row justify-between items-center pb-0">
            <View className="flex-1 flex-col gap-1 w-1/2 h-full ">
              <Text className="text-base font-primary text-text">
                Attendance Report
              </Text>
              <Text className="text-2xl font-primary font-extrabold text-mainBlack/80 capitalize">
                {user?.name}
              </Text>
            </View>
            <LinearGradient
              colors={colors.gr2}
              className="w-[80px] h-[80px] rounded-full flex items-center justify-end overflow-hidden"
            >
              <Image
                source={user?.profilePic}
                className="w-full h-full object-center object-cover"
              />
            </LinearGradient>
          </View>
          <HStack space="md">
            <Box
              bg="#4BAE4F15"
              style={{
                flex: 1,
                padding: 8,
                borderRadius: 4,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 16,
              }}
            >
              <Image
                source={require("../../../../assets/appIcons/correct.png")}
                style={{
                  width: 50,
                  height: 50,
                }}
              />
              <Text className="text-base text-green-500 font-primary">
                Present
              </Text>
              <Text className="text-2xl text-green-500 font-bold font-primary">
                20
              </Text>
            </Box>
            <Box
              bg="#F4433615"
              style={{
                flex: 1,
                padding: 8,
                borderRadius: 4,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 16,
              }}
            >
              <Image
                source={require("../../../../assets/appIcons/remove.png")}
                style={{
                  width: 50,
                  height: 50,
                }}
              />
              <Text className="text-base text-red-500 font-primary">
                Absent
              </Text>
              <Text className="text-2xl text-red-500 font-bold font-primary">
                20
              </Text>
            </Box>
          </HStack>
          {!attendanceMarked ? (
            <Button
              bg={colors.Primary02}
              size="lg"
              onPress={() => setShowModal(true)}
            >
              <ButtonIcon
                as={() => (
                  <Icon name="user-follow-line" size={20} color="#fff" />
                )}
              />
              <ButtonText style={{ fontFamily: "Urbanist", marginLeft: 8 }}>
                Mark Attendance
              </ButtonText>
            </Button>
          ) : (
            <Box
              style={{
                backgroundColor: colors.Primary09,
                padding: 16,
              }}
            >
              <Text className="text-center text-Primary03 font-bold text-sm font-primary">
                Attendance already marked for today
              </Text>
            </Box>
          )}
        </VStack>
      </Box>

      <VStack
        space="md"
        style={{
          marginHorizontal: widthPercentageToDP(4.5),
          marginTop: heightPercentageToDP(1),
        }}
      >
        <AttendanceCalenderView studentId={user?._id} />
      </VStack>

      <Modal
        isOpen={showModal}
        size="full"
        bg="#000"
        style={{
          flex: 1,
          height: "100%",
        }}
      >
        {!permission?.granted ? (
          <View style={styles.container}>
            <Text
              style={{ textAlign: "center" }}
              className="text-xl text-white font-primary w-[300px] mx-auto mb-4"
            >
              We need your permission to show the camera view and your location
            </Text>
            <Button
              onPress={requestPermission}
              size="lg"
              bgColor={colors.Primary02}
            >
              <ButtonText
                style={{
                  fontFamily: "Urbanist",
                  color: "#fff",
                }}
              >
                Allow Camera
              </ButtonText>
            </Button>
          </View>
        ) : !data.clickedImage ? (
          <CameraView
            style={{
              flex: 1,
              width: "100%",
            }}
            facing={"front"}
            flash="off"
            ref={cameraRef}
          >
            <Button
              style={{
                position: "absolute",
                top: insets.top,
                right: 0,
                zIndex: 1000,
                backgroundColor: "transparent",
              }}
              onPress={() => setShowModal(false)}
            >
              <ButtonIcon
                as={() => (
                  <Icon name="close-fill" size={32} color={colors.red} />
                )}
              />
            </Button>
            <HStack
              space="md"
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                paddingBottom: insets.bottom + 16,
                backgroundColor: "#000",
                paddingTop: 16,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
              }}
            >
              <Box
                style={{
                  flex: 1,
                  height: heightPercentageToDP(10),
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 16,
                }}
              >
                <Button
                  bg={colors.white}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 4000,
                  }}
                  onPress={capturePhoto}
                >
                  <ButtonIcon
                    as={() => (
                      <Icon
                        name="camera-lens-fill"
                        size={32}
                        color={colors.black}
                      />
                    )}
                  />
                </Button>
              </Box>
            </HStack>
          </CameraView>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              // backgroundColor: colors.black,
            }}
          >
            <Box
              style={{
                width: widthPercentageToDP(90),
                backgroundColor: colors.white,
                borderColor: colors.white,
                borderWidth: 6,
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              {!success ? (
                <>
                  <Image
                    source={data.clickedImage}
                    style={{
                      width: widthPercentageToDP(90),
                      height: heightPercentageToDP(60),
                      objectFit: "cover",
                    }}
                  />
                  <HStack
                    space="md"
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 16,
                      padding: 16,
                    }}
                  >
                    <Button
                      style={{
                        backgroundColor: colors.bgColor,
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 8,
                      }}
                      size="lg"
                      onPress={() => setData({ ...data, clickedImage: "" })}
                      disabled={submitLoading}
                    >
                      <ButtonIcon
                        as={() => (
                          <Icon
                            name="image-add-line"
                            size={20}
                            color={colors.text}
                          />
                        )}
                      />
                      <ButtonText
                        style={{
                          fontFamily: "Urbanist",
                          color: colors.text,
                          fontSize: 16,
                          marginLeft: 8,
                        }}
                      >
                        Retake
                      </ButtonText>
                    </Button>
                    <Button
                      style={{
                        backgroundColor: colors.Primary02,
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 8,
                      }}
                      size="lg"
                      disabled={submitLoading}
                    >
                      <ButtonIcon
                        as={() => (
                          <Icon
                            name="gallery-upload-line"
                            size={20}
                            color="#fff"
                          />
                        )}
                      />
                      <ButtonText
                        style={{
                          fontFamily: "Urbanist",
                          color: colors.white,
                          fontSize: 16,
                          marginLeft: 8,
                        }}
                        onPress={submitAttendance}
                      >
                        {submitLoading ? "Submitting..." : "Submit"}
                      </ButtonText>
                    </Button>
                  </HStack>
                </>
              ) : (
                <VStack space="md">
                  <LottieView
                    autoPlay
                    loop
                    style={{
                      width: 300,
                      height: 300,
                      marginHorizontal: "auto",
                    }}
                    // Find more Lottie files at https://lottiefiles.com/featured
                    source={require("../../../../assets/animation/success.json")}
                  />
                  <Text className="text-2xl text-green-500 text-center font-bold font-primary">
                    Attendance submitted successfully
                  </Text>
                  <Button
                    style={{
                      backgroundColor: colors.red + "15",
                      width: "max-content",
                    }}
                    size="lg"
                    onPress={() => {
                      setShowModal(false);
                      setSuccess(false);
                      setData({ ...data, clickedImage: "" });
                    }}
                  >
                    <ButtonText
                      style={{
                        fontFamily: "Urbanist",
                        color: colors.red,
                        textTransform: "uppercase",
                      }}
                    >
                      Close
                    </ButtonText>
                  </Button>
                </VStack>
              )}
              {errorMsg && (
                <View className="bg-red-50">
                  <Text className="text-red-500 text-sm text-center font-primary w-2/3 mx-auto py-2">
                    Error : {errorMsg}
                  </Text>
                </View>
              )}
            </Box>
          </View>
        )}
      </Modal>
      <StatusBar style={showModal ? "light" : "dark"} />
    </ScrollView>
  );
};

export default attendance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
});
