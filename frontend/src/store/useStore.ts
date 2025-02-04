import { create } from 'zustand';
import { StoreState } from '@/types';
import { createGoogleMapSlice } from '@/store/googleMapSlice';
import { createPlaceSlice } from '@/store/placeSlice';
import { createToastSlice } from './toastSlice';
import { createAuthSlice } from './userSlice';

export const useStore = create<StoreState>()((...a) => ({
  ...createGoogleMapSlice(...a),
  ...createPlaceSlice(...a),
  ...createToastSlice(...a),
  ...createAuthSlice(...a),
}));
