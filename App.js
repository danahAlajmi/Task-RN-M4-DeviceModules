import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as Network from "expo-network";

export default function App() {
  const [image, setImage] = useState(
    "https://cdn.sick.com/media/ZOOM/2/82/782/IM0077782.png"
  );
  const [pick, setPick] = useState("Pick an image");

  const handleOcr = async () => {
    let conn = await Network.getNetworkStateAsync();
    if (!conn.isConnected) {
      setPick("No Connection.");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      setPick("Done!");

      const task = FileSystem.createUploadTask(
        "http://172.20.10.28000/upload",
        result.uri,
        {
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: "photo",
        },
        (data) => {
          console.log({ data });
        }
      );
      let body = task.uploadAsync().then((x) => {
        console.log({ x });
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text>Welcome User :D</Text>
      <Text>{pick}</Text>
      <Button title="Click here" onPress={handleOcr} />
      <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card_template: {
    width: 250,
    height: 250,
    boxShadow: "10px 10px 17px -12px rgba(0,0,0,0.75)",
  },
  card_image: {
    width: 250,
    height: 250,
    borderRadius: 10,
  },
  text_container: {
    position: "absolute",
    width: 250,
    height: 30,
    bottom: 0,
    padding: 5,
    backgroundColor: "rgba(0,0,0, 0.3)",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  card_title: {
    color: "white",
    textAlign: "center",
  },
});
