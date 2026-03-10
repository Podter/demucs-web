import { IconSparkles2 } from "@tabler/icons-react";
import { useState } from "react";

import { SEPARATION_SPEED } from "~/lib/separate/options";
import Rabbit from "../icons/rabbit";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

const ICONS: Record<string, React.FC> = {
  fast: Rabbit,
  high_quality: IconSparkles2,
};

export default function SpeedSelect() {
  const [value, setValue] = useState("high_quality");

  return (
    <>
      <Tabs value={value} onValueChange={setValue}>
        <TabsList>
          {SEPARATION_SPEED.map(({ label, value }) => {
            const Icon = ICONS[value];
            return (
              <TabsTrigger key={value} value={value}>
                <Icon />
                {label}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
      <input
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        name="speed"
        value={value}
        required
        readOnly
      />
    </>
  );
}
