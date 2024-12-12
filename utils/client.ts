"use client"
import { toast } from "@/hooks/use-toast";

export function displayErrorToast(message?: string) {
  toast({
    title: "Uh oh! Something went wrong.",
    ...(message ? { description: message } : {}),
  });
}