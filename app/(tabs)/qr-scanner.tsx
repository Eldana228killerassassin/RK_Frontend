import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform, ViewStyle, TextStyle, Linking, Pressable, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { CameraView, Camera } from 'expo-camera';

export default function QRScannerScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isScanned, setIsScanned] = useState<boolean>(false); // Флаг для предотвращения повторного сканирования

  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    requestPermission();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (isScanned) return; // Предотвращаем повторное сканирование
    setScannedData(data);
    setIsScanned(true);

    if (data && (data.startsWith('http://') || data.startsWith('https://'))) {
      try {
        const canOpen = await Linking.canOpenURL(data);
        if (canOpen) {
          await Linking.openURL(data);
        } else {
          Alert.alert('Error', 'Cannot open URL on this device.');
        }
      } catch (error) {
        console.log('Failed to open URL:', error);
        Alert.alert('Error', `Failed to open URL: ${data}`);
      }
    }
  };

  const openLink = async () => {
    if (scannedData) {
      try {
        const canOpen = await Linking.canOpenURL(scannedData);
        if (canOpen) {
          await Linking.openURL(scannedData);
        } else {
          Alert.alert('Error', 'Cannot open URL on this device.');
        }
      } catch (error) {
        console.log('Failed to open URL:', error);
        Alert.alert('Error', `Failed to open URL: ${scannedData}`);
      }
    }
  };

  const resetScanner = () => {
    setScannedData(null);
    setIsScanned(false);
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
        onBarcodeScanned={isScanned ? undefined : handleBarCodeScanned}
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
          <Pressable style={styles.button} onPress={resetScanner}>
            <Text style={styles.buttonText}>Scan Again</Text>
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
    marginVertical: 5,
  } as ViewStyle,
  buttonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  } as TextStyle,
});