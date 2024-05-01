"use server";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const getUserOrRedirect = async () => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  return user;
};
