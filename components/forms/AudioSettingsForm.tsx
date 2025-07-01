"use client";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Slider } from "../ui/slider";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AudioSettingsSchema,
  AudioSettingsSchemaT,
} from "@/lib/form-schemas/AudioSettingsSchema";
import { Button } from "../ui/button";
import { useAudioSettings } from "@/context/AudioSettingsContext";
import { AudioToggle } from "../AudioToggle";
import { useEffect } from "react";

export function AudioSettingsForm() {
  const { mainMusicVolume, sfxVolume, setMainMusicVolume, setSfxVolume } =
    useAudioSettings();

  const formReturn = useForm<AudioSettingsSchemaT>({
    resolver: zodResolver(AudioSettingsSchema.required()),
    mode: "onChange",
    defaultValues: {
      mainMusicVolume,
      sfxVolume,
    },
  });

  useEffect(() => {
    formReturn.reset({ mainMusicVolume, sfxVolume });
  }, [mainMusicVolume, sfxVolume]);

  const onSubmit = (data: AudioSettingsSchemaT) => {
    const { mainMusicVolume, sfxVolume } = data;
    localStorage.setItem("mainMusicVolume", mainMusicVolume.toString());
    localStorage.setItem("sfxVolume", sfxVolume.toString());
    setMainMusicVolume(mainMusicVolume);
    setSfxVolume(sfxVolume);
  };

  const settingsSameAsDefault =
    formReturn.watch().mainMusicVolume === mainMusicVolume &&
    formReturn.watch().sfxVolume === sfxVolume;

  return (
    <Form {...formReturn}>
      <form onSubmit={formReturn.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={formReturn.control}
          name="mainMusicVolume"
          render={({ field }) => (
            <FormItem className="gap-4">
              <FormLabel>Main Music Volume</FormLabel>
              {formReturn.watch().mainMusicVolume}
              <FormControl>
                <Slider
                  onValueChange={(v) => {
                    field.onChange(v[0]);
                  }}
                  value={[field.value]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={formReturn.control}
          name="sfxVolume"
          render={({ field }) => (
            <FormItem className="gap-4">
              <FormLabel>SFX Volume</FormLabel>
              {formReturn.watch().sfxVolume}
              <FormControl>
                <Slider
                  onValueChange={(v) => {
                    field.onChange(v[0]);
                  }}
                  value={[field.value]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <AudioToggle />
        </div>
        <Button type="submit" disabled={settingsSameAsDefault}>
          Save
        </Button>
      </form>
    </Form>
  );
}
