import * as SQLite from 'expo-sqlite';

import type { Asset } from '../types/asset';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDatabase() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('asset-track.db');
  }

  return dbPromise;
}

// Membuat tabel database
export async function initializeDatabase() {
  const db = await getDatabase();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS assets (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      location TEXT NOT NULL,
      date TEXT NOT NULL,
      condition TEXT NOT NULL,
      note TEXT NOT NULL DEFAULT '',
      image TEXT
    );
  `);

  // Memeriksa data awal
  const row = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM assets'
  );

  if ((row?.count ?? 0) === 0) {
    const samples: Asset[] = [
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

    for (const asset of samples) {
      await insertAsset(asset);
    }
  }
}

// Mengambil seluruh data aset
export async function getAllAssets(): Promise<Asset[]> {
  const db = await getDatabase();

  return db.getAllAsync<Asset>(
    'SELECT * FROM assets ORDER BY date DESC, id DESC'
  );
}

// Menambahkan aset
export async function insertAsset(asset: Asset) {
  const db = await getDatabase();

  await db.runAsync(
    `INSERT INTO assets
    (id, name, category, location, date, condition, note, image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      asset.id,
      asset.name,
      asset.category,
      asset.location,
      asset.date,
      asset.condition,
      asset.note,
      asset.image
    ]
  );
}

// Menghapus aset
export async function deleteAsset(id: string) {
  const db = await getDatabase();

  await db.runAsync(
    'DELETE FROM assets WHERE id = ?',
    [id]
  );
}