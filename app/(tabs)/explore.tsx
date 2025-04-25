import { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ViewStyle, TextStyle } from 'react-native';
import { Stack } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';

export default function ExploreScreen() {
  const [randomQR, setRandomQR] = useState<string | null>(null);

  const sites = [
    { name: 'YouTube', url: 'https://www.youtube.com' },
    { name: 'Wikipedia', url: 'https://www.wikipedia.org' },
    { name: 'Random Fact', url: 'https://uselessfacts.jsph.pl/random.html' },
  ];

  const generateRandomQR = () => {
    const randomSite = sites[Math.floor(Math.random() * sites.length)];
    setRandomQR(randomSite.url);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Explore' }} />
      <Text style={styles.title}>Discover Interesting QR Codes</Text>
      <Pressable style={styles.button} onPress={generateRandomQR}>
        <Text style={styles.buttonText}>Generate Random QR</Text>
      </Pressable>

      {randomQR && (
        <View style={styles.qrContainer}>
          <View style={styles.qrCodeWrapper}>
            <QRCode
              value={randomQR}
              size={200}
              backgroundColor="#FFFFFF"
              color="#000000"
            />
          </View>
          <Text style={styles.qrText}>Scan to visit: {randomQR}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  } as ViewStyle,
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  } as TextStyle,
  button: {
    backgroundColor: '#ffd33d',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 5,
    marginBottom: 20,
  } as ViewStyle,
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  } as TextStyle,
  qrContainer: {
    alignItems: 'center',
  } as ViewStyle,
  qrCodeWrapper: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  } as ViewStyle,
  qrText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  } as TextStyle,
});