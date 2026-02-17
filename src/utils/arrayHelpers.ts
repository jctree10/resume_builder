
export function nextOrder(items: { order: number }[]): number {
  return items.length === 0 ? 0 : Math.max(...items.map((i) => i.order)) + 1;
}

export function reorder<T extends { order: number }>(
  items: T[],
  id: string,
  direction: -1 | 1,
  getId: (item: T) => string,
): T[] {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex((item) => getId(item) === id);
  if (idx < 0) return items;
  const swapIdx = idx + direction;
  if (swapIdx < 0 || swapIdx >= sorted.length) return items;

  // Check if either item is fixed (for sections)
  const current = sorted[idx] as T & { fixed?: boolean };
  const swap = sorted[swapIdx] as T & { fixed?: boolean };
  if (current.fixed || swap.fixed) return items;

  const tmpOrder = sorted[idx].order;
  sorted[idx] = { ...sorted[idx], order: sorted[swapIdx].order };
  sorted[swapIdx] = { ...sorted[swapIdx], order: tmpOrder };
  return sorted;
}

export function moveItem<T extends { order: number }>(items: T[], oldIndex: number, newIndex: number): T[] {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  const [movedItem] = sorted.splice(oldIndex, 1);
  sorted.splice(newIndex, 0, movedItem);
  
  // Reassign orders
  return sorted.map((item, index) => ({ ...item, order: index }));
}
