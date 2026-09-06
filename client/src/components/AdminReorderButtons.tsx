import { moveSortOrder, moveToPosition } from "@/lib/content";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

type SortableItem = { id: number; sortOrder: number };

/**
 * Reordering controls for an admin list row: up/down arrows for quick,
 * one-step nudges, plus a typed position field for jumping an item straight
 * to a specific spot in long lists (e.g. "95") without clicking an arrow
 * dozens of times. `items` must be the full, currently-sorted list (ascending
 * by sortOrder) so both controls know the list's current shape.
 */
export function AdminReorderButtons<T extends SortableItem>({
  table,
  items,
  item,
  onReordered,
}: {
  table: string;
  items: T[];
  item: T;
  onReordered: () => void;
}) {
  const [isBusy, setIsBusy] = useState(false);
  const index = items.findIndex((candidate) => candidate.id === item.id);
  const isFirst = index <= 0;
  const isLast = index === -1 || index === items.length - 1;
  const currentPosition = index === -1 ? 1 : index + 1;

  const [positionInput, setPositionInput] = useState(String(currentPosition));
  useEffect(() => setPositionInput(String(currentPosition)), [currentPosition]);

  const move = async (direction: "up" | "down") => {
    setIsBusy(true);
    try {
      await moveSortOrder(table, items, item.id, direction);
      onReordered();
    } finally {
      setIsBusy(false);
    }
  };

  const submitPosition = async () => {
    const target = Number(positionInput);
    if (!Number.isFinite(target) || target === currentPosition) {
      setPositionInput(String(currentPosition));
      return;
    }
    setIsBusy(true);
    try {
      await moveToPosition(table, items, item.id, target);
      onReordered();
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="admin-reorder-buttons">
      <button type="button" className="admin-reorder-buttons__btn" disabled={isFirst || isBusy} onClick={() => move("up")} aria-label="Yukarı taşı">
        <ChevronUp size={16} />
      </button>
      <input
        type="number"
        min={1}
        max={items.length || 1}
        className="admin-reorder-buttons__position"
        value={positionInput}
        disabled={isBusy}
        onChange={(event) => setPositionInput(event.target.value)}
        onBlur={submitPosition}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            (event.target as HTMLInputElement).blur();
          }
        }}
        aria-label="Sıra numarası"
        title="Bu sıra numarasına doğrudan taşımak için yazıp Enter'a basın"
      />
      <button type="button" className="admin-reorder-buttons__btn" disabled={isLast || isBusy} onClick={() => move("down")} aria-label="Aşağı taşı">
        <ChevronDown size={16} />
      </button>
    </div>
  );
}
