import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform, ViewStyle, TextStyle } from 'react-native';
import { Stack } from 'expo-router';
import { CameraView, Camera } from 'expo-camera'; // Изменён импорт: добавлен CameraView

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

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScannedData(data);
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
        onBarcodeScanned={scannedData ? undefined : handleBarCodeScanned} // Изменено: onBarCodeScanned → onBarcodeScanned
        barcodeScannerSettings={{
          barcodeTypes: ['qr'], // Изменено: barCodeTypes → barcodeTypes
        }}
      />
      {scannedData && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Scanned: {scannedData}</Text>
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
  } as ViewStyle,
  resultText: {
    color: '#fff',
    fontSize: 16,
  } as TextStyle,
});