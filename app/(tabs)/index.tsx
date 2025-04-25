import { View, StyleSheet, Platform, TextInput, ToastAndroid, ViewStyle, TextStyle } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as MediaLibrary from 'expo-media-library';
import { type ImageSource } from 'expo-image';
import { captureRef } from 'react-native-view-shot';
import domtoimage from 'dom-to-image';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Button from '@/components/Button';
import ImageViewer from '@/components/ImageViewer';
import IconButton from '@/components/IconButton';
import CircleButton from '@/components/CircleButton';
import EmojiPicker from '@/components/EmojiPicker';
import EmojiList from '@/components/EmojiList';
import EmojiSticker from '@/components/EmojiSticker';

const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [pickedEmoji, setPickedEmoji] = useState<ImageSource | undefined>(undefined);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const [qrInput, setQrInput] = useState<string>('');
  const [qrValue, setQrValue] = useState<string>('');
  const [qrBgColor, setQrBgColor] = useState<string>('#FFFFFF');
  const [qrFgColor, setQrFgColor] = useState<string>('#000000');
  const [qrSize, setQrSize] = useState<number>(100);
  const imageRef = useRef<View>(null);
  const qrCodeRef = useRef<View>(null);

  if (status === null) {
    requestPermission();
  }

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert('You did not select any image.');
    }
  };

  const onReset = () => {
    setShowAppOptions(false);
    setQrValue('');
  };

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const isValidQRInput = (input: string) => {
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/;
    const wifiPattern = /^WIFI:S:.+;T:(WPA|WEP|);P:.+;;$/;
    return urlPattern.test(input) || wifiPattern.test(input) || input.length > 0;
  };

  const onGenerateQR = () => {
    if (!qrInput) {
      alert('Please enter text for QR code');
      return;
    }
    if (!isValidQRInput(qrInput)) {
      alert('Invalid input. Please enter a valid URL or Wi-Fi format.');
      return;
    }
    setQrValue(qrInput);
  };

  const onSaveImageAsync = async () => {
    try {
      const localUri = await captureRef(imageRef, {
        height: 440,
        quality: 1,
      });
      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) alert('Saved!');
    } catch (e) {
      console.log(e);
    }
  };

  const saveQrToDisk = async () => {
    if (!qrValue) {
      alert('No QR code to save!');
      return;
    }
    try {
      const dataUrl = await domtoimage.toPng(qrCodeRef.current);
      const filePath = `${FileSystem.cacheDirectory}qr-code.png`;
      await FileSystem.writeAsStringAsync(filePath, dataUrl.split(',')[1], {
        encoding: FileSystem.EncodingType.Base64,
      });
      await MediaLibrary.saveToLibraryAsync(filePath).catch((e) => {
        console.log('MediaLibrary error:', e);
        alert(`Saved to cache: ${filePath}`);
      });
      ToastAndroid.show('QR Code saved to gallery', ToastAndroid.LONG);
    } catch (e) {
      console.log(e);
    }
  };

  const shareQRCode = async () => {
    if (!qrValue) {
      alert('No QR code to share!');
      return;
    }
    try {
      const dataUrl = await domtoimage.toPng(qrCodeRef.current);
      const filePath = `${FileSystem.cacheDirectory}qr-code.png`;
      await FileSystem.writeAsStringAsync(filePath, dataUrl.split(',')[1], {
        encoding: FileSystem.EncodingType.Base64,
      });
      await Sharing.shareAsync(filePath, {
        dialogTitle: 'Share QR Code',
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.imageContainer}>
        <View ref={imageRef} collapsable={false}>
          <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
          {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />}
          {qrValue && (
            <View ref={qrCodeRef} style={styles.qrContainer}>
              <QRCode
                value={qrValue}
                size={qrSize}
                backgroundColor={qrBgColor}
                color={qrFgColor}
                logo={require('@/assets/images/emoji1.png')}
                logoSize={30}
                logoBackgroundColor="white"
              />
            </View>
          )}
        </View>
      </View>
      {showAppOptions ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
            <IconButton icon="save" label="Save QR" onPress={saveQrToDisk} />
            <IconButton icon="share" label="Share QR" onPress={shareQRCode} />
          </View>
          <TextInput
            style={styles.qrInput}
            value={qrInput}
            onChangeText={setQrInput}
            placeholder="Enter URL or Wi-Fi (e.g., WIFI:S:MyWiFi;T:WPA;P:password;;)"
          />
          <TextInput
            style={styles.qrInput}
            value={qrBgColor}
            onChangeText={setQrBgColor}
            placeholder="Background color (e.g., #FFFFFF)"
          />
          <TextInput
            style={styles.qrInput}
            value={qrFgColor}
            onChangeText={setQrFgColor}
            placeholder="Foreground color (e.g., #000000)"
          />
          <TextInput
            style={styles.qrInput}
            value={qrSize.toString()}
            onChangeText={(text) => setQrSize(parseInt(text) || 100)}
            placeholder="QR code size (e.g., 100)"
            keyboardType="numeric"
          />
          <Button label="Generate QR" onPress={onGenerateQR} />
        </View>
      ) : (
        <View style={styles.footerContainer}>
          <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
          <Button label="Use this photo" onPress={() => setShowAppOptions(true)} />
        </View>
      )}
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  } as ViewStyle,
  imageContainer: {
    flex: 1,
  } as ViewStyle,
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  } as ViewStyle,
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
  } as ViewStyle,
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  } as ViewStyle,
  qrContainer: {
    position: 'absolute',
    top: 10, // Перемещён в верхний правый угол
    right: 10,
    backgroundColor: '#fff', // Белый фон для контраста
    padding: 5, // Отступы для аккуратного вида
    borderRadius: 5, // Скругленные углы
  } as ViewStyle,
  qrInput: {
    width: 200,
    padding: 10,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  } as TextStyle,
});