"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { BaseEntity } from "@/lib/api/types";

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
};

export function EntityTable<T extends BaseEntity>({
  title,
  columns,
  rows,
  onCreate,
  onUpdate,
  onDelete,
  createLabel,
  emptyLabel = "No items",
}: {
  title: string;
  columns: Column<T>[];
  rows: T[];
  createLabel: string;
  emptyLabel?: string;
  onCreate?: (data: Record<string, string>) => Promise<void>;
  onUpdate?: (id: string, data: Record<string, string>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const openCreate = () => {
    setEditingId(null);
    setForm({});
    setModalOpen(true);
  };

  const openEdit = (row: T) => {
    setEditingId(row.id);
    setForm({ name: String((row as Record<string, unknown>).name ?? "") });
    setModalOpen(true);
  };

  const submit = async () => {
    setLoading(true);
    try {
      if (editingId && onUpdate) await onUpdate(editingId, form);
      else if (onCreate) await onCreate(form);
      setModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        {onCreate && (
          <Button size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            {createLabel}
          </Button>
        )}
      </div>
      {rows.length === 0 ? (
        <Badge variant="warning">{emptyLabel}</Badge>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key}>{col.header}</TableHead>
              ))}
              {(onUpdate || onDelete) && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                {columns.map((col) => (
                  <TableCell key={col.key}>{col.render(row)}</TableCell>
                ))}
                {(onUpdate || onDelete) && (
                  <TableCell>
                    <div className="flex gap-2">
                      {onUpdate && (
                        <button
                          type="button"
                          onClick={() => openEdit(row)}
                          className="rounded-lg p-2 hover:bg-accent/10"
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(row.id)}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-500/10"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit" : createLabel}
      >
        <Input
          label="Name"
          value={form.name ?? ""}
          onChange={(e) => setForm({ name: e.target.value })}
        />
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button loading={loading} onClick={submit}>
            Save
          </Button>
        </div>
      </Modal>
    </div>
  );
}
