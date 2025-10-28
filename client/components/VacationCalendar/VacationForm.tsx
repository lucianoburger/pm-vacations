import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";

interface VacationFormProps {
  personName: string;
  year: number;
  onAddVacation: (startDate: Date, endDate: Date) => void;
  people?: Array<{ id: string; name: string; color: string }>;
  selectedPersonId?: string;
}

export function VacationForm({
  personName,
  year,
  onAddVacation,
  people = [],
  selectedPersonId = "",
}: VacationFormProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      setError("End date must be after start date");
      return;
    }

    onAddVacation(start, end);
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Add Vacation
      </h3>

      {people.length > 1 && (
        <div className="mb-4 pb-4 border-b">
          <label className="block text-sm font-medium text-slate-900 mb-2">
            Select Person:
          </label>
          <div className="space-y-2">
            {people.map((person) => (
              <label key={person.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="person"
                  value={person.id}
                  checked={selectedPersonId === person.id}
                  onChange={() => {}}
                  className="w-4 h-4"
                  disabled
                />
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: person.color }}
                  />
                  <span className="text-sm text-slate-900">{person.name}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1">
            Start Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="pl-9 border-slate-300 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1">
            End Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="pl-9 border-slate-300 focus:border-blue-500"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button
          type="submit"
          disabled={!startDate || !endDate}
          className="w-full bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
        >
          Add Vacation
        </Button>
      </form>
    </div>
  );
}
