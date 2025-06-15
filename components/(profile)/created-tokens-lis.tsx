import { CreatedToken, useUserCreatedTokens } from '@/hooks/user/use-user-created-tokens'
import { Image, ScrollView, TouchableOpacity, View } from 'react-native'
import { ActivityIndicator, Text } from 'react-native'
import EmptyMessage from '../common/empty-message'
import { FunButton } from '../ui'
import { router } from 'expo-router'
import { customHaptics } from '@/utils'

interface CreatedTokensListProps {
  onPressToken?: (token: CreatedToken) => void
}

const CreatedTokensList: React.FC<CreatedTokensListProps> = ({ onPressToken }) => {
  const { data: tokens, isLoading, error } = useUserCreatedTokens()

  if (isLoading) {
    return <ActivityIndicator />
  }

  if (error) {
    return <Text>Error loading your tokens</Text>
  }

  if (!tokens?.length) {
    return (
      <View className="">
        <EmptyMessage>You haven't created any tokens yet</EmptyMessage>

        <FunButton
          variant="orange"
          classList="mt-4"
          onPress={() => {
            customHaptics.tap()
            router.push('/(auth)/(tabs)/add')
          }}
        >
          Create your first coin
        </FunButton>
      </View>
    )
  }

  return (
    <View style={{}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {tokens.map((token) => (
          <TouchableOpacity
            key={token.id}
            onPress={() => onPressToken?.(token)}
            className="p-4 mb-2 bg-white rounded-lg shadow"
          >
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                {token.image_url && <Image source={{ uri: token.image_url }} className="w-12 h-12 mr-3 rounded-full" />}
                <View>
                  <Text className="text-xl font-bold">{token.name}</Text>
                  <Text className="text-gray-600">{token.symbol}</Text>
                </View>
              </View>

              <View className="items-end">
                <Text className="font-semibold">{token.progress_percentage.toFixed(1)}%</Text>
                <Text className="text-sm text-gray-500">funded</Text>
              </View>
            </View>

            {/* Progress and stats */}
            <View className="mb-3">
              <View className="h-2 overflow-hidden bg-gray-200 rounded-full">
                <View
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${Math.min(token.progress_percentage, 100)}%`,
                  }}
                />
              </View>
              <Text className="mt-1 text-sm text-gray-600">
                {token.accummulated_fund.toFixed(2)} / {token.graduation_target} SOL
              </Text>
            </View>

            {/* Additional metrics */}
            <View className="flex-row justify-between pt-2 border-t border-gray-200">
              <View>
                <Text className="text-sm text-gray-500">24h Volume</Text>
                <Text className="font-semibold">{token.volume_24h.toFixed(2)} SOL</Text>
              </View>
              <View>
                <Text className="text-sm text-gray-500">Created</Text>
                <Text className="font-semibold">{new Date(token.created_at).toLocaleDateString()}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

export default CreatedTokensList
