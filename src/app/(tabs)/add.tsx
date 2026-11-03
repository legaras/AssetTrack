import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  Image
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import { Ionicons } from '@expo/vector-icons';

import { router } from 'expo-router';

import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';

import { useAssets } from '../../context/AssetContext';

import type {
  Asset,
  AssetCondition
} from '../../types/asset';

import { COLORS } from '../../constants/theme';

function Field({
  label,
  value,
  onChangeText,
  placeholder
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text
        style={{
          fontSize: 12,
          fontWeight: '700',
          color: COLORS.text,
          marginBottom: 7
        }}
      >
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A0A9B6"
        style={{
          backgroundColor: '#FFFFFF',
          borderWidth: 1,
          borderColor: COLORS.border,
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 13,
          fontSize: 14,
          color: COLORS.text
        }}
      />
    </View>
  );
}

function Choice({
  label,
  options,
  value,
  onSelect
}: {
  label: string;
  options: string[];
  value: string;
  onSelect: (v: string) => void;
}) {
  return (
    <View style={{ marginBottom: 15 }}>
      <Text
        style={{
          fontSize: 12,
          fontWeight: '700',
          color: COLORS.text,
          marginBottom: 8
        }}
      >
        {label}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 7
        }}
      >
        {options.map(option => (
          <Pressable
            key={option}
            onPress={() => onSelect(option)}
            style={{
              paddingHorizontal: 13,
              paddingVertical: 10,
              borderRadius: 12,
              backgroundColor:
                value === option
                  ? COLORS.blueBg
                  : '#FFFFFF',
              borderWidth: 1,
              borderColor:
                value === option
                  ? COLORS.primary
                  : COLORS.border
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color:
                  value === option
                    ? COLORS.primary
                    : COLORS.muted
              }}
            >
              {option}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function AddAsset() {
  const { assets, addAsset } = useAssets();

  const [f, setF] = useState({
    id: '',
    name: '',
    category: 'Elektronik',
    location: '',
    date: new Date().toISOString().slice(0, 10),
    condition: 'Baik' as AssetCondition,
    note: '',
    image: null as string | null
  });

  const set = (
    key: keyof typeof f,
    value: string | null
  ) => {
    setF(previous => ({
      ...previous,
      [key]: value
    }));
  };

  // Pilih foto dari galeri
  const photo = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Izin diperlukan',
        'Izinkan akses galeri untuk memilih foto.'
      );
      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.75
      });

    if (!result.canceled) {
      set('image', result.assets[0].uri);
    }
  };

  // Simpan aset
  const save = async () => {
    if (
      !f.id.trim() ||
      !f.name.trim() ||
      !f.location.trim()
    ) {
      Alert.alert(
        'Data belum lengkap',
        'Nomor aset, nama, dan lokasi wajib diisi.'
      );
      return;
    }

    const duplicate = assets.some(
      asset =>
        asset.id.toLowerCase() ===
        f.id.trim().toLowerCase()
    );

    if (duplicate) {
      Alert.alert(
        'Nomor aset sudah digunakan',
        'Masukkan nomor yang berbeda.'
      );
      return;
    }

    try {
      const asset: Asset = {
        ...f,
        id: f.id.trim(),
        name: f.name.trim(),
        location: f.location.trim()
      };

      await addAsset(asset);

      Alert.alert(
        'Berhasil',
        'Aset disimpan ke database perangkat.'
      );

      setF({
        id: '',
        name: '',
        category: 'Elektronik',
        location: '',
        date: new Date().toISOString().slice(0, 10),
        condition: 'Baik',
        note: '',
        image: null
      });

      router.replace('/(tabs)/assets');

    } catch {
      Alert.alert(
        'Gagal',
        'Data tidak dapat disimpan.'
      );
    }
  };

  return (
    <Page>
      <PageHeader
        title="Tambah Aset"
        subtitle="Daftarkan barang inventaris baru"
      />

      {/* Upload Foto */}
      <Pressable
        onPress={photo}
        style={{
          height: 145,
          borderRadius: 18,
          borderWidth: 1,
          borderStyle: 'dashed',
          borderColor: '#AABBDD',
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
          overflow: 'hidden'
        }}
      >
        {f.image ? (
          <Image
            source={{ uri: f.image }}
            style={{
              width: '100%',
              height: '100%'
            }}
          />
        ) : (
          <>
            <Ionicons
              name="camera-outline"
              size={30}
              color={COLORS.primary}
            />

            <Text
              style={{
                fontWeight: '700',
                color: COLORS.primary,
                marginTop: 8
              }}
            >
              Tambah foto aset
            </Text>

            <Text
              style={{
                fontSize: 11,
                color: COLORS.muted,
                marginTop: 4
              }}
            >
              Pilih gambar dari galeri
            </Text>
          </>
        )}
      </Pressable>

      <Field
        label="Nomor aset *"
        value={f.id}
        onChangeText={v => set('id', v)}
        placeholder="Contoh: AT-006"
      />

      <Field
        label="Nama barang *"
        value={f.name}
        onChangeText={v => set('name', v)}
        placeholder="Masukkan nama barang"
      />

      <Choice
        label="Kategori"
        options={[
          'Elektronik',
          'Furniture',
          'Kendaraan',
          'Peralatan',
          'Lainnya'
        ]}
        value={f.category}
        onSelect={v => set('category', v)}
      />

      <Field
        label="Lokasi barang *"
        value={f.location}
        onChangeText={v => set('location', v)}
        placeholder="Contoh: Ruang Administrasi"
      />

      <Field
        label="Tanggal penginputan"
        value={f.date}
        onChangeText={v => set('date', v)}
        placeholder="YYYY-MM-DD"
      />

      <Choice
        label="Kondisi aset"
        options={[
          'Baik',
          'Perlu Perbaikan',
          'Rusak'
        ]}
        value={f.condition}
        onSelect={v => set('condition', v)}
      />

      <Field
        label="Catatan"
        value={f.note}
        onChangeText={v => set('note', v)}
        placeholder="Catatan tambahan (opsional)"
      />

      {/* Tombol Simpan */}
      <Pressable
        onPress={save}
        style={{
          backgroundColor: COLORS.primary,
          borderRadius: 14,
          padding: 16,
          alignItems: 'center',
          marginTop: 5,
          marginBottom: 20
        }}
      >
        <Text
          style={{
            color: '#FFFFFF',
            fontWeight: '800'
          }}
        >
          Simpan Data Aset
        </Text>
      </Pressable>
    </Page>
  );
}