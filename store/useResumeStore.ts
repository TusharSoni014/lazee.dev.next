import { create } from 'zustand';

interface ResumeStore {
  resumes: any[];
  isInitialized: boolean;
  setResumes: (resumes: any[]) => void;
}

export const useResumeStore = create<ResumeStore>((set) => ({
  resumes: [],
  isInitialized: false,
  setResumes: (resumes) => set({ resumes, isInitialized: true }),
}));
