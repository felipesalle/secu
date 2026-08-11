import React from 'react';
import { CalendarIcon } from './Icons';

export const Ticker = ({ matches, getTeamName }) => {
    // Tomar partidos programados (próximos)
    const upcoming = matches.filter(m => m.scoreHome === null || m.scoreHome === undefined).slice(0, 15);
    if (upcoming.length === 0) return null;

    // Repetir los elementos para un bucle continuo suave (infinite loop)
    const items = [...upcoming, ...upcoming, ...upcoming, ...upcoming];

    return (
        <div className="bg-slate-900 text-white py-2.5 overflow-hidden whitespace-nowrap relative border-b border-slate-800 shadow-inner">
            <div className="ticker-track flex animate-marquee space-x-12">
                {items.map((m, i) => (
                    <span key={i} className="text-xs font-medium inline-flex items-center space-x-2">
                        <CalendarIcon className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="text-slate-400 font-mono">{m.date}</span>
                        <span className="font-bold font-outfit text-white">{getTeamName(m.homeTeamId)}</span>
                        <span className="text-amber-400 font-extrabold text-[11px] px-1.5 py-0.5 bg-amber-400/10 rounded">VS</span>
                        <span className="font-bold font-outfit text-white">{getTeamName(m.awayTeamId)}</span>
                    </span>
                ))}
            </div>
        </div>
    );
};
