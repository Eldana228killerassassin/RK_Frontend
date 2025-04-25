import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform, ViewStyle, TextStyle, Linking, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { CameraView, Camera } from 'expo-camera';

export default function QRScannerScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannedData, setScannedData] = useState<string | null>(null);

  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    requestPermission();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScannedData(data);
    // Проверяем, является ли data валидным URL
    if (data && (data.startsWith('http://') || data.startsWith('https://'))) {
      try {
        await Linking.openURL(data); // Автоматически открываем ссылку
      } catch (error) {
        console.log('Failed to open URL:', error);
      }
    }
  };

  const openLink = async () => {
    if (scannedData) {
      try {
        await Linking.openURL(scannedData); // Открываем ссылку при нажатии на кнопку
      } catch (error) {
        console.log('Failed to open URL:', error);
      }
    }
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'QR Code Scanner' }} />
        <Text style={styles.errorText}>QR Code scanning is not supported on web.</Text>
        <Text style={styles.errorText}>Please use the app on a mobile device.</Text>
      </View>
    );
  }

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'QR Code Scanner' }} />
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'QR Code Scanner' }} />
        <Text>Camera permission denied</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'QR Code Scanner' }} />
      <CameraView
        style={StyleSheet.absoluteFill}
        onBarcodeScanned={scannedData ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      />
      {scannedData && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Scanned: {scannedData}</Text>
          <Pressable style={styles.button} onPress={openLink}>
            <Text style={styles.buttonText}>Open Link</Text>
          </Pressable>
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
  } as ViewStyle,
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  } as TextStyle,
  resultContainer: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  } as ViewStyle,
  resultText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  } as TextStyle,
  button: {
    backgroundColor: '#ffd33d',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  } as ViewStyle,
  buttonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  } as TextStyle,
});