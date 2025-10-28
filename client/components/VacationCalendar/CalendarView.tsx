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

function getTotalDaysInYear(year: number): number {
  return isLeapYear(year) ? 366 : 365;
}

function getYearStartDate(year: number): Date {
  return new Date(year, 0, 1);
}

function getYearEndDate(year: number): Date {
  return new Date(year, 11, 31);
}

interface GanttBarProps {
  startDate: Date;
  endDate: Date;
  color: string;
  yearStart: Date;
  yearEnd: Date;
  totalDays: number;
}

function GanttBar({
  startDate,
  endDate,
  color,
  yearStart,
  yearEnd,
  totalDays,
}: GanttBarProps) {
  const clampedStart = new Date(
    Math.max(startDate.getTime(), yearStart.getTime())
  );
  const clampedEnd = new Date(Math.min(endDate.getTime(), yearEnd.getTime()));

  const offsetDays =
    Math.floor(
      (clampedStart.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;
  const durationDays =
    Math.ceil(
      (clampedEnd.getTime() - clampedStart.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

  const leftPercent = (offsetDays / totalDays) * 100;
  const widthPercent = (durationDays / totalDays) * 100;

  return (
    <div
      className="absolute h-5 rounded transition-all hover:shadow-md hover:z-10"
      style={{
        backgroundColor: color,
        left: `${leftPercent}%`,
        width: `${widthPercent}%`,
        top: "0px",
      }}
      title={`${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`}
    />
  );
}

export function CalendarView({
  year,
  people,
  vacations,
  onDeleteVacation,
}: CalendarViewProps) {
  const yearStart = getYearStartDate(year);
  const yearEnd = getYearEndDate(year);
  const totalDays = getTotalDaysInYear(year);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Month headers */}
          <div
            className="grid gap-0"
            style={{ gridTemplateColumns: "200px repeat(12, 1fr)" }}
          >
            <div className="bg-slate-100 p-3 font-semibold text-slate-900 border-r border-slate-200 sticky left-0 z-20" />
            {MONTHS.map((month) => (
              <div
                key={month}
                className="bg-slate-100 p-3 font-semibold text-slate-900 border-r border-slate-200 text-center text-sm"
              >
                {month}
              </div>
            ))}
          </div>

          {/* Empty state */}
          {people.length === 0 ? (
            <div
              className="grid gap-0"
              style={{ gridTemplateColumns: "200px repeat(12, 1fr)" }}
            >
              <div className="bg-slate-50 p-3 font-medium text-slate-900 border-r border-slate-200 sticky left-0 z-10 flex items-center justify-center">
                <p className="text-sm text-slate-600">No team members</p>
              </div>
              {MONTHS.map((_, monthIndex) => {
                const daysInMonth = getDaysInMonth(monthIndex, year);
                const monthStart = new Date(year, monthIndex, 1);
                const firstDayOfMonth = monthStart.getDay();

                return (
                  <div
                    key={monthIndex}
                    className="min-h-32 border-r border-slate-200 p-2 bg-slate-50 hover:bg-slate-100/50 transition-colors"
                  >
                    <div className="grid grid-cols-7 gap-px text-center mb-1">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className="text-xs text-slate-400 font-medium">
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
                              className="aspect-square text-xs bg-white"
                            />
                          );
                        }

                        return (
                          <div
                            key={dayIndex}
                            className="aspect-square text-xs flex items-center justify-center rounded font-medium text-slate-400 bg-white hover:bg-slate-100 transition-colors"
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
          ) : (
            people.map((person) => {
              const personVacations = vacations.filter(
                (v) => v.personId === person.id
              );

              return (
                <div
                  key={person.id}
                  className="grid gap-0 border-b border-slate-200 last:border-b-0"
                  style={{ gridTemplateColumns: "200px repeat(12, 1fr)" }}
                >
                  {/* Person name */}
                  <div className="bg-slate-50 p-3 font-medium text-slate-900 border-r border-slate-200 sticky left-0 z-10 flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: person.color }}
                    />
                    <span className="truncate">{person.name}</span>
                  </div>

                  {/* Month cells with calendar and Gantt */}
                  {MONTHS.map((_, monthIndex) => {
                    const daysInMonth = getDaysInMonth(monthIndex, year);
                    const monthStart = new Date(year, monthIndex, 1);
                    const monthEnd = new Date(year, monthIndex, daysInMonth);
                    const firstDayOfMonth = monthStart.getDay();

                    const monthVacations = personVacations.filter((v) => {
                      return !(v.endDate < monthStart || v.startDate > monthEnd);
                    });

                    return (
                      <div
                        key={monthIndex}
                        className="min-h-32 border-r border-slate-200 p-2 flex flex-col gap-1 bg-white hover:bg-slate-50/50 transition-colors relative group"
                      >
                        {/* Year-wide Gantt timeline */}
                        <div className="relative h-6 bg-slate-100 rounded mb-1 overflow-hidden">
                          {monthVacations.map((vacation) => (
                            <GanttBar
                              key={vacation.id}
                              startDate={vacation.startDate}
                              endDate={vacation.endDate}
                              color={person.color}
                              yearStart={yearStart}
                              yearEnd={yearEnd}
                              totalDays={totalDays}
                            />
                          ))}
                        </div>

                        {/* Day indicators */}
                        <div className="grid grid-cols-7 gap-px text-center">
                          {Array.from({ length: 7 }).map((_, i) => (
                            <div
                              key={i}
                              className="text-xs text-slate-400 font-medium"
                            >
                              {["S", "M", "T", "W", "T", "F", "S"][i]}
                            </div>
                          ))}
                        </div>

                        {/* Calendar days */}
                        <div className="grid grid-cols-7 gap-px flex-1">
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
                            const isVacation = monthVacations.some((v) =>
                              isDateInRange(currentDate, v.startDate, v.endDate)
                            );

                            return (
                              <div
                                key={dayIndex}
                                className={`aspect-square text-xs flex items-center justify-center rounded font-medium transition-colors ${
                                  isVacation
                                    ? "font-semibold text-white"
                                    : "text-slate-600 hover:bg-slate-100"
                                }`}
                                style={{
                                  backgroundColor: isVacation
                                    ? person.color
                                    : "transparent",
                                }}
                                title={
                                  isVacation ? "On vacation" : "Working day"
                                }
                              >
                                {dayOfMonth}
                              </div>
                            );
                          })}
                        </div>

                        {/* Vacation popover on hover */}
                        {monthVacations.length > 0 && (
                          <div className="absolute left-full top-0 ml-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-30 bg-white rounded-lg shadow-lg p-3 whitespace-nowrap border border-slate-200">
                            <div className="text-sm font-semibold text-slate-900 mb-2">
                              {person.name}
                            </div>
                            {monthVacations.map((v) => (
                              <div
                                key={v.id}
                                className="text-xs text-slate-600 mb-2 pb-2 border-b border-slate-200 last:border-b-0 last:mb-0 last:pb-0"
                              >
                                <div className="font-medium">
                                  {v.startDate.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}{" "}
                                  -{" "}
                                  {v.endDate.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </div>
                                <button
                                  onClick={() => onDeleteVacation(v.id)}
                                  className="text-red-600 hover:text-red-700 text-xs font-medium mt-1 flex items-center gap-1"
                                >
                                  <X className="h-3 w-3" />
                                  Delete
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
