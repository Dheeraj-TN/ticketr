"use client";

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useEffect } from "react";

function SyncUserWithConvex() {
  const { user } = useUser();
  const updateUser = useMutation(api.users.updateUser);
  useEffect(() => {
    if (!user) return;
    const syncUser = async () => {
      try {
        await updateUser({
          userId: user.id,
          name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
          email: user.emailAddresses[0]?.emailAddress ?? "",
        });
      } catch (error) {
        console.error("Failed to sync user with Convex", error);
      }
    };
    syncUser();
  }, [user, updateUser]);
  return <div></div>;
}

export default SyncUserWithConvex;
