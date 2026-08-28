import { trpc } from "@/lib/trpc";

export function useAuth() {
  const meQuery = trpc.auth.me.useQuery();

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      meQuery.refetch();
    },
  });

  return {
    loading: meQuery.isLoading,
    user: meQuery.data ?? null,
    logout: logoutMutation.mutateAsync,
  };
}
