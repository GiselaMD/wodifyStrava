// to install it 'expo install expo-secure-store'

import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const setSecureData = (path, value) => {
  if (Platform.OS === "web") {
    return localStorage.setItem(path, value);
  } else {
    return SecureStore.setItemAsync(path, value);
  }
};

export const getSecureData = (path) => {
  if (Platform.OS === "web") {
    return localStorage.getItem(path);
  } else {
    return SecureStore.getItemAsync(path);
  }
};
