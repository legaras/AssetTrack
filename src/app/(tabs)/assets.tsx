import { useMemo, useState } from 'react';

import {
    Pressable,
    Text,
    TextInput,
    View
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import Page from '../../components/Page';
import AssetCard from '../../components/AssetCard';
import PageHeader from '../../components/PageHeader';

import { useAssets } from '../../context/AssetContext';

import { COLORS } from '../../constants/theme';

export default function Assets() {
  const { assets } = useAssets();

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('Semua');

  const filtered = useMemo(() => {
    return assets.filter(asset => {
      const q = query.toLowerCase();

      const matchesSearch =
        asset.name.toLowerCase().includes(q) ||
        asset.id.toLowerCase().includes(q) ||
        asset.location.toLowerCase().includes(q);

      const matchesFilter =
        filter === 'Semua' ||
        asset.condition === filter;

      return matchesSearch && matchesFilter;
    });
  }, [assets, query, filter]);

  return (
    <Page>
      <PageHeader
        title="Data Aset"
        subtitle={`${assets.length} aset terdaftar`}
      />

      {/* Search */}
      <View
        style={{
          height: 48,
          backgroundColor: '#FFFFFF',
          borderRadius: 14,
          borderWidth: 1,
          borderColor: COLORS.border,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 13,
          marginBottom: 14
        }}
      >
        <Ionicons
          name="search-outline"
          size={19}
          color={COLORS.muted}
        />

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Cari nama, nomor, lokasi..."
          placeholderTextColor="#9AA5B4"
          style={{
            flex: 1,
            marginLeft: 9,
            color: COLORS.text
          }}
        />
      </View>

      {/* Filter */}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 17
        }}
      >
        {[
          'Semua',
          'Baik',
          'Perlu Perbaikan',
          'Rusak'
        ].map(item => (
          <Pressable
            key={item}
            onPress={() => setFilter(item)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 9,
              borderRadius: 20,
              backgroundColor:
                filter === item
                  ? COLORS.primary
                  : '#FFFFFF',
              borderWidth: 1,
              borderColor:
                filter === item
                  ? COLORS.primary
                  : COLORS.border
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: '700',
                color:
                  filter === item
                    ? '#FFFFFF'
                    : COLORS.muted
              }}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Asset List */}
      {filtered.length > 0 ? (
        filtered.map(asset => (
          <AssetCard
            key={asset.id}
            asset={asset}
            onPress={() =>
              router.push({
                pathname: '/asset/[id]',
                params: { id: asset.id }
              })
            }
          />
        ))
      ) : (
        <View
          style={{
            alignItems: 'center',
            padding: 35
          }}
        >
          <Ionicons
            name="file-tray-outline"
            size={40}
            color={COLORS.muted}
          />

          <Text
            style={{
              color: COLORS.muted,
              marginTop: 10
            }}
          >
            Aset tidak ditemukan
          </Text>
        </View>
      )}
    </Page>
  );
}