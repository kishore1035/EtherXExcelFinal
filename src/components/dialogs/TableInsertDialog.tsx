import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

interface TableInsertDialogProps {
  open: boolean;
  onClose: () => void;
  onInsert: (columns: number, rows: number) => void;
}

export function TableInsertDialog({ open, onClose, onInsert }: TableInsertDialogProps) {
  const [columns, setColumns] = useState(3);
  const [rows, setRows] = useState(5);

  console.log('TableInsertDialog render:', { open, columns, rows });

  const handleInsert = () => {
    if (columns > 0 && rows > 0) {
      onInsert(columns, rows);
      onClose();
    }
  };

  const handleCancel = () => {
    // Reset to defaults
    setColumns(3);
    setRows(5);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Insert Table</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="columns" className="text-right">
              Columns
            </Label>
            <Input
              id="columns"
              type="number"
              min="1"
              max="26"
              value={columns}
              onChange={(e) => setColumns(Math.max(1, Math.min(26, parseInt(e.target.value) || 1)))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rows" className="text-right">
              Rows
            </Label>
            <Input
              id="rows"
              type="number"
              min="1"
              max="100"
              value={rows}
              onChange={(e) => setRows(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleInsert}>
            Insert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
