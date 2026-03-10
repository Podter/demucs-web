import type { Option } from "~/lib/separate/options";
import { SEPARATION_MODE, SEPARATION_SPEED } from "~/lib/separate/options";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface SelectOptionsProps {
  options: Option[];
  className?: string;
}

function SelectOptions({ options, className }: SelectOptionsProps) {
  return (
    <Select items={options}>
      <SelectTrigger className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default function Options() {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Separation Mode</Label>
        <SelectOptions options={SEPARATION_MODE} className="min-w-88" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Separation Mode</Label>
        <SelectOptions options={SEPARATION_SPEED} className="min-w-88" />
      </div>
    </div>
  );
}
