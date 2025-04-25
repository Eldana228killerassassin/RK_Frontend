import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { Stack } from 'expo-router';

export default function About() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'About' }} />
      <Text style={styles.title}>Что за проект</Text>
      <Text style={styles.description}>
        StickerSmash — это приложение для создания и сканирования QR-кодов, а также работы с фото и стикерами. Вы можете сгенерировать QR-код для любого URL, отсканировать QR-код, чтобы открыть ссылку, или добавить стикеры на свои фотографии.
      </Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  } as TextStyle,
  description: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  } as TextStyle,
});