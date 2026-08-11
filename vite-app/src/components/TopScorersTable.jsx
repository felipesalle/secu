import React from 'react';
import { getSportScoringInfo } from '../config/constants';

export const TopScorersTable = ({ scorers, sport = 'Fútbol' }) => {
    const scoringInfo = getSportScoringInfo(sport);

    if (scoringInfo.noScorers) {
        return (
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 font-outfit">
                    🏐 Voleibol no registra anotadores individuales.
                </p>
                <p className="text-xs text-slate-400 mt-1">El resultado se define por sets y puntos acumulados por equipo.</p>
            </div>
        );
    }

    if (!scorers || scorers.length === 0) {
        return <p className="text-center text-slate-500 dark:text-slate-400 py-4">No hay registro de anotadores en esta liga aún.</p>;
    }

    return (
        <div className="overflow-hidden rounded-2xl shadow-md bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60">
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-outfit">Alumno / Jugador</span>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-500 font-outfit">{scoringInfo.unit}</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {scorers.slice(0, 10).map((scorer, index) => (
                    <div key={scorer.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-colors">
                        <div className="flex items-center space-x-3 min-w-0">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs font-outfit ${index === 0 ? 'bg-amber-400 text-slate-900' : index === 1 ? 'bg-slate-300 text-slate-900' : index === 2 ? 'bg-amber-700 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                                {index + 1}
                            </span>
                            <div className="min-w-0">
                                <p className="font-bold text-sm text-slate-800 dark:text-white truncate font-outfit">{scorer.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{scorer.teamName}</p>
                            </div>
                        </div>
                        <span className="font-extrabold text-base text-amber-500 font-outfit bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-xl border border-amber-200/50 dark:border-amber-700/30">
                            {scorer.goals} <span className="text-xs font-semibold">{scoringInfo.unitShort}</span>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
