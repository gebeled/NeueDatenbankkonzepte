  "use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

  

  export function RoutensucheCheckboxFilter({ className, text, checked = false, onChange, ...props }: { className?: string, text?: string, checked?: boolean, onChange?: (checked: boolean) => void }) {

    return (
        <div className={cn("flex items-center space-x-2", className)} {...props}>
          <Checkbox id={text} checked={checked} onCheckedChange={onChange} />
          <Label htmlFor={text}>{text}</Label>
        </div>
    )
  }