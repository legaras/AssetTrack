import React from 'react';

import {
  Alert,
  Pressable,
  View,
  Text
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';

import { COLORS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { router } from 'expo-router';

export default function Settings() {
  const { email, signOut } = useAuth();

  const leave = async () => {
    try {
      await signOut();
      router.replace('/');
    } catch {
      Alert.alert('Tidak dapat keluar', 'Sesi login belum dapat dihapus. Coba lagi.');
    }
  };

  const rows = [
    {
      icon: 'person-outline' as const,
      label: 'Profil pengguna',
      detail: 'Informasi administrator'
    },
    {
      icon: 'shield-checkmark-outline' as const,
      label: 'Keamanan',
      detail: 'Pengaturan akses aplikasi'
    },
    {
      icon: 'server-outline' as const,
      label: 'Penyimpanan data',
      detail: 'Akun dan aset tersimpan lokal'
    },
    {
      icon: 'information-circle-outline' as const,
      label: 'Tentang aplikasi',
      detail: 'Asset Track • Expo SDK 58'
    }
  ];

  return (
    <Page>
      <PageHeader
        title="Pengaturan"
        subtitle="Informasi aplikasi dan akun"
      />

      {/* Profile */}
      <View
        style={{
          backgroundColor: COLORS.navy,
          borderRadius: 20,
          padding: 20,
          alignItems: 'center',
          marginBottom: 20
        }}
      >
        <View
          style={{
            width: 65,
            height: 65,
            borderRadius: 22,
            backgroundColor: '#FFFFFF20',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Ionicons name="business-outline" size={31} color="#FFFFFF" />
        </View>

        <Text
          style={{
            fontSize: 18,
            fontWeight: '800',
            color: '#FFFFFF',
            marginTop: 12
          }}
        >
          Administrator
        </Text>

        <Text
          style={{
            fontSize: 12,
            color: '#D4E0F2',
            marginTop: 4
          }}
        >
          {email || 'Asset Track • Office Inventory'}
        </Text>
      </View>

      {/* Settings List */}
      {rows.map(item => (
        <View
          key={item.label}
          style={{
            backgroundColor: '#FFFFFF',
            padding: 16,
            borderRadius: 14,
            marginBottom: 10,
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: COLORS.blueBg,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Ionicons
              name={item.icon}
              size={19}
              color={COLORS.primary}
            />
          </View>

          <View
            style={{
              marginLeft: 12,
              flex: 1
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: '700',
                color: COLORS.text
              }}
            >
              {item.label}
            </Text>

            <Text
              style={{
                fontSize: 11,
                color: COLORS.muted,
                marginTop: 3
              }}
            >
              {item.detail}
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={17}
            color={COLORS.muted}
          />
        </View>
      ))}

      <Pressable
        accessibilityRole="button"
        onPress={() => void leave()}
        style={{
          backgroundColor: '#FFFFFF',
          borderWidth: 1,
          borderColor: COLORS.redBg,
          padding: 16,
          borderRadius: 14,
          marginTop: 8,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Ionicons name="log-out-outline" size={18} color={COLORS.red} />
        <Text
          style={{
            color: COLORS.red,
            fontSize: 14,
            fontWeight: '700',
            marginLeft: 9
          }}
        >
          Keluar dari akun
        </Text>
      </Pressable>
    </Page>
  );
}