import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config"; // Optional if you want to use default theme
import { useFonts } from "expo-font";

import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";

const _layout = () => {
  const [fontsload] = useFonts({
    Urbanist: require("../assets/fonts/Urbanist-VariableFont_wght.ttf"),
    UrbanistItalic: require("../assets/fonts/Urbanist-Italic-VariableFont_wght.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }

    prepare();
  }, []);

  if (!fontsload) {
    return undefined;
  } else {
    SplashScreen.hideAsync();
  }

  return (
    <GluestackUIProvider config={config}>
      <SafeAreaProvider>
        <Stack initialRouteName="index">
          <Stack.Screen
            name="index"
            options={{
              title: "Home",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="chooseLogin"
            options={{
              title: "Choose Login",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="student/login"
            options={{
              title: "Log In",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="student/(drawer)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="teacher/(drawer)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="admin/(drawer)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="student/(screens)/messages"
            options={{
              headerShown: true,
              headerShadowVisible: false,
              headerTransparent: true,
              headerTitleStyle: {
                fontFamily: "Urbanist",
              },
              headerStyle: {
                backgroundColor: "#fff",
              },
              contentStyle: {
                backgroundColor: "#fff",
              },
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="student/(screens)/notifications"
            options={{
              headerShown: true,
              headerShadowVisible: false,
              headerTransparent: true,
              headerTitleStyle: {
                fontFamily: "Urbanist",
              },
              headerStyle: {
                backgroundColor: "#fff",
              },
              contentStyle: {
                backgroundColor: "#fff",
              },
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="student/(screens)/attendance/attendance"
            options={{
              title: "Attendance",
              headerShown: true,
              headerShadowVisible: false,
              headerTransparent: true,
              headerTitleStyle: {
                fontFamily: "Urbanist",
              },
              headerStyle: {
                backgroundColor: "#fff",
              },
              contentStyle: {
                backgroundColor: "#fff",
              },
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="student/(screens)/liveClasses"
            options={{
              headerShown: true,
              headerTitleStyle: {
                fontFamily: "Urbanist",
              },
              headerStyle: {
                backgroundColor: "#fff",
              },
              contentStyle: {
                backgroundColor: "#fff",
              },
              animation: "slide_from_right",
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="student/(screens)/Class/[liveClassFullScreen]"
            options={{
              headerShown: true,
              headerTitleStyle: {
                fontFamily: "Urbanist",
              },
              headerStyle: {
                backgroundColor: "#fff",
              },
              contentStyle: {
                backgroundColor: "#fff",
              },
              animation: "slide_from_right",
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="student/(screens)/Exams/[questionid]"
            options={{
              headerShown: false,
              headerTitleStyle: {
                fontFamily: "Urbanist",
              },
              headerStyle: {
                backgroundColor: "#fff",
              },
              contentStyle: {
                backgroundColor: "#fff",
              },
              animation: "fade_from_bottom",
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="student/(screens)/practiceExam/[practiceId]"
            options={{
              headerShown: false,
              headerTitleStyle: {
                fontFamily: "Urbanist",
              },
              headerStyle: {
                backgroundColor: "#fff",
              },
              contentStyle: {
                backgroundColor: "#fff",
              },
              animation: "fade_from_bottom",
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="student/(screens)/Exams/practiceTests"
            options={{
              headerShown: true,
              title: "Practice Tests",
              headerTitleStyle: {
                fontFamily: "Urbanist",
              },
              headerStyle: {
                backgroundColor: "#fff",
              },
              contentStyle: {
                backgroundColor: "#fff",
              },
              animation: "slide_from_right",
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="student/(screens)/doubt/doubt"
            options={{
              headerShown: true,
              title: "All Doubts",
              headerTitleStyle: {
                fontFamily: "Urbanist",
              },
              headerStyle: {
                backgroundColor: "#fff",
              },
              contentStyle: {
                backgroundColor: "#fff",
              },
              animation: "slide_from_right",
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="student/(screens)/doubt/newDoubt"
            options={{
              headerShown: true,
              title: "Ask a Doubt",
              headerTitleStyle: {
                fontFamily: "Urbanist",
              },
              headerStyle: {
                backgroundColor: "#fff",
              },
              contentStyle: {
                backgroundColor: "#fff",
              },
              animation: "slide_from_right",
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="student/(screens)/Result/[Resultid]"
            options={{
              headerShown: false,
              headerTitleStyle: {
                fontFamily: "Urbanist",
              },
              headerStyle: {
                backgroundColor: "#fff",
              },
              contentStyle: {
                backgroundColor: "#fff",
              },
              animation: "slide_from_right",
              headerShadowVisible: true,
            }}
          />
          <Stack.Screen
            name="admin/(screens)/classManagement"
            options={{
              title: "Class Management",
              headerShown: true,
              headerShadowVisible: false,
              headerTitleStyle: {
                fontFamily: "Urbanist",
              },
              headerStyle: {
                backgroundColor: "#fff",
              },
              contentStyle: {
                backgroundColor: "#fff",
              },
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="admin/(screens)/subjectManagement"
            options={{
              title: "Subjects Management",
              headerShown: true,
              headerShadowVisible: false,
              headerTitleStyle: {
                fontFamily: "Urbanist",
              },
              headerStyle: {
                backgroundColor: "#fff",
              },
              contentStyle: {
                backgroundColor: "#fff",
              },
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="admin/(screens)/bannerManagement"
            options={{
              title: "Banner Management",
              headerShown: true,
              headerShadowVisible: false,
              headerTitleStyle: {
                fontFamily: "Urbanist",
              },
              headerStyle: {
                backgroundColor: "#fff",
              },
              contentStyle: {
                backgroundColor: "#fff",
              },
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="admin/(screens)/studentManagement"
            options={{
              title: "Student Management",
              headerShown: true,
              headerShadowVisible: false,
              // headerTransparent: true,
              headerTitleStyle: {
                fontFamily: "Urbanist",
              },
              headerStyle: {
                backgroundColor: "#fff",
              },
              contentStyle: {
                backgroundColor: "#fff",
              },
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="admin/(screens)/teacherManagement"
            options={{
              title: "Teachers Management",
              headerShown: true,
              headerShadowVisible: false,
              headerTitleStyle: {
                fontFamily: "Urbanist",
              },
              headerStyle: {
                backgroundColor: "#fff",
              },
              contentStyle: {
                backgroundColor: "#fff",
              },
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="parent/login"
            options={{
              title: "Log In",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="parent/(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="teacher/login"
            options={{
              title: "Log In",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="teacher/chooseClass"
            options={{
              title: "Choose Class",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="teacher/(screens)/subject/[subjectId]"
            options={{
              title: "Subject Details",
              headerShown: true,
              headerShadowVisible: false,
              headerTitleStyle: {
                fontFamily: "Urbanist",
              },
              headerStyle: {
                backgroundColor: "#fff",
              },
              contentStyle: {
                backgroundColor: "#fff",
              },
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="teacher/(screens)/studentDoubts"
            options={{
              title: "Student Doubts",
              headerShown: true,
              headerShadowVisible: false,
              headerTitleStyle: {
                fontFamily: "Urbanist",
              },
              headerStyle: {
                backgroundColor: "#fff",
              },
              contentStyle: {
                backgroundColor: "#fff",
              },
              animation: "slide_from_right",
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="student/(screens)/subject/[subjectId]"
            options={{
              title: "Subject Details",
              headerShown: true,
              headerShadowVisible: false,
              headerTitleStyle: {
                fontFamily: "Urbanist",
              },
              headerStyle: {
                backgroundColor: "#fff",
              },
              contentStyle: {
                backgroundColor: "#fff",
              },
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="teacher/(screens)/exam/createNewTest"
            options={{
              title: "Create New Test",
              headerShown: true,
              headerShadowVisible: false,
              headerTitleStyle: {
                fontFamily: "Urbanist",
              },
              headerStyle: {
                backgroundColor: "#fff",
              },
              contentStyle: {
                backgroundColor: "#fff",
              },
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="teacher/(screens)/liveClasses/newLiveClasses"
            options={{
              title: "Create New Live Classes",
              headerShown: true,
              headerShadowVisible: false,
              headerTitleStyle: {
                fontFamily: "Urbanist",
              },
              headerStyle: {
                backgroundColor: "#fff",
              },
              contentStyle: {
                backgroundColor: "#fff",
              },
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="teacher/(screens)/liveClasses/liveClasses"
            options={{
              title: "Live Classes",
              headerShown: true,
              headerShadowVisible: false,
              headerTitleStyle: {
                fontFamily: "Urbanist",
              },
              headerStyle: {
                backgroundColor: "#fff",
              },
              contentStyle: {
                backgroundColor: "#fff",
              },
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="student/(screens)/profile/personalInformation"
            options={{
              title: "Personal Information",
              headerShown: true,
              headerShadowVisible: false,
              headerTitleStyle: {
                fontFamily: "Urbanist",
              },
              headerStyle: {
                backgroundColor: "#fff",
              },
              contentStyle: {
                backgroundColor: "#fff",
              },
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="teacher/(screens)/profile/personalInformation"
            options={{
              title: "Personal Information",
              headerShown: true,
              headerShadowVisible: false,
              headerTitleStyle: {
                fontFamily: "Urbanist",
              },
              headerStyle: {
                backgroundColor: "#f2f2f2",
              },
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="admin/(screens)/profile/personalInformation"
            options={{
              title: "Personal Information",
              headerShown: true,
              headerShadowVisible: false,
              headerTitleStyle: {
                fontFamily: "Urbanist",
              },
              headerStyle: {
                backgroundColor: "#f2f2f2",
              },
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="teacher/(screens)/profile/helpSupport"
            options={{
              title: "Help and Support",
              headerShown: true,
              headerShadowVisible: false,
              headerTitleStyle: {
                fontFamily: "Urbanist",
              },
              headerStyle: {
                backgroundColor: "#f2f2f2",
              },
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="student/(screens)/profile/helpSupport"
            options={{
              title: "Help and Support",
              headerShown: true,
              headerShadowVisible: false,
              headerTitleStyle: {
                fontFamily: "Urbanist",
              },
              headerStyle: {
                backgroundColor: "#fff",
              },
              contentStyle: {
                backgroundColor: "#fff",
              },
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="teacher/(screens)/profile/notification"
            options={{
              title: "Notification",
              headerShown: true,
              headerShadowVisible: false,
              headerTitleStyle: {
                fontFamily: "Urbanist",
              },
              headerStyle: {
                backgroundColor: "#f2f2f2",
              },
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="admin/(screens)/profile/helpSupport"
            options={{
              title: "Help and Support",
              headerShown: true,
              headerShadowVisible: false,
              headerTitleStyle: {
                fontFamily: "Urbanist",
              },
              headerStyle: {
                backgroundColor: "#f2f2f2",
              },
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="admin/(screens)/profile/notification"
            options={{
              title: "Notification",
              headerShown: true,
              headerShadowVisible: false,
              headerTitleStyle: {
                fontFamily: "Urbanist",
              },
              headerStyle: {
                backgroundColor: "#f2f2f2",
              },
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="admin/login"
            options={{
              title: "Log In",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="admin/(screens)/[teacherid]"
            options={{
              title: "Teacher Information",
              headerShown: true,
              headerShadowVisible: false,
              headerTitleStyle: {
                fontFamily: "Urbanist",
              },
              headerStyle: {
                backgroundColor: "#fff",
              },
              contentStyle: {
                backgroundColor: "#fff",
              },
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="admin/(screens)/student/[studentid]"
            options={{
              title: "Student Information",
              headerShown: true,
              headerShadowVisible: false,
              headerTitleStyle: {
                fontFamily: "Urbanist",
              },
              headerStyle: {
                backgroundColor: "#fff",
              },
              contentStyle: {
                backgroundColor: "#fff",
              },
              animation: "slide_from_right",
            }}
          />
        </Stack>
        <StatusBar style="light" />
      </SafeAreaProvider>
    </GluestackUIProvider>
  );
};

export default _layout;
