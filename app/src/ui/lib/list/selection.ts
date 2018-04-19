export type SelectionDirection = 'up' | 'down'

interface ISelectionEvent {
  /**
   * The direction to move from the current row.
   */
  readonly direction: SelectionDirection

  /**
   * The selected row in the list to use as a starting point.
   */
  readonly row: number
}

/**
 * Determine the next selectable row, given the direction and row.
 *
 * Returns null if no row can be selected.
 */
export function findNextSelectableRow(
  rowCount: number,
  canSelectRow: (row: number) => boolean,
  event: ISelectionEvent
): number | null {
  const { row, direction } = event

  // If the row we're starting from is outside our list, make sure we start
  // walking from _just_ outside the list. We'll also need to walk one more
  // row than we normally would since the first step is just getting us into
  // the list.
  const baseRow = Math.min(Math.max(row, -1), rowCount)
  const startOutsideList = row < 0 || row >= rowCount
  const rowDelta = startOutsideList ? rowCount + 1 : rowCount

  for (let i = 1; i < rowDelta; i++) {
    const delta = direction === 'up' ? i * -1 : i
    // Modulo accounting for negative values, see https://stackoverflow.com/a/4467559
    const nextRow = (baseRow + delta + rowCount) % rowCount

    if (canSelectRow(nextRow)) {
      return nextRow
    }
  }

  return null
}
