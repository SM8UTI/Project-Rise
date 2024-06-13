import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import CustomDrawerTeacherNavContent from "../../../components/drawer/CustomDrawerTeacherNavContent";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={CustomDrawerTeacherNavContent}
        screenOptions={{
          drawerHideStatusBarOnOpen: false,
          headerShown: false,
        }}
      />
    </GestureHandlerRootView>
  );
}
