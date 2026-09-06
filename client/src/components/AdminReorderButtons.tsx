import { moveSortOrder } from "@/lib/content";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

type SortableItem = { id: number; sortOrder: number };

/**
 * Up/down arrows for reordering an item within an admin list. `items` must be
 * the full, currently-sorted list (ascending by sortOrder) so the buttons know
 * which neighbour to swap with. Disabled at the top/bottom edge.
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

  const move = async (direction: "up" | "down") => {
    setIsBusy(true);
    try {
      await moveSortOrder(table, items, item.id, direction);
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
      <button type="button" className="admin-reorder-buttons__btn" disabled={isLast || isBusy} onClick={() => move("down")} aria-label="Aşağı taşı">
        <ChevronDown size={16} />
      </button>
    </div>
  );
}
