import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Tag, Download, ExternalLink, Clock } from 'lucide-react';
import { Activity } from '../types';

interface CalendarViewProps {
  activities: Activity[];
  onSelectActivity: (id: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ activities, onSelectActivity }) => {
  const [currentDate, setCurrentDate] = useState(new Date('2026-10-01'));
  const [selectedLocality, setSelectedLocality] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string | null>('2026-10-10');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  const localities = Array.from(new Set(activities.map((a) => a.locality_name || 'Kisii Central')));
  const types = Array.from(new Set(activities.map((a) => a.activity_type)));

  const filteredActivities = activities.filter((a) => {
    if (selectedLocality !== 'all' && (a.locality_name || 'Kisii Central') !== selectedLocality) return false;
    if (selectedType !== 'all' && a.activity_type !== selectedType) return false;
    return true;
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Format date key YYYY-MM-DD
  const formatDayKey = (day: number) => {
    const m = (month + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  const getActivitiesForDay = (dayKey: string) => {
    return filteredActivities.filter((a) => a.start_time.startsWith(dayKey));
  };

  const selectedDayActivities = selectedDate
    ? filteredActivities.filter((a) => a.start_time.startsWith(selectedDate))
    : [];

  // Helper to export ICS
  const downloadIcs = (act: Activity) => {
    const start = new Date(act.start_time).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const end = new Date(act.end_time).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Kisii Cluster Portal//EN
BEGIN:VEVENT
UID:${act.id}@kisiicluster.org
DTSTAMP:${start}
DTSTART:${start}
DTEND:${end}
SUMMARY:${act.title}
DESCRIPTION:${act.description.replace(/\n/g, '\\n')}
LOCATION:${act.location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${act.title.toLowerCase().replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openGoogleCalendar = (act: Activity) => {
    const start = new Date(act.start_time).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const end = new Date(act.end_time).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      act.title
    )}&dates=${start}/${end}&details=${encodeURIComponent(act.description)}&location=${encodeURIComponent(
      act.location
    )}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Filter and Mode Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Locality Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
            <MapPin className="w-3.5 h-3.5 text-teal-600" />
            <select
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
              className="bg-transparent font-medium focus:outline-hidden text-slate-800"
            >
              <option value="all">All Localities</option>
              {localities.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Activity Type Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
            <Tag className="w-3.5 h-3.5 text-teal-600" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-transparent font-medium focus:outline-hidden text-slate-800"
            >
              <option value="all">All Activity Types</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1 rounded-lg transition ${
              viewMode === 'calendar' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Monthly Calendar
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded-lg transition ${
              viewMode === 'list' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upcoming List ({filteredActivities.length})
          </button>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Grid (2 cols on lg) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-2xs p-5">
            {/* Calendar Month Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-teal-600" />
                <span>{monthName}</span>
              </h3>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={prevMonth}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                  aria-label="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                  aria-label="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Day of Week Headers */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 mb-2">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Empty leading days */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="h-16 sm:h-20 rounded-xl bg-slate-50/50 opacity-40" />
              ))}

              {/* Month days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayKey = formatDayKey(day);
                const dayActivities = getActivitiesForDay(dayKey);
                const isSelected = selectedDate === dayKey;
                const hasActivities = dayActivities.length > 0;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(dayKey)}
                    className={`h-16 sm:h-20 p-1.5 rounded-xl border text-left transition flex flex-col justify-between overflow-hidden ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/40 ring-2 ring-teal-500/20'
                        : hasActivities
                        ? 'border-slate-200 hover:border-teal-400 bg-white'
                        : 'border-slate-100 hover:border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-semibold ${
                          isSelected ? 'text-teal-700' : 'text-slate-700'
                        }`}
                      >
                        {day}
                      </span>
                      {hasActivities && (
                        <span className="w-2 h-2 rounded-full bg-teal-600" />
                      )}
                    </div>

                    <div className="space-y-1 overflow-hidden">
                      {dayActivities.slice(0, 2).map((act) => (
                        <div
                          key={act.id}
                          className="text-[10px] font-medium truncate px-1 py-0.5 rounded bg-teal-100/70 text-teal-800"
                        >
                          {act.title}
                        </div>
                      ))}
                      {dayActivities.length > 2 && (
                        <span className="text-[9px] text-slate-500 pl-1 font-semibold">
                          +{dayActivities.length - 2} more
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Day Agenda Drawer / Side List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h4 className="text-sm font-bold text-slate-900">
                {selectedDate
                  ? new Date(selectedDate).toLocaleDateString(undefined, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Select a Date'}
              </h4>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {selectedDayActivities.length} Event{selectedDayActivities.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {selectedDayActivities.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-1" />
                  <p>No activities scheduled for this date.</p>
                </div>
              ) : (
                selectedDayActivities.map((act) => (
                  <div
                    key={act.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition space-y-2"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-teal-100 text-teal-800 uppercase">
                        {act.activity_type}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {new Date(act.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <h5
                      onClick={() => onSelectActivity(act.id)}
                      className="text-xs font-bold text-slate-900 hover:text-teal-700 cursor-pointer transition leading-snug"
                    >
                      {act.title}
                    </h5>

                    <p className="text-[11px] text-slate-500 line-clamp-2">{act.description}</p>

                    <div className="text-[11px] text-slate-600 flex items-center gap-1.5 pt-1">
                      <MapPin className="w-3 h-3 text-teal-600 shrink-0" />
                      <span className="truncate">{act.location}</span>
                    </div>

                    {/* Export Buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80">
                      <button
                        onClick={() => downloadIcs(act)}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-[11px] font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
                        title="Download .ics calendar event"
                      >
                        <Download className="w-3 h-3" />
                        <span>Save .ICS</span>
                      </button>
                      <button
                        onClick={() => openGoogleCalendar(act)}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-[11px] font-medium rounded-lg bg-teal-50 border border-teal-200 text-teal-800 hover:bg-teal-100 transition"
                        title="Open in Google Calendar"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Google Cal</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Upcoming List View */
        <div className="space-y-3">
          {filteredActivities.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
              No matching activities found for selected filters.
            </div>
          ) : (
            filteredActivities.map((act) => {
              const startDate = new Date(act.start_time);
              return (
                <div
                  key={act.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:shadow-md transition"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                        {act.activity_type}
                      </span>
                      <span className="text-xs text-slate-500">
                        {act.locality_name || 'Kisii Central'}
                      </span>
                    </div>
                    <h4
                      onClick={() => onSelectActivity(act.id)}
                      className="text-sm sm:text-base font-bold text-slate-900 hover:text-teal-700 cursor-pointer transition"
                    >
                      {act.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{act.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5 text-teal-600" />
                        {startDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-teal-600" />
                        {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-teal-600" />
                        {act.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => downloadIcs(act)}
                      className="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>.ICS</span>
                    </button>
                    <button
                      onClick={() => onSelectActivity(act.id)}
                      className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition shadow-xs"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
