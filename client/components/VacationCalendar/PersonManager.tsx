import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

const PREDEFINED_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E2",
];

interface PersonManagerProps {
  onAddPerson: (name: string, color: string) => void;
}

export function PersonManager({ onAddPerson }: PersonManagerProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(PREDEFINED_COLORS[0]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddPerson(name, color);
      setName("");
      setColor(PREDEFINED_COLORS[0]);
      setIsOpen(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Add Team Member
      </h3>
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Person
        </Button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="text"
            placeholder="Enter name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            className="border-slate-300 focus:border-blue-500"
          />

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Color
            </label>
            <div className="flex gap-2 flex-wrap mb-3">
              {PREDEFINED_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-all ${
                    color === c
                      ? "ring-2 ring-slate-900 ring-offset-2"
                      : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-9 rounded cursor-pointer"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              Add
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                setName("");
                setColor(PREDEFINED_COLORS[0]);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
