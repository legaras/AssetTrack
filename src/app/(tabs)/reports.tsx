import React from 'react';

import {
  View,
  Text
} from 'react-native';

import Page from '../../components/Page';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';

import { useAssets } from '../../context/AssetContext';

import { COLORS } from '../../constants/theme';

export default function Reports() {
  const { assets } = useAssets();

  const states = [
    'Baik',
    'Perlu Perbaikan',
    'Rusak'
  ].map(condition => ({
    condition,
    count: assets.filter(
      asset => asset.condition === condition
    ).length
  }));

  const categories = [
    ...new Set(assets.map(asset => asset.category))
  ].map(category => ({
    category,
    count: assets.filter(
      asset => asset.category === category
    ).length
  }));

  return (
    <Page>
      <PageHeader
        title="Laporan Aset"
        subtitle="Ringkasan inventaris kantor"
      />

      <View
        style={{
          flexDirection: 'row',
          gap: 12,
          marginBottom: 18
        }}
      >
        <StatCard
          label="Total aset"
          value={assets.length}
          icon="cube-outline"
        />

        <StatCard
          label="Kategori"
          value={categories.length}
          icon="layers-outline"
          color={COLORS.green}
          tint={COLORS.greenBg}
        />
      </View>

      {/* Kondisi aset */}
      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 18,
          padding: 18,
          marginBottom: 15
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: '800',
            color: COLORS.text,
            marginBottom: 18
          }}
        >
          Kondisi Aset
        </Text>

        {states.map(item => (
          <View
            key={item.condition}
            style={{ marginBottom: 17 }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 8
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  color: COLORS.text
                }}
              >
                {item.condition}
              </Text>

              <Text
                style={{
                  fontWeight: '800',
                  color: COLORS.text
                }}
              >
                {item.count}
              </Text>
            </View>

            <View
              style={{
                height: 9,
                borderRadius: 10,
                backgroundColor: COLORS.bg,
                overflow: 'hidden'
              }}
            >
              <View
                style={{
                  height: 9,
                  width: `${
                    assets.length
                      ? (item.count / assets.length) * 100
                      : 0
                  }%`,
                  backgroundColor:
                    item.condition === 'Baik'
                      ? COLORS.green
                      : item.condition === 'Rusak'
                      ? COLORS.red
                      : COLORS.orange
                }}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Kategori */}
      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 18,
          padding: 18
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: '800',
            color: COLORS.text,
            marginBottom: 15
          }}
        >
          Aset Berdasarkan Kategori
        </Text>

        {categories.map(item => (
          <View
            key={item.category}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.border
            }}
          >
            <Text style={{ color: COLORS.muted }}>
              {item.category}
            </Text>

            <Text
              style={{
                fontWeight: '800',
                color: COLORS.text
              }}
            >
              {item.count} aset
            </Text>
          </View>
        ))}
      </View>
    </Page>
  );
}