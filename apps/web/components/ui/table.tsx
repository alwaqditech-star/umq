import { cn } from "@/lib/utils";

export function Table({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border">
      <table className={cn("w-full min-w-[640px] text-sm", className)}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <thead className="border-b border-border bg-table-header text-start">
      {children}
    </thead>
  );
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return (
    <tbody className="divide-y divide-border bg-surface">{children}</tbody>
  );
}

export function TableRow({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <tr className={cn("transition-colors hover:bg-accent/5", className)}>
      {children}
    </tr>
  );
}

export function TableHead({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <th
      className={cn(
        "px-4 py-3 text-start text-xs font-semibold uppercase tracking-wide text-table-header",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function TableCell({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <td className={cn("px-4 py-3 text-foreground", className)}>{children}</td>
  );
}
