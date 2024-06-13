import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import CustomDrawerNavContent from "../../../components/drawer/CustomDrawerNavContent";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={CustomDrawerNavContent}
        screenOptions={{
          drawerHideStatusBarOnOpen: false,
          headerShown: false,
        }}
      />
    </GestureHandlerRootView>
  );
}
