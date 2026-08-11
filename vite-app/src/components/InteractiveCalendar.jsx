import React, { useState, useEffect, useMemo } from 'react';

export const InteractiveCalendar = ({ matches, selectedDateFilter, onSelectDate, inaugurationDate }) => {
    const [viewDate, setViewDate] = useState(() => {
        if (selectedDateFilter) {
            const d = new Date(selectedDateFilter + 'T00:00:00');
            if (!isNaN(d.getTime())) return d;
        }
        return new Date();
    });

    useEffect(() => {
        if (selectedDateFilter) {
            const d = new Date(selectedDateFilter + 'T00:00:00');
            if (!isNaN(d.getTime())) {
                if (d.getFullYear() !== viewDate.getFullYear() || d.getMonth() !== viewDate.getMonth()) {
                    setViewDate(d);
                }
            }
        }
    }, [selectedDateFilter]);

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();

    const matchesByDate = useMemo(() => {
        const map = {};
        matches.forEach(m => {
            if (m.date) {
                map[m.date] = (map[m.date] || 0) + 1;
            }
        });
        return map;
    }, [matches]);

    const prevMonth = () => {
        onSelectDate('');
        setViewDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        onSelectDate('');
        setViewDate(new Date(year, month + 1, 1));
    };

    const daysArray = [];
    for (let i = 0; i < firstDayIndex; i++) {
        daysArray.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        daysArray.push(day);
    }

    return (
        <div className="card p-6 md:p-8 space-y-6 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-700 pb-4">
                <div>
                    <h3 className="text-xl font-bold font-outfit text-slate-900 dark:text-white flex items-center">
                        📅 Calendario Interactivo de Jornadas
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Haz clic en cualquier fecha destacada en azul o amarillo para filtrar los partidos.
                    </p>
                </div>
                <div className="flex items-center space-x-3 bg-slate-100 dark:bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    <button onClick={prevMonth} className="text-slate-600 dark:text-slate-300 hover:text-[#101097] dark:hover:text-blue-400 p-1 font-bold">
                        ←
                    </button>
                    <span className="text-sm font-bold font-outfit text-[#101097] dark:text-blue-300 min-w-[120px] text-center">
                        {monthNames[month]} {year}
                    </span>
                    <button onClick={nextMonth} className="text-slate-600 dark:text-slate-300 hover:text-[#101097] dark:hover:text-blue-400 p-1 font-bold">
                        →
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-outfit pb-2">
                <span>DOM</span>
                <span>LUN</span>
                <span>MAR</span>
                <span>MIÉ</span>
                <span>JUE</span>
                <span>VIE</span>
                <span>SÁB</span>
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2 min-h-[220px] sm:min-h-[260px]">
                {daysArray.map((day, idx) => {
                    if (day === null) {
                        return <div key={`empty-${idx}`} className="h-12 sm:h-16 rounded-lg sm:rounded-xl"></div>;
                    }

                    const monthStr = String(month + 1).padStart(2, '0');
                    const dayStr = String(day).padStart(2, '0');
                    const dateKey = `${year}-${monthStr}-${dayStr}`;
                    const count = matchesByDate[dateKey] || 0;
                    const isSelected = selectedDateFilter === dateKey;

                    const isInauguration = inaugurationDate && dateKey === inaugurationDate;

                    if (count > 0 || isInauguration) {
                        return (
                            <button
                                key={dateKey}
                                onClick={() => onSelectDate(isSelected ? '' : dateKey)}
                                className={`h-12 sm:h-16 p-1 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center transition-all duration-200 shadow-md cursor-pointer ${
                                    isInauguration
                                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 ring-2 sm:ring-4 ring-amber-400/60 scale-105 font-bold'
                                        : isSelected
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white ring-2 sm:ring-4 ring-blue-400/50 scale-105 font-bold'
                                        : 'bg-gradient-to-r from-[#101097] to-[#2a2ad9] text-white hover:scale-105 hover:shadow-lg'
                                }`}
                            >
                                <span className="text-xs sm:text-base font-extrabold font-outfit leading-none">{day}</span>
                                <span className={`text-[8px] sm:text-[10px] mt-0.5 sm:mt-1 px-1 sm:px-2 py-0.5 rounded-full font-semibold max-w-full truncate ${isInauguration ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-white/20'}`}>
                                    {isInauguration ? (
                                        <>
                                            <span className="sm:hidden">🎉 {count > 0 ? count : ''}</span>
                                            <span className="hidden sm:inline">🎉 Inauguración{count > 0 ? ` (${count})` : ''}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="sm:hidden">{count} p.</span>
                                            <span className="hidden sm:inline">{count} {count === 1 ? 'partido' : 'partidos'}</span>
                                        </>
                                    )}
                                </span>
                            </button>
                        );
                    }

                    return (
                        <div
                            key={dateKey}
                            className="h-12 sm:h-16 rounded-xl border border-slate-100 dark:border-slate-800/40 flex items-center justify-center text-xs sm:text-sm font-medium text-slate-400 dark:text-slate-600 opacity-60"
                        >
                            {day}
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="w-3 h-3 rounded-full bg-[#101097] inline-block"></span>
                <span>Días con partidos programados</span>
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block ml-4"></span>
                <span>Día de Inauguración Deportiva</span>
            </div>
        </div>
    );
};
