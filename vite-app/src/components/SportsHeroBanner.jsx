import React from 'react';
import { getSportScoringInfo } from '../config/constants';

export const SportsHeroBanner = ({ sport = 'Fútbol', tournamentName, leaderTeam, leaderTitle = 'Líder General', topScorer, scorerTitle, totalMatchesPlayed, totalScores }) => {
    const scoringInfo = getSportScoringInfo(sport);
    const resolvedScorerTitle = scorerTitle || scoringInfo.leaderTitle;

    let bgGradient = 'from-[#101097] via-[#1a1ad9] to-[#001466]';
    if (sport === 'Básquetbol') bgGradient = 'from-amber-700 via-orange-600 to-amber-900';
    else if (sport === 'Tocho') bgGradient = 'from-rose-800 via-red-700 to-rose-950';
    else if (sport === 'Voleibol') bgGradient = 'from-teal-700 via-emerald-600 to-teal-900';

    return (
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${bgGradient} p-6 md:p-10 text-white shadow-2xl transition-all duration-500 border border-white/10`}>
            {/* Elementos Decorativos de Fondo */}
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute left-1/3 -top-12 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                    <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-bold font-outfit uppercase tracking-wider">
                        <span>{scoringInfo.emoji}</span>
                        <span>{sport}</span>
                        <span className="text-white/40">•</span>
                        <span className="text-amber-300">Torneo La Salle Secundaria</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black font-outfit tracking-tight leading-none text-white drop-shadow-md">
                        {tournamentName || `Ligas La Salle — ${sport}`}
                    </h2>
                    <p className="text-sm md:text-base text-white/80 font-medium font-outfit max-w-xl">
                        Sigue los resultados en vivo, tabla de posiciones y anotadores de las ligas escolares de La Salle Tuxtla.
                    </p>
                </div>

                <div className="flex-shrink-0 text-7xl md:text-8xl select-none filter drop-shadow-2xl animate-bounce-slow">
                    {scoringInfo.emoji}
                </div>
            </div>

            {/* Barra de Estadísticas Rápidas (Quick Stats Counter) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/15">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                    <p className="text-xs uppercase tracking-wider font-bold text-slate-300 font-outfit">{leaderTitle}</p>
                    <p className="text-base md:text-lg font-extrabold font-outfit truncate mt-1 text-yellow-300">{leaderTeam || 'Por definir'}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                    <p className="text-xs uppercase tracking-wider font-bold text-slate-300 font-outfit">{resolvedScorerTitle}</p>
                    <p className="text-base md:text-lg font-extrabold font-outfit truncate mt-1 text-amber-200">
                        {scoringInfo.noScorers ? 'No aplica' : (topScorer || 'Sin registro')}
                    </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                    <p className="text-xs uppercase tracking-wider font-bold text-slate-300 font-outfit">Partidos Jugados</p>
                    <p className="text-2xl md:text-3xl font-extrabold font-outfit mt-1">{totalMatchesPlayed || 0}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                    <p className="text-xs uppercase tracking-wider font-bold text-slate-300 font-outfit">Total de {scoringInfo.unit}</p>
                    <p className="text-2xl md:text-3xl font-extrabold font-outfit mt-1 text-emerald-300">{totalScores || 0}</p>
                </div>
            </div>
        </div>
    );
};
