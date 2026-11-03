import React from 'react';

import {
  ScrollView,
  View,
  type ViewStyle
} from 'react-native';

import { COLORS } from '../constants/theme';

export default function Page({
  children,
  contentStyle
}: {
  children: React.ReactNode;
  contentStyle?: ViewStyle;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.bg
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          {
            padding: 20,
            paddingBottom: 36
          },
          contentStyle
        ]}
      >
        {children}
      </ScrollView>
    </View>
  );
}