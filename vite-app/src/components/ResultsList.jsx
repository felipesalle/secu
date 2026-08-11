import React from 'react';

export const ResultsList = ({ matches, getTeamName, getTeamLogo, onMatchClick }) => {
    const finishedMatches = matches
        .filter(m => m.scoreHome !== null && m.scoreHome !== undefined)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (finishedMatches.length === 0) {
        return <p className="text-center text-slate-500 dark:text-slate-400 py-4">No hay resultados jugados aún.</p>;
    }

    return (
        <div className="space-y-3">
            {finishedMatches.slice(0, 5).map(match => {
                const homeName = getTeamName(match.homeTeamId);
                const awayName = getTeamName(match.awayTeamId);
                const homeLogo = getTeamLogo ? getTeamLogo(match.homeTeamId) : 'https://crests.football-data.org/86.png';
                const awayLogo = getTeamLogo ? getTeamLogo(match.awayTeamId) : 'https://crests.football-data.org/81.png';

                return (
                    <div
                        key={match.id}
                        onClick={() => onMatchClick && onMatchClick(match)}
                        className="bg-white dark:bg-slate-800/90 p-3.5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/80 flex items-center justify-between gap-3 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-700 transition-all cursor-pointer group"
                    >
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                            <img src={homeLogo} alt={homeName} className="w-7 h-7 rounded-full object-contain bg-white p-0.5 shadow-xs flex-shrink-0" />
                            <span className="font-bold font-outfit text-sm text-slate-800 dark:text-white truncate">{homeName}</span>
                        </div>

                        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-xl flex-shrink-0 font-outfit font-extrabold text-sm border border-slate-200 dark:border-slate-800">
                            <span className="text-slate-900 dark:text-white">{match.scoreHome}</span>
                            <span className="text-slate-400 font-normal text-xs">-</span>
                            <span className="text-slate-900 dark:text-white">{match.scoreAway}</span>
                        </div>

                        <div className="flex items-center space-x-2 flex-1 min-w-0 justify-end text-right">
                            <span className="font-bold font-outfit text-sm text-slate-800 dark:text-white truncate">{awayName}</span>
                            <img src={awayLogo} alt={awayName} className="w-7 h-7 rounded-full object-contain bg-white p-0.5 shadow-xs flex-shrink-0" />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
