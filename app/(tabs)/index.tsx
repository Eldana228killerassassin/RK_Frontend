import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { Stack } from 'expo-router';

export default function Index() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Home' }} />
      <Text style={styles.text}>Главная страница</Text>
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
  text: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  } as TextStyle,
});