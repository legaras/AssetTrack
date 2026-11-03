import React from 'react';

import {
  View,
  Text,
  Image,
  Pressable,
  Alert
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  Redirect,
  router,
  useLocalSearchParams
} from 'expo-router';

import Page from '../../components/Page';

import { useAssets } from '../../context/AssetContext';
import { useAuth } from '../../context/AuthContext';

import {
  COLORS,
  SHADOW
} from '../../constants/theme';

export default function AssetDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { ready, isAuthenticated } = useAuth();
  const { assets, removeAsset } = useAssets();

  if (!ready) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/" />;
  }

  const asset = assets.find(
    item => item.id === decodeURIComponent(id || '')
  );

  if (!asset) {
    return (
      <Page>
        <Text>Aset tidak ditemukan.</Text>
      </Page>
    );
  }

  const remove = () => {
    Alert.alert(
      'Hapus aset?',
      `Data ${asset.name} akan dihapus.`,
      [
        {
          text: 'Batal',
          style: 'cancel'
        },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            await removeAsset(asset.id);
            router.back();
          }
        }
      ]
    );
  };

  const rows = [
    {
      label: 'Kategori',
      value: asset.category,
      icon: 'pricetag-outline' as const
    },
    {
      label: 'Lokasi barang',
      value: asset.location,
      icon: 'location-outline' as const
    },
    {
      label: 'Tanggal penginputan',
      value: asset.date,
      icon: 'calendar-outline' as const
    },
    {
      label: 'Kondisi',
      value: asset.condition,
      icon: 'shield-checkmark-outline' as const
    },
    {
      label: 'Catatan',
      value: asset.note || '-',
      icon: 'document-text-outline' as const
    }
  ];

  return (
    <Page>
      <Pressable
        onPress={() => router.back()}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 18
        }}
      >
        <Ionicons
          name="arrow-back"
          size={22}
          color={COLORS.text}
        />

        <Text
          style={{
            fontSize: 16,
            fontWeight: '800',
            color: COLORS.text,
            marginLeft: 12
          }}
        >
          Detail Aset
        </Text>
      </Pressable>

      {/* Foto */}
      {asset.image ? (
        <Image
          source={{ uri: asset.image }}
          style={{
            width: '100%',
            height: 210,
            borderRadius: 20,
            marginBottom: 18
          }}
        />
      ) : (
        <View
          style={{
            height: 180,
            borderRadius: 20,
            backgroundColor: COLORS.blueBg,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 18
          }}
        >
          <Ionicons
            name="cube-outline"
            size={65}
            color={COLORS.primary}
          />
        </View>
      )}

      {/* Informasi aset */}
      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 18,
          padding: 18,
          ...SHADOW
        }}
      >
        <Text
          style={{
            fontSize: 21,
            fontWeight: '800',
            color: COLORS.text
          }}
        >
          {asset.name}
        </Text>

        <Text
          style={{
            fontSize: 12,
            color: COLORS.muted,
            marginTop: 5
          }}
        >
          {asset.id}
        </Text>

        {rows.map(row => (
          <View
            key={row.label}
            style={{
              paddingVertical: 14,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.border,
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <Ionicons
              name={row.icon}
              size={18}
              color={COLORS.primary}
            />

            <View
              style={{
                marginLeft: 12,
                flex: 1
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  color: COLORS.muted
                }}
              >
                {row.label}
              </Text>

              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: COLORS.text,
                  marginTop: 4
                }}
              >
                {row.value}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Hapus */}
      <Pressable
        onPress={remove}
        style={{
          padding: 15,
          alignItems: 'center',
          marginTop: 12
        }}
      >
        <Text
          style={{
            color: COLORS.red,
            fontWeight: '700'
          }}
        >
          Hapus Aset
        </Text>
      </Pressable>
    </Page>
  );
}