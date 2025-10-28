import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";

interface VacationFormProps {
  personName: string;
  personColor?: string;
  year: number;
  onAddVacation: (
    startDate: Date,
    endDate: Date,
    status: "Confirmed" | "Tentative"
  ) => void;
}

export function VacationForm({
  personName,
  personColor = "#000000",
  year,
  onAddVacation,
}: VacationFormProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<"Confirmed" | "Tentative">("Confirmed");
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
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        Add Vacation
      </h3>
      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm font-medium text-slate-900">For:</span>
        <span
          className="font-bold text-sm px-3 py-1 rounded text-slate-900"
          style={{ backgroundColor: personColor }}
        >
          {personName}
        </span>
      </div>

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
