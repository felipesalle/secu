import React from 'react';
import { CloseIcon, TrophyIcon, CalendarIcon } from './Icons';

export const TeamProfileModal = ({ team, players, matches, getTeamName, onClose }) => {
    if (!team) return null;

    const teamPlayers = players.filter(p => p.teamId === team.id).sort((a, b) => a.name.localeCompare(b.name));
    const teamMatches = matches.filter(m => m.homeTeamId === team.id || m.awayTeamId === team.id)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    let wins = 0, draws = 0, losses = 0, gf = 0, gc = 0;
    teamMatches.forEach(m => {
        if (m.scoreHome !== null && m.scoreAway !== null) {
            const isHome = m.homeTeamId === team.id;
            const myScore = isHome ? m.scoreHome : m.scoreAway;
            const oppScore = isHome ? m.scoreAway : m.scoreHome;
            gf += myScore;
            gc += oppScore;
            if (myScore > oppScore) wins++;
            else if (myScore === oppScore) draws++;
            else losses++;
        }
    });

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 max-w-2xl w-full space-y-6 shadow-2xl border border-slate-100 dark:border-slate-700/60 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
                    <div className="flex items-center space-x-4">
                        <img src={team.logoUrl} alt={team.name} className="w-14 h-14 rounded-full object-contain bg-white p-1 shadow-md" />
                        <div>
                            <h3 className="text-2xl font-bold font-outfit text-slate-900 dark:text-white">{team.name}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Perfil Oficial del Equipo — Ligas La Salle</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <CloseIcon />
                    </button>
                </div>

                {/* Estadísticas Rápidas */}
                <div className="grid grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                    <div>
                        <p className="text-xs text-slate-500 font-bold uppercase">Jugados</p>
                        <p className="text-xl font-extrabold font-outfit text-slate-800 dark:text-white">{wins + draws + losses}</p>
                    </div>
                    <div>
                        <p className="text-xs text-emerald-500 font-bold uppercase">Victorias</p>
                        <p className="text-xl font-extrabold font-outfit text-emerald-600 dark:text-emerald-400">{wins}</p>
                    </div>
                    <div>
                        <p className="text-xs text-amber-500 font-bold uppercase">Empates</p>
                        <p className="text-xl font-extrabold font-outfit text-amber-600 dark:text-amber-400">{draws}</p>
                    </div>
                    <div>
                        <p className="text-xs text-red-500 font-bold uppercase">Derrotas</p>
                        <p className="text-xl font-extrabold font-outfit text-red-600 dark:text-red-400">{losses}</p>
                    </div>
                </div>

                {/* Lista de Alumnos */}
                <div className="space-y-3">
                    <h4 className="text-base font-bold font-outfit text-slate-800 dark:text-white flex items-center">
                        <TrophyIcon className="w-5 h-5 mr-2 text-[#101097] dark:text-blue-400" /> Plantilla de Alumnos ({teamPlayers.length})
                    </h4>
                    {teamPlayers.length === 0 ? (
                        <p className="text-sm text-slate-400 italic">No hay alumnos registrados en este equipo aún.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {teamPlayers.map((player, idx) => (
                                <div key={player.id} className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-900/40 px-3 py-2 rounded-xl text-sm border border-slate-100 dark:border-slate-800">
                                    <span className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900/40 text-[#101097] dark:text-blue-300 font-bold text-xs rounded-full flex items-center justify-center font-outfit">{idx + 1}</span>
                                    <span className="font-medium text-slate-700 dark:text-slate-200">{player.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Historial de Partidos */}
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                    <h4 className="text-base font-bold font-outfit text-slate-800 dark:text-white flex items-center">
                        <CalendarIcon className="w-5 h-5 mr-2 text-[#101097] dark:text-blue-400" /> Historial de Partidos ({teamMatches.length})
                    </h4>
                    {teamMatches.length === 0 ? (
                        <p className="text-sm text-slate-400 italic">No hay partidos registrados para este equipo.</p>
                    ) : (
                        <div className="space-y-2">
                            {teamMatches.map(m => {
                                const isHome = m.homeTeamId === team.id;
                                const oppId = isHome ? m.awayTeamId : m.homeTeamId;
                                const myScore = isHome ? m.scoreHome : m.scoreAway;
                                const oppScore = isHome ? m.scoreAway : m.scoreHome;
                                const isWin = myScore > oppScore;
                                const isLoss = myScore < oppScore;
                                const resultBadge = m.scoreHome === null ? 'Pendiente' : (isWin ? 'G' : (isLoss ? 'P' : 'E'));
                                const badgeColor = m.scoreHome === null ? 'bg-slate-200 text-slate-700' : (isWin ? 'bg-emerald-500 text-white' : (isLoss ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'));

                                return (
                                    <div key={m.id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl text-xs sm:text-sm border border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center space-x-2">
                                            <span className={`w-6 h-6 ${badgeColor} font-bold rounded-md flex items-center justify-center font-outfit text-xs`}>{resultBadge}</span>
                                            <span className="font-semibold text-slate-800 dark:text-white">{isHome ? 'vs' : '@'} {getTeamName(oppId)}</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-slate-400 font-mono">{m.date || 'Sin fecha'}</span>
                                            <span className="font-bold font-outfit text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-2 py-1 rounded-md shadow-sm border border-slate-200 dark:border-slate-700">
                                                {m.scoreHome !== null ? `${m.scoreHome} - ${m.scoreAway}` : 'vs'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
