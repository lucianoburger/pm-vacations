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

  const currentPersonVacations = selectedPersonId
    ? vacations.filter((v) => v.personId === selectedPersonId)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Vacation Calendar
          </h1>
          <p className="text-slate-600">
            Manage team vacations and see overlapping periods at a glance
          </p>
        </div>

        {/* Year Selector */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setYear(year - 1)}
              className="h-9 w-9 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-bold text-slate-900 w-20 text-center">
              {year}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setYear(year + 1)}
              className="h-9 w-9 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setYear(2026)}
            className="text-sm"
          >
            Today (2026)
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Add Person Form */}
            <PersonManager onAddPerson={handleAddPerson} />

            {/* People List */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Team Members
              </h3>
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
                                expandedPersonId === person.id ? null : person.id
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

            {/* Vacation Form for Selected Person */}
            {selectedPersonId && (
              <VacationForm
                personName={
                  people.find((p) => p.id === selectedPersonId)?.name || ""
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

            {/* Vacation Details for Selected Person */}
            {selectedPersonId && currentPersonVacations.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Vacation Periods
                </h3>
                <div className="space-y-2">
                  {currentPersonVacations.map((vacation) => (
                    <div
                      key={vacation.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="text-sm">
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
                      <button
                        onClick={() => handleDeleteVacation(vacation.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
