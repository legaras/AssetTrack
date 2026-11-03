import React from 'react';

import {
  View,
  Text,
  Image,
  Pressable
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import type { Asset } from '../types/asset';

import { COLORS, SHADOW } from '../constants/theme';

export default function AssetCard({
  asset,
  onPress
}: {
  asset: Asset;
  onPress: () => void;
}) {
  const color =
    asset.condition === 'Baik'
      ? COLORS.green
      : asset.condition === 'Rusak'
      ? COLORS.red
      : COLORS.orange;

  const tint =
    asset.condition === 'Baik'
      ? COLORS.greenBg
      : asset.condition === 'Rusak'
      ? COLORS.redBg
      : COLORS.orangeBg;

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 13,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        ...SHADOW
      }}
    >
      {asset.image ? (
        <Image
          source={{ uri: asset.image }}
          style={{
            width: 76,
            height: 76,
            borderRadius: 14
          }}
        />
      ) : (
        <View
          style={{
            width: 76,
            height: 76,
            borderRadius: 14,
            backgroundColor: COLORS.blueBg,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Ionicons
            name="cube-outline"
            size={30}
            color={COLORS.primary}
          />
        </View>
      )}

      <View
        style={{
          flex: 1,
          marginLeft: 13
        }}
      >
        <Text
          numberOfLines={1}
          style={{
            fontSize: 15,
            fontWeight: '800',
            color: COLORS.text
          }}
        >
          {asset.name}
        </Text>

        <Text
          style={{
            fontSize: 11,
            color: COLORS.muted,
            marginTop: 4
          }}
        >
          {asset.id} • {asset.category}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 7
          }}
        >
          <Ionicons
            name="location-outline"
            size={13}
            color={COLORS.muted}
          />

          <Text
            numberOfLines={1}
            style={{
              fontSize: 12,
              color: COLORS.muted,
              marginLeft: 3,
              flex: 1
            }}
          >
            {asset.location}
          </Text>
        </View>

        <View
          style={{
            alignSelf: 'flex-start',
            backgroundColor: tint,
            borderRadius: 20,
            paddingHorizontal: 9,
            paddingVertical: 4,
            marginTop: 7
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: '700',
              color
            }}
          >
            {asset.condition}
          </Text>
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={COLORS.muted}
      />
    </Pressable>
  );
}