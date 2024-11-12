import { GoogleMapState } from '@/store/googleMapSlice';
import { PlaceState } from '@/store/placeSlice';

export type Place = {
  id: number;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  google_place_id: string;
  detail_page_url: string;
  thumbnail_url: string;
  rating: number;
  formed_address: string;
};

export type Map = {
  id: number;
  author: User;
  thumbnail_url: string;
  title: string;
  description: string;
  places: Place[];
};

export type MapList = {
  maps: MapItem[];
  totalPages: number;
  currentPage: number;
};

export type CreateMapType = 'MAP' | 'COURSE';

export type BaseMap = {
  title: string;
  thumbnailUrl?: string;
  description: string;
  isPublic: boolean;
  mode: CreateMapType;
};

export type MapItem = {
  id: number;
  title: string;
  description: string;
  pin_count: number;
};

export type User = {
  id: number;
  nickname: string;
  profile_url: string;
};

export type PlaceMarker = {
  placeId: number;
  color: string;
  category: string;
};

export type StoreState = GoogleMapState & PlaceState;
