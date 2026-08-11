import React from 'react';

export const StandingsTable = ({ standings, onTeamClick }) => {
    if (standings.length === 0) {
        return <p className="text-center text-slate-500 dark:text-slate-400 py-4">No hay datos de clasificación para esta liga.</p>;
    }

    const positionColors = [
        'border-l-4 border-amber-400 bg-amber-50/70 dark:bg-amber-900/20 font-semibold', // 🥇 Oro
        'border-l-4 border-slate-300 bg-slate-50/70 dark:bg-slate-800/40 font-medium',     // 🥈 Plata
        'border-l-4 border-amber-700 bg-amber-900/10 dark:bg-amber-950/30',                // 🥉 Bronce
        'border-l-4 border-transparent'
    ];

    return (
        <div className="overflow-x-auto rounded-2xl shadow-lg bg-white dark:bg-slate-800/80 backdrop-blur-md border border-slate-100 dark:border-slate-700/60">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-900/50">
                    <tr>
                        <th className="px-4 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider w-12 font-outfit">#</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider font-outfit">Equipo</th>
                        <th className="px-3 py-4 text-center text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider font-outfit">JJ</th>
                        <th className="px-3 py-4 text-center text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider font-outfit">JG</th>
                        <th className="px-3 py-4 text-center text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider font-outfit">JE</th>
                        <th className="px-3 py-4 text-center text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider font-outfit">JP</th>
                        <th className="px-3 py-4 text-center text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider font-outfit">GF</th>
                        <th className="px-3 py-4 text-center text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider font-outfit">GC</th>
                        <th className="px-3 py-4 text-center text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider font-outfit">DIF</th>
                        <th className="px-4 py-4 text-center text-xs font-extrabold text-[#101097] dark:text-blue-400 uppercase tracking-wider font-outfit bg-indigo-50/50 dark:bg-indigo-900/20">PTS</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-sm">
                    {standings.map((team, index) => {
                        const styleClass = positionColors[index] || positionColors[3];
                        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';

                        return (
                            <tr key={team.id} className={`${styleClass} hover:bg-slate-100/60 dark:hover:bg-slate-700/50 transition-colors`}>
                                <td className="px-4 py-3.5 whitespace-nowrap font-bold text-slate-700 dark:text-slate-200 font-outfit">
                                    {medal} {index + 1}
                                </td>
                                <td className="px-6 py-3.5 whitespace-nowrap">
                                    <button onClick={() => onTeamClick(team)} className="flex items-center space-x-3 group text-left focus:outline-none">
                                        <img src={team.logoUrl} alt={team.name} className="w-8 h-8 rounded-full shadow-sm object-contain bg-white p-0.5 group-hover:scale-110 transition-transform" />
                                        <span className="font-bold text-slate-800 dark:text-white group-hover:text-[#101097] dark:group-hover:text-blue-400 transition-colors font-outfit text-base">
                                            {team.name}
                                        </span>
                                    </button>
                                </td>
                                <td className="px-3 py-3.5 text-center whitespace-nowrap font-medium text-slate-600 dark:text-slate-300">{team.played}</td>
                                <td className="px-3 py-3.5 text-center whitespace-nowrap font-medium text-emerald-600 dark:text-emerald-400">{team.won}</td>
                                <td className="px-3 py-3.5 text-center whitespace-nowrap font-medium text-amber-600 dark:text-amber-400">{team.drawn}</td>
                                <td className="px-3 py-3.5 text-center whitespace-nowrap font-medium text-red-600 dark:text-red-400">{team.lost}</td>
                                <td className="px-3 py-3.5 text-center whitespace-nowrap font-medium text-slate-600 dark:text-slate-300">{team.goalsFor}</td>
                                <td className="px-3 py-3.5 text-center whitespace-nowrap font-medium text-slate-600 dark:text-slate-300">{team.goalsAgainst}</td>
                                <td className="px-3 py-3.5 text-center whitespace-nowrap font-semibold text-slate-700 dark:text-slate-200">
                                    {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                                </td>
                                <td className="px-4 py-3.5 text-center whitespace-nowrap font-extrabold text-base text-[#101097] dark:text-blue-300 bg-indigo-50/30 dark:bg-indigo-900/10 font-outfit">
                                    {team.points}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
