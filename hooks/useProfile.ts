import { useQuery } from "@tanstack/react-query";

export function useProfile(initialData?: any) {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch("/api/profile");
      if (!res.ok) {
        throw new Error("Failed to fetch profile");
      }
      return res.json();
    },
    initialData,
    staleTime: 60 * 1000, // Cache for at least 1 minute to optimize reload
  });
}

export function useProfileStatus(
  initialData?: {
    membership: string;
    credits: number;
    dodoCustomerId?: string | null;
  },
  options?: {
    enabled?: boolean;
  }
) {
  return useQuery({
    queryKey: ["profileStatus"],
    queryFn: async () => {
      const res = await fetch("/api/profile/status");
      if (!res.ok) {
        throw new Error("Failed to fetch profile status");
      }
      return res.json();
    },
    initialData,
    staleTime: 0, // Fetch status directly on mount/refresh
    refetchInterval: 120 * 1000, // Refetch every 120 seconds (2 minutes)
    refetchIntervalInBackground: false, // Only refetch when active
    enabled: options?.enabled ?? true,
  });
}
