import {
  View,
  Text,
  Pressable,
  Image
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { router } from 'expo-router';

import Page from '../../components/Page';
import StatCard from '../../components/StatCard';
import AssetCard from '../../components/AssetCard';

import { useAssets } from '../../context/AssetContext';

import { COLORS } from '../../constants/theme';

export default function Dashboard() {
  const { assets, loading } = useAssets();

  const good = assets.filter(
    a => a.condition === 'Baik'
  ).length;

  const bad = assets.filter(
    a => a.condition === 'Rusak'
  ).length;

  const repair = assets.filter(
    a => a.condition === 'Perlu Perbaikan'
  ).length;

  const locations = new Set(
    assets.map(a => a.location)
  ).size;

  return (
    <Page>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 22
        }}
      >
        <Image
          source={require('../../../assets/images/assettrack-logo.png')}
          resizeMode="contain"
          accessibilityLabel="Logo Asset Track"
          style={{ width: 58, height: 58, marginRight: 12 }}
        />
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 26,
              fontWeight: '800',
              color: COLORS.text
            }}
          >
            Asset Track
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: COLORS.muted,
              marginTop: 5
            }}
          >
            Pantau aset kantor dengan mudah
          </Text>
        </View>
      </View>

      <View
        style={{
          backgroundColor: COLORS.navy,
          borderRadius: 22,
          padding: 20,
          marginBottom: 18
        }}
      >
        <Text
          style={{
            color: '#C9D8F0',
            fontSize: 12
          }}
        >
          TOTAL ASET TERDAFTAR
        </Text>

        <Text
          style={{
            color: '#FFFFFF',
            fontSize: 38,
            fontWeight: '800',
            marginTop: 6
          }}
        >
          {loading ? '—' : assets.length}
        </Text>

        <Text
          style={{
            color: '#DCE6F5',
            fontSize: 12,
            marginTop: 4
          }}
        >
          Barang dalam inventaris kantor
        </Text>

        <View
          style={{
            height: 1,
            backgroundColor: '#FFFFFF25',
            marginVertical: 16
          }}
        />

        <Pressable
          onPress={() =>
            router.push('/(tabs)/assets')
          }
          style={{
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Text
            style={{
              color: '#FFFFFF',
              fontWeight: '700'
            }}
          >
            Lihat semua aset
          </Text>

          <Ionicons
            name="arrow-forward"
            size={16}
            color="#FFFFFF"
            style={{ marginLeft: 7 }}
          />
        </Pressable>
      </View>

      <View
        style={{
          flexDirection: 'row',
          gap: 12,
          marginBottom: 12
        }}
      >
        <StatCard
          label="Kondisi baik"
          value={good}
          icon="checkmark-circle-outline"
          color={COLORS.green}
          tint={COLORS.greenBg}
        />

        <StatCard
          label="Rusak"
          value={bad}
          icon="alert-circle-outline"
          color={COLORS.red}
          tint={COLORS.redBg}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          gap: 12,
          marginBottom: 24
        }}
      >
        <StatCard
          label="Perlu perbaikan"
          value={repair}
          icon="construct-outline"
          color={COLORS.orange}
          tint={COLORS.orangeBg}
        />

        <StatCard
          label="Total lokasi"
          value={locations}
          icon="location-outline"
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 13
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: '800',
            color: COLORS.text
          }}
        >
          Aset terbaru
        </Text>

        <Pressable
          onPress={() =>
            router.push('/(tabs)/assets')
          }
        >
          <Text
            style={{
              color: COLORS.primary,
              fontWeight: '700'
            }}
          >
            Lihat semua
          </Text>
        </Pressable>
      </View>

      {assets.slice(0, 4).map(asset => (
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
      ))}
    </Page>
  );
}