import { useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, ViewStyle, TextStyle, ToastAndroid } from 'react-native';
import { Stack } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import type { RefObject } from 'react'; // Импортируем RefObject из 'react'

export default function CreateQRScreen() {
  const [qrInput, setQrInput] = useState<string>('');
  const [qrValue, setQrValue] = useState<string>('');
  const qrCodeRef = useRef<View>(null);

  const isValidQRInput = (input: string) => {
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/;
    const wifiPattern = /^WIFI:S:.+;T:(WPA|WEP|);P:.+;;$/;
    return urlPattern.test(input) || wifiPattern.test(input) || input.length > 0;
  };

  const onGenerateQR = () => {
    if (!qrInput) {
      alert('Please enter a URL or Wi-Fi data');
      return;
    }
    if (!isValidQRInput(qrInput)) {
      alert('Invalid input. Please enter a valid URL or Wi-Fi format.');
      return;
    }
    setQrValue(qrInput);
  };

  const saveQrToDisk = async () => {
    if (!qrValue) {
      alert('No QR code to save!');
      return;
    }
    if (!qrCodeRef.current) {
      alert('QR code reference is not available!');
      return;
    }
    try {
      const localUri = await captureRef(qrCodeRef as RefObject<View>, {
        format: 'png',
        quality: 1,
      });
      await MediaLibrary.saveToLibraryAsync(localUri).catch((e) => {
        console.log('MediaLibrary error:', e);
        alert(`Saved to cache: ${localUri}`);
      });
      ToastAndroid.show('QR Code saved to gallery', ToastAndroid.LONG);
    } catch (e) {
      console.log('Failed to save QR code:', e);
    }
  };

  const shareQRCode = async () => {
    if (!qrValue) {
      alert('No QR code to share!');
      return;
    }
    if (!qrCodeRef.current) {
      alert('QR code reference is not available!');
      return;
    }
    try {
      const localUri = await captureRef(qrCodeRef as RefObject<View>, {
        format: 'png',
        quality: 1,
      });
      await Sharing.shareAsync(localUri, {
        dialogTitle: 'Share QR Code',
      });
    } catch (e) {
      console.log('Failed to share QR code:', e);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Create QR' }} />
      <TextInput
        style={styles.input}
        value={qrInput}
        onChangeText={setQrInput}
        placeholder="Enter URL (e.g., https://example.com)"
        placeholderTextColor="#888"
      />
      <Pressable style={styles.generateButton} onPress={onGenerateQR}>
        <Text style={styles.buttonText}>Generate QR Code</Text>
      </Pressable>

      {qrValue && (
        <View style={styles.qrContainer}>
          <View ref={qrCodeRef} style={styles.qrCodeWrapper} collapsable={false}>
            <QRCode
              value={qrValue}
              size={200}
              backgroundColor="#FFFFFF"
              color="#000000"
            />
          </View>
          <View style={styles.qrActions}>
            <Pressable style={styles.actionButton} onPress={saveQrToDisk}>
              <Text style={styles.buttonText}>Save QR</Text>
            </Pressable>
            <Pressable style={styles.actionButton} onPress={shareQRCode}>
              <Text style={styles.buttonText}>Share QR</Text>
            </Pressable>
          </View>
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
  input: {
    width: '100%',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 20,
    color: '#000',
  } as TextStyle,
  generateButton: {
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
  qrActions: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 20,
  } as ViewStyle,
  actionButton: {
    backgroundColor: '#ffd33d',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  } as ViewStyle,
});