"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DropdownOption {
  value: string;
  label: string;
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder,
  className,
  "aria-label": ariaLabel,
}: {
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  "aria-label"?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-11 w-full min-w-[160px] items-center justify-between gap-2 rounded-xl border border-border",
          "bg-surface px-4 text-sm transition-colors hover:border-accent/40",
        )}
      >
        <span
          className={selected ? "text-foreground" : "text-foreground-muted"}
        >
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-foreground-muted transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-40 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-border bg-surface py-1 shadow-lg"
          >
            {options.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={value === option.value}
              >
                <button
                  type="button"
                  className={cn(
                    "w-full px-4 py-2.5 text-start text-sm transition-colors hover:bg-accent/10",
                    value === option.value &&
                      "bg-accent/10 font-medium text-nav-active",
                  )}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
