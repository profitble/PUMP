import { Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

export default function JsonViewer({ data }: { data: any }) {
  return (
    <View style={{ padding: 10 }}>
      <ScrollView style={{ maxHeight: 200 }}>
        <Text style={{ fontFamily: 'monospace', fontSize: 14 }}>{JSON.stringify(data, null, 2)}</Text>
      </ScrollView>
    </View>
  )
}
