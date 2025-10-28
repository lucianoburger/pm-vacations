import { useState } from "react";
import { CalendarView } from "./CalendarView";
import { PersonManager } from "./PersonManager";
import { VacationForm } from "./VacationForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Person {
  id: string;
  name: string;
  color: string;
}

export interface VacationPeriod {
  id: string;
  personId: string;
  startDate: Date;
  endDate: Date;
  status: "Confirmed" | "Tentative";
}

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E2",
];

export function VacationCalendar() {
  const [year, setYear] = useState(2026);
  const [people, setPeople] = useState<Person[]>([]);
  const [vacations, setVacations] = useState<VacationPeriod[]>([]);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [expandedPersonId, setExpandedPersonId] = useState<string | null>(null);
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [personToDelete, setPersonToDelete] = useState<Person | null>(null);
  const [editingVacationId, setEditingVacationId] = useState<string | null>(null);
  const [editingStartDate, setEditingStartDate] = useState("");
  const [editingEndDate, setEditingEndDate] = useState("");

  const handleAddPerson = (name: string, color: string) => {
    const newPerson: Person = {
      id: Date.now().toString(),
      name,
      color,
    };
    setPeople([...people, newPerson]);
  };

  const handleUpdatePersonColor = (personId: string, newColor: string) => {
    setPeople(
      people.map((p) => (p.id === personId ? { ...p, color: newColor } : p))
    );
  };

  const handleStartEditName = (personId: string, currentName: string) => {
    setEditingPersonId(personId);
    setEditingName(currentName);
  };

  const handleSaveEditName = (personId: string) => {
    if (editingName.trim()) {
      setPeople(
        people.map((p) =>
          p.id === personId ? { ...p, name: editingName } : p
        )
      );
    }
    setEditingPersonId(null);
    setEditingName("");
  };

  const handleDeletePerson = (personId: string) => {
    const personToRemove = people.find((p) => p.id === personId);
    if (personToRemove) {
      setPersonToDelete(personToRemove);
    }
  };

  const handleConfirmDelete = () => {
    if (personToDelete) {
      setPeople(people.filter((p) => p.id !== personToDelete.id));
      setVacations(vacations.filter((v) => v.personId !== personToDelete.id));
      if (selectedPersonId === personToDelete.id) {
        setSelectedPersonId(null);
      }
      if (editingPersonId === personToDelete.id) {
        setEditingPersonId(null);
      }
      setPersonToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setPersonToDelete(null);
  };

  const handleAddVacation = (startDate: Date, endDate: Date) => {
    if (!selectedPersonId) return;
    const newVacation: VacationPeriod = {
      id: Date.now().toString(),
      personId: selectedPersonId,
      startDate,
      endDate,
    };
    setVacations([...vacations, newVacation]);
  };

  const handleDeleteVacation = (vacationId: string) => {
    setVacations(vacations.filter((v) => v.id !== vacationId));
  };

  const handleStartEditVacation = (vacation: VacationPeriod) => {
    setEditingVacationId(vacation.id);
    setEditingStartDate(vacation.startDate.toISOString().split("T")[0]);
    setEditingEndDate(vacation.endDate.toISOString().split("T")[0]);
  };

  const handleSaveEditVacation = () => {
    if (!editingStartDate || !editingEndDate) return;

    const startDate = new Date(editingStartDate);
    const endDate = new Date(editingEndDate);

    if (startDate > endDate) return;

    setVacations(
      vacations.map((v) =>
        v.id === editingVacationId
          ? {
              ...v,
              startDate,
              endDate,
            }
          : v
      )
    );

    setEditingVacationId(null);
    setEditingStartDate("");
    setEditingEndDate("");
  };

  const handleCancelEditVacation = () => {
    setEditingVacationId(null);
    setEditingStartDate("");
    setEditingEndDate("");
  };

  const currentPersonVacations = selectedPersonId
    ? vacations.filter((v) => v.personId === selectedPersonId)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            PM Vacation Calendar
          </h1>
          <p className="text-slate-600">
            Please mark your desired vacation period below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Add Person Form */}
            <PersonManager onAddPerson={handleAddPerson} />

            {/* People List with Vacation Periods */}
            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Team Members
                </h3>
                {people.length > 1 && (
                  <div className="mb-4 pb-3 border-b space-y-2">
                    {people.map((person) => (
                      <label
                        key={person.id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-2 rounded transition-colors"
                      >
                        <input
                          type="radio"
                          name="vacation-person"
                          checked={selectedPersonId === person.id}
                          onChange={() => setSelectedPersonId(person.id)}
                          className="w-4 h-4"
                        />
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: person.color }}
                          />
                          <span className="text-sm text-slate-900">
                            {person.name}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
                <div className="space-y-3">
                  {people.length === 0 ? (
                    <p className="text-slate-500 text-sm">
                      Add a person to get started
                    </p>
                  ) : (
                    people.map((person) => (
                      <div
                        key={person.id}
                        className={`p-3 rounded-lg transition-all border-l-4 ${
                          selectedPersonId === person.id
                            ? "bg-slate-100"
                            : "bg-slate-50 hover:bg-slate-100"
                        }`}
                        style={{
                          borderLeftColor: person.color,
                        }}
                      >
                        <div className="w-full text-left mb-2 flex items-center gap-2 group">
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: person.color }}
                          />
                          {editingPersonId === person.id ? (
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              onBlur={() => handleSaveEditName(person.id)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleSaveEditName(person.id);
                                } else if (e.key === "Escape") {
                                  setEditingPersonId(null);
                                }
                              }}
                              autoFocus
                              className="flex-1 px-2 py-1 text-sm border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedPersonId(person.id);
                                setExpandedPersonId(
                                  expandedPersonId === person.id
                                    ? null
                                    : person.id
                                );
                              }}
                              className="flex-1 text-left font-medium text-sm text-slate-900 group-hover:underline cursor-pointer py-1"
                              onDoubleClick={() =>
                                handleStartEditName(person.id, person.name)
                              }
                            >
                              {person.name}
                            </button>
                          )}
                        </div>

                        {expandedPersonId === person.id && (
                          <div className="mt-2 space-y-2">
                            <label className="block text-xs font-medium text-slate-700">
                              Change Color:
                            </label>
                            <div className="flex gap-1 flex-wrap">
                              {COLORS.map((c) => (
                                <button
                                  key={c}
                                  type="button"
                                  onClick={() =>
                                    handleUpdatePersonColor(person.id, c)
                                  }
                                  className={`w-5 h-5 rounded-full transition-all ${
                                    person.color === c
                                      ? "ring-2 ring-slate-900"
                                      : "hover:scale-110"
                                  }`}
                                  style={{ backgroundColor: c }}
                                  title={c}
                                />
                              ))}
                            </div>
                            <input
                              type="color"
                              value={person.color}
                              onChange={(e) =>
                                handleUpdatePersonColor(person.id, e.target.value)
                              }
                              className="w-full h-7 rounded cursor-pointer text-xs"
                            />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Delete Button for Selected Person */}
                {selectedPersonId && (
                  <button
                    onClick={() => handleDeletePerson(selectedPersonId)}
                    className="mt-4 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Remove Selected
                  </button>
                )}
              </div>

              {/* Vacation Periods */}
              {selectedPersonId && currentPersonVacations.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-slate-900 mb-3 text-sm">
                    Vacation Periods for {people.find((p) => p.id === selectedPersonId)?.name}
                  </h4>
                  <div className="space-y-2">
                    {currentPersonVacations.map((vacation) =>
                      editingVacationId === vacation.id ? (
                        <div
                          key={vacation.id}
                          className="p-3 bg-blue-50 rounded border border-blue-200 space-y-2"
                        >
                          <div>
                            <label className="block text-xs font-medium text-slate-900 mb-1">
                              Start Date
                            </label>
                            <input
                              type="date"
                              value={editingStartDate}
                              onChange={(e) => setEditingStartDate(e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-900 mb-1">
                              End Date
                            </label>
                            <input
                              type="date"
                              value={editingEndDate}
                              onChange={(e) => setEditingEndDate(e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={handleSaveEditVacation}
                              className="flex-1 px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEditVacation}
                              className="flex-1 px-2 py-1 text-xs border border-slate-300 rounded font-medium text-slate-900 hover:bg-slate-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          key={vacation.id}
                          className="flex items-center justify-between p-2 bg-slate-50 rounded text-xs"
                        >
                          <div>
                            <div className="font-medium text-slate-900">
                              {vacation.startDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}{" "}
                              -{" "}
                              {vacation.endDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                            <div className="text-slate-600">
                              {Math.ceil(
                                (vacation.endDate.getTime() -
                                  vacation.startDate.getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )}{" "}
                              days
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStartEditVacation(vacation)}
                              className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteVacation(vacation.id)}
                              className="text-red-600 hover:text-red-700 font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Vacation Form for Selected Person */}
            {selectedPersonId && (
              <VacationForm
                personName={
                  people.find((p) => p.id === selectedPersonId)?.name || ""
                }
                personColor={
                  people.find((p) => p.id === selectedPersonId)?.color || "#000000"
                }
                year={year}
                onAddVacation={handleAddVacation}
              />
            )}
          </div>

          {/* Main Calendar View */}
          <div className="lg:col-span-3">
            <CalendarView
              year={year}
              people={people}
              vacations={vacations}
              onDeleteVacation={handleDeleteVacation}
            />
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {personToDelete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">
                Remove {personToDelete.name}?
              </h3>
              <p className="text-slate-600">
                This will remove {personToDelete.name} and all their vacation
                periods from the calendar. This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={handleCancelDelete}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
