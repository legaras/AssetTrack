import React from 'react';

import {
  View,
  Text
} from 'react-native';

import { COLORS } from '../constants/theme';

export default function PageHeader({
  title,
  subtitle
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={{ marginBottom: 22 }}>
      <Text
        style={{
          fontSize: 26,
          fontWeight: '800',
          color: COLORS.text
        }}
      >
        {title}
      </Text>

      {!!subtitle && (
        <Text
          style={{
            fontSize: 13,
            color: COLORS.muted,
            marginTop: 5
          }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
}