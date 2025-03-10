  "use client";

import * as React from "react";
import { useState} from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

  
  
  // Filteroptionen auswählen
  export function RoutensucheCheckboxFilter({ className, text, checked = false, onChange, ...props }: { className?: string, text?: string, checked?: boolean, onChange?: (checked: boolean) => void }) {

    const [isChecked, setIsChecked] = useState(checked);

    const handleChange = () => {
      setIsChecked(!isChecked);
      if (onChange) onChange(!isChecked);
    };

    return (
        <div className={cn("flex items-center space-x-2", className)} {...props}>
          <Checkbox id={text} checked={isChecked} onCheckedChange={handleChange} />
          <Label htmlFor={text}>{text}</Label>
        </div>
    )
  }