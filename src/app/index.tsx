import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';

export default function App() {
  return (
    <View style={styles.container} className='items-center justify-center'>
      <Text className='text-6xl font-bold'>Dolary</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
