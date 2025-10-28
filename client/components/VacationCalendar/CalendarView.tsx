import { Person, VacationPeriod } from "./index";
import { X } from "lucide-react";

interface CalendarViewProps {
  year: number;
  people: Person[];
  vacations: VacationPeriod[];
  onDeleteVacation: (vacationId: string) => void;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const QUARTERS = [
  { name: "Q1", months: [0, 1, 2] },
  { name: "Q2", months: [3, 4, 5] },
  { name: "Q3", months: [6, 7, 8] },
  { name: "Q4", months: [9, 10, 11] },
];

function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getDaysInMonth(month: number, year: number) {
  if (month === 1 && isLeapYear(year)) {
    return 29;
  }
  return DAYS_IN_MONTH[month];
}

function isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
  return date >= startDate && date <= endDate;
}

function getTotalDaysInQuarter(year: number, quarterMonths: number[]): number {
  return quarterMonths.reduce((sum, month) => {
    return sum + getDaysInMonth(month, year);
  }, 0);
}

function getQuarterStartDate(year: number, quarterIndex: number): Date {
  const months = QUARTERS[quarterIndex].months;
  return new Date(year, months[0], 1);
}

function getQuarterEndDate(year: number, quarterIndex: number): Date {
  const months = QUARTERS[quarterIndex].months;
  const lastMonth = months[months.length - 1];
  const daysInMonth = getDaysInMonth(lastMonth, year);
  return new Date(year, lastMonth, daysInMonth);
}

interface GanttBarProps {
  vacation: VacationPeriod;
  person: Person;
  quarterStart: Date;
  quarterEnd: Date;
  totalDays: number;
  index: number;
  onDelete: (vacationId: string) => void;
}

function GanttBar({
  vacation,
  person,
  quarterStart,
  quarterEnd,
  totalDays,
  index,
  onDelete,
}: GanttBarProps) {
  const clampedStart = new Date(
    Math.max(vacation.startDate.getTime(), quarterStart.getTime())
  );
  const clampedEnd = new Date(
    Math.min(vacation.endDate.getTime(), quarterEnd.getTime())
  );

  const offsetDays =
    Math.floor(
      (clampedStart.getTime() - quarterStart.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;
  const durationDays =
    Math.ceil(
      (clampedEnd.getTime() - clampedStart.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

  const leftPercent = (offsetDays / totalDays) * 100;
  const widthPercent = (durationDays / totalDays) * 100;
  const topOffset = index * 28;

  return (
    <div
      className="absolute h-6 rounded transition-all hover:shadow-lg hover:z-10 cursor-pointer group flex items-center justify-between px-2"
      style={{
        backgroundColor: person.color,
        left: `${leftPercent}%`,
        width: `${widthPercent}%`,
        top: `${topOffset}px`,
        minWidth: "100px",
      }}
      title={`${person.name}: ${vacation.startDate.toLocaleDateString()} - ${vacation.endDate.toLocaleDateString()}`}
    >
      <span className="text-xs font-semibold text-white truncate">
        {person.name}
      </span>
      <button
        onClick={() => onDelete(vacation.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 flex-shrink-0"
      >
        <X className="h-3 w-3 text-white hover:text-red-200" />
      </button>
    </div>
  );
}

interface QuarterRowProps {
  year: number;
  quarterIndex: number;
  people: Person[];
  vacations: VacationPeriod[];
  onDeleteVacation: (vacationId: string) => void;
}

function QuarterRow({
  year,
  quarterIndex,
  people,
  vacations,
  onDeleteVacation,
}: QuarterRowProps) {
  const quarter = QUARTERS[quarterIndex];
  const monthsInQuarter = quarter.months;
  const quarterStart = getQuarterStartDate(year, quarterIndex);
  const quarterEnd = getQuarterEndDate(year, quarterIndex);
  const totalDays = getTotalDaysInQuarter(year, monthsInQuarter);

  // Get all vacations for this quarter
  const quarterVacations = vacations.filter(
    (v) => !(v.endDate < quarterStart || v.startDate > quarterEnd)
  );

  const ganttHeight = people.length > 0 ? people.length * 28 : 60;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Quarter header and month labels */}
          <div className="flex items-stretch">
            <div className="bg-gradient-to-b from-blue-600 to-blue-700 text-white p-4 w-40 flex items-center justify-center font-bold text-lg sticky left-0 z-20">
              {quarter.name} {year}
            </div>
            <div className="flex flex-1">
              {monthsInQuarter.map((monthIndex) => (
                <div
                  key={monthIndex}
                  className="flex-1 bg-slate-100 p-3 font-semibold text-slate-900 border-r border-slate-200 text-center text-sm"
                >
                  {MONTHS[monthIndex]}
                </div>
              ))}
            </div>
          </div>

          {/* Unified Gantt timeline */}
          <div className="flex items-stretch">
            <div className="bg-slate-50 p-3 w-40 font-medium text-slate-900 border-r border-slate-200 sticky left-0 z-10 flex items-center">
              Timeline
            </div>
            <div
              className="flex-1 bg-slate-50 relative border-r border-slate-200"
              style={{ minHeight: `${ganttHeight}px` }}
            >
              {people.length === 0 ? (
                <div className="flex items-center justify-center h-16 text-slate-500">
                  <p className="text-sm">No team members added</p>
                </div>
              ) : (
                <>
                  {/* Month separators */}
                  {monthsInQuarter.map((_, idx) => {
                    const daysInMonth = getDaysInMonth(
                      monthsInQuarter[idx],
                      year
                    );
                    const daysUpToMonth = monthsInQuarter
                      .slice(0, idx)
                      .reduce((sum, m) => sum + getDaysInMonth(m, year), 0);
                    const leftPercent = (daysUpToMonth / totalDays) * 100;

                    return (
                      <div
                        key={idx}
                        className="absolute top-0 bottom-0 border-l border-slate-300"
                        style={{ left: `${leftPercent}%` }}
                      />
                    );
                  })}

                  {/* Gantt bars for all people */}
                  {quarterVacations.map((vacation, idx) => {
                    const person = people.find((p) => p.id === vacation.personId);
                    if (!person) return null;

                    const personIndex = people.findIndex(
                      (p) => p.id === vacation.personId
                    );

                    return (
                      <GanttBar
                        key={vacation.id}
                        vacation={vacation}
                        person={person}
                        quarterStart={quarterStart}
                        quarterEnd={quarterEnd}
                        totalDays={totalDays}
                        index={personIndex}
                        onDelete={onDeleteVacation}
                      />
                    );
                  })}
                </>
              )}
            </div>
          </div>

          {/* Calendar grid for reference */}
          <div className="flex items-stretch border-t border-slate-200">
            <div className="bg-slate-50 p-3 w-40 font-medium text-slate-900 border-r border-slate-200 sticky left-0 z-10 flex items-center">
              Calendar
            </div>
            <div className="flex-1 flex">
              {monthsInQuarter.map((monthIndex) => {
                const daysInMonth = getDaysInMonth(monthIndex, year);
                const monthStart = new Date(year, monthIndex, 1);
                const firstDayOfMonth = monthStart.getDay();

                return (
                  <div
                    key={monthIndex}
                    className="flex-1 border-r border-slate-200 p-2 bg-white"
                  >
                    <div className="grid grid-cols-7 gap-px text-center mb-1">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <div
                          key={i}
                          className="text-xs text-slate-400 font-medium"
                        >
                          {["S", "M", "T", "W", "T", "F", "S"][i]}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-px">
                      {Array.from({ length: 42 }).map((_, dayIndex) => {
                        const dayOfMonth = dayIndex - firstDayOfMonth + 1;

                        if (dayOfMonth < 1 || dayOfMonth > daysInMonth) {
                          return (
                            <div
                              key={dayIndex}
                              className="aspect-square text-xs bg-slate-50"
                            />
                          );
                        }

                        const currentDate = new Date(
                          year,
                          monthIndex,
                          dayOfMonth
                        );

                        // Check if any person has vacation on this day
                        const vacationOnDay = quarterVacations.find((v) => {
                          const person = people.find(
                            (p) => p.id === v.personId
                          );
                          return (
                            person &&
                            isDateInRange(currentDate, v.startDate, v.endDate)
                          );
                        });

                        const person = vacationOnDay
                          ? people.find((p) => p.id === vacationOnDay.personId)
                          : null;

                        return (
                          <div
                            key={dayIndex}
                            className="aspect-square text-xs flex items-center justify-center rounded font-medium transition-colors"
                            style={{
                              backgroundColor: person
                                ? person.color
                                : "white",
                              color: person ? "white" : "inherit",
                            }}
                            title={
                              person
                                ? `${person.name} on vacation`
                                : "Working day"
                            }
                          >
                            {dayOfMonth}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CalendarView({
  year,
  people,
  vacations,
  onDeleteVacation,
}: CalendarViewProps) {
  return (
    <div className="space-y-6">
      {QUARTERS.map((_, quarterIndex) => (
        <QuarterRow
          key={quarterIndex}
          year={year}
          quarterIndex={quarterIndex}
          people={people}
          vacations={vacations}
          onDeleteVacation={onDeleteVacation}
        />
      ))}
    </div>
  );
}
