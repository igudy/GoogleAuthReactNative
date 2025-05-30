import { Image, SafeAreaView, Text, TouchableOpacity } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import Constants from "expo-constants";
import { useEffect } from "react";

WebBrowser.maybeCompleteAuthSession();

interface MyExtra {
  googleExpoClientId: string;
  googleIosClientId: string;
  googleAndroidClientId: string;
  googleWebClientId: string;
  backendUrl: string;
}

const extra = Constants.expoConfig?.extra as MyExtra;

const googleWebClientId =
  "290469306817-8quvl66g4htmfufc015b1b8i1mu46c6g.apps.googleusercontent.com";
const iosClientId =
  "290469306817-mboacdtpv5mg9letg7htedbq74jan1bm.apps.googleusercontent.com";
const androidClientId =
  "290469306817-ui4c2dnmqn4ullhf5jq7jqq0vdud3o61.apps.googleusercontent.com";

export default function HomeScreen() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    //     // clientId: extra.googleExpoClientId,
    //     // iosClientId: extra.googleIosClientId,
    //     // androidClientId: extra.googleAndroidClientId,
    //     // webClientId: extra.googleWebClientId,

    clientId: googleWebClientId,
    iosClientId: iosClientId,
    androidClientId: androidClientId,
    webClientId: googleWebClientId,
  });

  const getUserProfile = async (token: string) => {
    try {
      const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await res.json();
      console.log("User profile:", user);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  useEffect(() => {
    if (response?.type === "success") {
      const token = response.authentication?.accessToken;
      if (token) {
        console.log("Access Token:", token);
        getUserProfile(token);
      }
    }
  }, [response]);

  return (
    <SafeAreaView className="flex-1 justify-center items-center px-4 bg-white">
      <TouchableOpacity
        className="border border-gray-300 rounded-lg p-3 flex-row items-center justify-center"
        onPress={() => promptAsync()}
        disabled={!request}
      >
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png",
          }}
          style={{ width: 20, height: 20, marginRight: 8 }}
        />
        <Text className="text-gray-700">Continue with Google</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
