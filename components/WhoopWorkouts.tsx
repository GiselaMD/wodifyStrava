import { useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { WHOOP_API_URL } from "@env";

import Colors from "../constants/Colors";
import { MonoText } from "./StyledText";
import { Text, View } from "./Themed";
import { getSecureData, setSecureData } from "../utils/secureStore";
import { fetchWrapper } from "../utils/fetchWrapper";

export const WhoopWorkouts = ({ path }: { path: string }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  const login = async () => {
    try {
      const json = await fetchWrapper.post(`${WHOOP_API_URL}oauth/token`, {
        username: "yourusername",
        password: "yourpassword",
        grant_type: "password",
        issueRefresh: false,
      });
      console.log("json", json);
      const userId = json.user.id;
      const accessToken = json.access_token;

      await setSecureData("access_token", accessToken);
      const token = await getSecureData("access_token");
      console.log(token);
      await setSecureData("userId", userId);

      setData(accessToken);
    } catch (error) {
      console.error(error);
    } finally {
      setLoggedIn(true);
      setLoading(false);
    }
  };

  const getWorkouts = async () => {
    try {
      const currentDateTime = new Date();
      let startOfDay = new Date(currentDateTime.getTime());
      startOfDay.setUTCHours(0, 0, 0, 0);

      const id = await getSecureData("userId");

      const json = await fetchWrapper.get(
        `${WHOOP_API_URL}activities-service/v1/cycles/aggregate/range/${id}?apiVersion=7&endTime=${currentDateTime.toISOString()}&startTime=${startOfDay.toISOString()}`
      );
      const { records } = json;
      console.log("records", records);
      const [currentRecord] = records.filter(
        (record: any) =>
          new Date(record.cycle.created_at).getDay() ===
          currentDateTime.getDay()
      );
      console.log("currentRecord", currentRecord);
    } catch (error) {
      console.error(error);
    } finally {
      setLoggedIn(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    login();
  }, []);

  useEffect(() => {
    if (loggedIn) {
      getWorkouts();
    }
  }, [loggedIn]);

  return (
    <View>
      <View style={styles.getStartedContainer}>
        <Text
          style={styles.getStartedText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)"
        >
          Whoop workouts:
        </Text>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          // <FlatList
          //   data={data}
          //   keyExtractor={({ id }, index) => id}
          //   renderItem={({ item }: any) => (
          //     <Text>
          //       {item.title}, {item.releaseYear}
          //     </Text>
          //   )}
          // />
          <Text>{data}</Text>
        )}
      </View>

      <View style={styles.helpContainer}>
        <TouchableOpacity onPress={handleHelpPress} style={styles.helpLink}>
          <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
            Tap here if your app doesn't automatically update after making
            changes
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    "https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet"
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: "center",
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: "center",
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: "center",
  },
});
