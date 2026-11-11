import type { AvatarPickerProps } from "@/types/profile";
import { AVATAR_CHOICES } from "../constants";

export function AvatarPicker({ selected }: AvatarPickerProps) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="mb-1.5 text-sm font-bold">Avatar</legend>
      <div className="grid grid-cols-8 gap-1.5">
        {AVATAR_CHOICES.map((emoji) => (
          <label key={emoji} className="cursor-pointer">
            <input
              type="radio"
              name="avatar"
              value={emoji}
              defaultChecked={emoji === selected}
              className="peer sr-only"
            />
            <span className="border-line peer-checked:border-brand peer-checked:bg-brand-soft peer-focus-visible:outline-info flex aspect-square items-center justify-center rounded-xl border-2 text-xl peer-focus-visible:outline-3">
              {emoji}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
