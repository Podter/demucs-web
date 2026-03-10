import { SEPARATION_MODE } from "~/lib/separate/options";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function ModeSelect() {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="mode">Separation Mode</Label>
      <Select
        items={SEPARATION_MODE}
        name="mode"
        defaultValue="2_stems"
        required
      >
        <SelectTrigger className="min-w-88">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {SEPARATION_MODE.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
