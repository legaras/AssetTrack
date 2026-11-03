export type AssetCondition =
  | 'Baik'
  | 'Perlu Perbaikan'
  | 'Rusak';

export type Asset = {
  id: string;
  name: string;
  category: string;
  location: string;
  date: string;
  condition: AssetCondition;
  note: string;
  image: string | null;
};