import { DATABASE_ID, databases, HABITS_COLLECTION_ID } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ID } from "react-native-appwrite";
import {
  Button,
  SegmentedButtons,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

const FREQUENCIES = ["daily", "weekly", "monthly"];
type Frequency = (typeof FREQUENCIES)[number];

export default function AddHabitScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [freq, setFreq] = useState<Frequency>("daily");
  const [err, setErr] = useState("");
  const { user } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  const handleSubmit = async () => {
    if (!user) return;

    try {
      await databases.createDocument(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        ID.unique(),
        {
          user_id: user.$id,
          title,
          description,
          frequency: freq,
          streak_count: 0,
          last_completed: new Date().toISOString(),
          created_at: new Date().toISOString(),
        }
      );
      router.back();
      setTitle("");
      setDescription("");
    } catch (err) {
      if (err instanceof Error) return setErr(err.message);
      setErr("There was an error creating the habit");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={setTitle}
        label="title"
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        onChangeText={setDescription}
        label="description"
        mode="outlined"
        style={styles.input}
      />
      <View style={styles.freqContainer}>
        <SegmentedButtons
          value={freq}
          onValueChange={(value) => setFreq(value as Frequency)}
          buttons={FREQUENCIES.map((freq) => ({
            value: freq,
            label: freq.charAt(0).toUpperCase() + freq.slice(1, freq.length),
          }))}
        />
      </View>
      <Button
        mode="contained"
        onPress={handleSubmit}
        disabled={!title || !description}
      >
        Add habit
      </Button>
      {err && <Text style={{ color: theme.colors.error }}>{err}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "f5f5f5",
    justifyContent: "center",
  },
  input: {
    marginBottom: 16,
  },
  freqContainer: {
    marginBottom: 24,
  },
});
