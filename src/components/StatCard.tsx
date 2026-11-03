import React from 'react';

import {
  View,
  Text
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  COLORS,
  SHADOW
} from '../constants/theme';

export default function StatCard({
  label,
  value,
  icon,
  color = COLORS.primary,
  tint = COLORS.blueBg
}: {
  label: string;
  value: number;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  tint?: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        minHeight: 112,
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 15,
        ...SHADOW
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 12,
          backgroundColor: tint,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 11
        }}
      >
        <Ionicons
          name={icon}
          size={19}
          color={color}
        />
      </View>

      <Text
        style={{
          fontSize: 23,
          fontWeight: '800',
          color: COLORS.text
        }}
      >
        {value}
      </Text>

      <Text
        style={{
          fontSize: 12,
          color: COLORS.muted,
          marginTop: 3
        }}
      >
        {label}
      </Text>
    </View>
  );
}