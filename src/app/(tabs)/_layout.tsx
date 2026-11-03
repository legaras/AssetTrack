import React from 'react';

import { Redirect, Tabs } from 'expo-router';

import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

const icons: Record<
  string,
  keyof typeof Ionicons.glyphMap
> = {
  dashboard: 'grid-outline',
  assets: 'cube-outline',
  add: 'add-circle-outline',
  reports: 'bar-chart-outline',
  settings: 'settings-outline'
};

export default function TabLayout() {
  const { ready, isAuthenticated } = useAuth();

  if (!ready) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#98A3B3',

        tabBarStyle: {
          height: 66,
          paddingTop: 8,
          paddingBottom: 8,
          borderTopColor: COLORS.border,
          backgroundColor: '#FFFFFF'
        },

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600'
        },

        tabBarIcon: ({ color, size }) => (
          <Ionicons
            name={icons[route.name] || 'ellipse-outline'}
            size={size + 1}
            color={typeof color === 'number' ? COLORS.primary : color ?? COLORS.primary}
          />
        )
      })}
    >
      <Tabs.Screen
        name="dashboard"
        options={{ title: 'Dashboard' }}
      />

      <Tabs.Screen
        name="assets"
        options={{ title: 'Aset' }}
      />

      <Tabs.Screen
        name="add"
        options={{ title: 'Tambah' }}
      />

      <Tabs.Screen
        name="reports"
        options={{ title: 'Laporan' }}
      />

      <Tabs.Screen
        name="settings"
        options={{ title: 'Profil' }}
      />
    </Tabs>
  );
}