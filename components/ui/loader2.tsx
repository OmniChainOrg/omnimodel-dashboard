// components/ui/loader2.tsx
import * as React from "react";
import { Loader2 as LucideLoader2 } from "lucide-react";

export function Loader2(
  props: React.ComponentProps<typeof LucideLoader2>
) {
  return <LucideLoader2 {...props} />;
}
