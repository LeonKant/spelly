"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { SettingsTabs } from "./SettingsTabs";

interface Props {
  username: string;
}

export function ClientSettingsDialog({ username }: Props) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const title = "Settings";
  const description =
    "Make changes to your profile or game settings here. Click save when you're done.";

  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost">Settings</Button>
        </DialogTrigger>
        <DialogContent className="flex h-[75%] max-h-fit flex-col overflow-scroll sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <SettingsTabs username={username} />
          <DialogFooter className="flex flex-row justify-start">
            <DialogClose asChild>
              <Button variant={"ghost"}>Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost">Settings</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="overflow-scroll px-4">
          <SettingsTabs username={username} />
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
