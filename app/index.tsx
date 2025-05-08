import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { consolidateQuranData } from "./utils/dataConsolidator"; // adjust if path differs

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    consolidateQuranData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Quran App</Text>
      <Text style={styles.subtitle}>
        Explore the Quran in an interactive and meaningful way. Access Surahs, learn, and grow spiritually.
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push("../(screens)/Home")}>
        <Text style={styles.buttonText}>Go to Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push("../(screens)/SurahScreen")}>
        <Text style={styles.buttonText}>Go to Surah</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push("../(screens)/Settings")}>
        <Text style={styles.buttonText}>Go to Settings</Text>
        
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push("../(screens)/displayProducts")}>
        <Text style={styles.buttonText}>Go to Display Products</Text>
        
      </TouchableOpacity>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    backgroundColor: "#f4f4f9",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 4,
    alignItems: "center", 
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
