import agent from "@/app/api/agent";
import { useAppDispatch } from "@/app/store/hooks";
import { updateUser } from "@/features/auth/authSlice";
import { pushNotification } from "@/features/notifications/notificationSlice";
import { useMutation } from "@tanstack/react-query";

export function useUpdateUserProfile() {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async ({
      userId,
      body,
    }: {
      userId: string;
      body: Partial<{ firstName: string; lastName: string; phone: string }>;
    }) => {
      const res = await agent.Users.updateUser(userId, body);
      return res.user;
    },
    onSuccess: (data, variables, context) => {
      dispatch(updateUser(data));
      dispatch(
        pushNotification({
          type: "success",
          message: "Uspjesno ste azurirali svoje podatke.",
        })
      );
    },
    onError: () => {
      dispatch(
        pushNotification({
          type: "error",
          message: "Greška prilikom ažuriranja profila.",
        })
      );
    },
  });
}

export function useUpdateUserProfilePicture() {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async ({ userId, file }: { userId: string; file: File }) => {
      const res = await agent.Users.changeUserProfilePicture(userId, file);
      return { ...res.user, profilePicture: res.user.profilePictureUrl };
    },
    onSuccess: (data) => {
      dispatch(updateUser(data));
      dispatch(
        pushNotification({
          type: "success",
          message: "Profilna slika uspješno ažurirana.",
        })
      );
    },
    onError: () => {
      dispatch(
        pushNotification({
          type: "error",
          message: "Profilna slika nije ispravno azurirana",
        })
      );
    },
  });
}
