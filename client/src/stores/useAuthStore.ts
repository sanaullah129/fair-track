import { create } from 'zustand';

const authStore = create((set) => ({
    userData: null,
    setUserData: (data: any) => set({ userData: data }),
}));

export default authStore;