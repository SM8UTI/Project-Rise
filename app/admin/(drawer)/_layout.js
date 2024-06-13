import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import CustomeDrawerAdminNavContent from "../../../components/drawer/CustomeDrawerAdminNavContent";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={CustomeDrawerAdminNavContent}
        screenOptions={{
          drawerHideStatusBarOnOpen: false,
          headerShown: false,
        }}
      />
    </GestureHandlerRootView>
  );
}
