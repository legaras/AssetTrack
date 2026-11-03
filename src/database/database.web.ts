import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Asset } from '../types/asset';

const STORAGE_KEY = 'assettrack-assets';

const defaultAssets: Asset[] = [
  {
    id: 'AT-001',
    name: 'MacBook Pro 14"',
    category: 'Elektronik',
    location: 'Ruang Direktur',
    date: '2026-10-12',
    condition: 'Baik',
    note: 'Laptop kerja direktur',
    image: null
  },
  {
    id: 'AT-002',
    name: 'Kursi Ergonomis',
    category: 'Furniture',
    location: 'Ruang Meeting',
    date: '2026-10-15',
    condition: 'Baik',
    note: 'Kursi meeting utama',
    image: null
  },
  {
    id: 'AT-003',
    name: 'Printer Epson L3250',
    category: 'Elektronik',
    location: 'Ruang Administrasi',
    date: '2026-10-18',
    condition: 'Perlu Perbaikan',
    note: 'Hasil cetak kurang jelas',
    image: null
  },
  {
    id: 'AT-004',
    name: 'Proyektor BenQ',
    category: 'Elektronik',
    location: 'Ruang Meeting',
    date: '2026-10-20',
    condition: 'Baik',
    note: 'Proyektor presentasi',
    image: null
  },
  {
    id: 'AT-005',
    name: 'Meja Kerja',
    category: 'Furniture',
    location: 'Ruang Operasional',
    date: '2026-10-22',
    condition: 'Rusak',
    note: 'Kaki meja longgar',
    image: null
  }
];

async function readAssets(): Promise<Asset[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);

  if (!raw) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAssets));
    return defaultAssets;
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultAssets;
  } catch {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAssets));
    return defaultAssets;
  }
}

export async function initializeDatabase() {
  await readAssets();
}

export async function getAllAssets(): Promise<Asset[]> {
  return readAssets();
}

export async function insertAsset(asset: Asset) {
  const current = await readAssets();
  const next = current.some(item => item.id.toLowerCase() === asset.id.toLowerCase())
    ? current.map(item =>
        item.id.toLowerCase() === asset.id.toLowerCase() ? asset : item
      )
    : [asset, ...current];

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export async function deleteAsset(id: string) {
  const current = await readAssets();
  const next = current.filter(item => item.id.toLowerCase() !== id.toLowerCase());

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
