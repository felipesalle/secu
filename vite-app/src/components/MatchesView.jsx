import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db, APP_ID } from '../config/firebase';
import { sendTelegramNotification, sortLeagues } from '../config/constants';
import { SportIcon, EditIcon } from './Icons';

export const MatchesView = ({ matches, leagues, teams, players, getLeagueName, getTeamName, getTeamLogo, getPlayersByTeam, showMessage, selectedDateFilter, selectedLeagueFilter, inaugurationDate, user }) => {
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [scoreHome, setScoreHome] = useState(0);
    const [scoreAway, setScoreAway] = useState(0);
    const [scorers, setScorers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    const handleEditMatch = (match) => {
        setSelectedMatch(match);
        setScoreHome(match.scoreHome !== null && match.scoreHome !== undefined ? match.scoreHome : 0);
        setScoreAway(match.scoreAway !== null && match.scoreAway !== undefined ? match.scoreAway : 0);
        setScorers(match.scorers || []);
        setIsEditing(true);
    };

    const handleSaveMatch = async () => {
        if (!selectedMatch) return;
        try {
            const matchRef = doc(db, `artifacts/${APP_ID}/public/data/matches`, selectedMatch.id);
            await setDoc(matchRef, {
                ...selectedMatch,
                scoreHome,
                scoreAway,
                scorers
            });
            const homeTeamName = getTeamName(selectedMatch.homeTeamId);
            const awayTeamName = getTeamName(selectedMatch.awayTeamId);
            const validScorers = (scorers || []).filter(s => s.playerId && s.count > 0);
            let scorersMessage = "";
            if (validScorers.length > 0) {
                scorersMessage = "\nAnotadores:\n" + validScorers.map(s => {
                    const pName = (players || []).find(p => p.id === s.playerId)?.name || 'Jugador';
                    const tName = getTeamName(s.teamId);
                    return `- ${pName} (${tName}): ${s.count}`;
                }).join('\n');
            }
            const notificationMessage = `Resultado de Partido Registrado\n\n` +
                `Liga: ${getLeagueName(selectedMatch.leagueId)}\n` + 
                `Fecha: ${selectedMatch.date}\n\n` + 
                `Resultado Final:\n` + 
                `${homeTeamName} ${scoreHome} - ${scoreAway} ${awayTeamName}\n` + 
                `${scorersMessage}`;
            sendTelegramNotification(notificationMessage, user?.email);

            setIsEditing(false);
            setSelectedMatch(null);
            showMessage("Partido actualizado con éxito.");
        } catch (e) {
            console.error("Error al guardar el partido:", e);
            showMessage("Error al guardar el partido.");
        }
    };

    const handleAddScorer = (teamId) => {
        setScorers(prev => [...prev, { playerId: '', teamId, count: 1 }]);
    };

    const handleScorerChange = (index, field, value) => {
        const newScorers = [...scorers];
        newScorers[index][field] = value;
        setScorers(newScorers);
    };

    const handleRemoveScorer = (index) => {
        setScorers(prev => prev.filter((_, i) => i !== index));
    };

    const handleNullifyMatch = async () => {
        if (!selectedMatch) return;
        if (confirm("¿Estás seguro de que quieres anular este partido? Se registrará como empate 0-0.")) {
            try {
                const matchRef = doc(db, `artifacts/${APP_ID}/public/data/matches`, selectedMatch.id);
                await setDoc(matchRef, {
                    ...selectedMatch,
                    scoreHome: 0,
                    scoreAway: 0,
                    scorers: [],
                    status: 'Anulado'
                });
                const notificationMessage = `Partido Anulado\n\n` +
                    `Liga: ${getLeagueName(selectedMatch.leagueId)}\n` +
                    `Fecha: ${selectedMatch.date}\n\n` +
                    `Partido:\n` +
                    `${getTeamName(selectedMatch.homeTeamId)} vs ${getTeamName(selectedMatch.awayTeamId)}\n\n` +
                    `El partido ha sido anulado y registrado como un empate 0-0.`;
                sendTelegramNotification(notificationMessage, user?.email);

                setIsEditing(false);
                setSelectedMatch(null);
                showMessage("Partido anulado con éxito (0-0).");
            } catch (e) {
                console.error("Error al anular el partido:", e);
                showMessage("Error al anular el partido.");
            }
        }
    };

    const filteredMatches = matches.filter(match => {
        const dateMatch = selectedDateFilter ? match.date === selectedDateFilter : true;
        const leagueMatch = selectedLeagueFilter ? match.leagueId === selectedLeagueFilter : true;
        return dateMatch && leagueMatch;
    });

    return (
        <div className="space-y-6">
            {isEditing && selectedMatch ? (
                <div className="bg-white dark:bg-slate-800/80 backdrop-blur-md p-8 rounded-3xl shadow-xl space-y-6 border-t-4 border-[#101097] animate-fade-in-up">
                    <h4 className="text-2xl font-bold font-outfit text-slate-900 dark:text-white">Editar Partido</h4>
                    <p className="text-slate-500 dark:text-slate-400 flex items-center">
                        <SportIcon sport={leagues.find(l => l.id === selectedMatch.leagueId)?.sport} />
                        {getLeagueName(selectedMatch.leagueId)} - {selectedMatch.date}
                    </p>
                    <div className="flex flex-wrap items-center gap-6 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl">
                        <div className="flex-1 min-w-[150px]">
                            <label className="text-sm font-medium text-slate-600 dark:text-slate-300 block mb-1">Local</label>
                            <div className="flex items-center gap-2">
                                <input type="number" min="0" value={scoreHome} onChange={(e) => setScoreHome(Math.max(0, parseInt(e.target.value, 10)))} className="input-modern text-center text-xl font-bold font-outfit w-20" />
                                <span className="font-bold text-slate-700 dark:text-slate-200 font-outfit">{getTeamName(selectedMatch.homeTeamId)}</span>
                            </div>
                        </div>
                        <div className="flex-1 min-w-[150px]">
                            <label className="text-sm font-medium text-slate-600 dark:text-slate-300 block mb-1">Visitante</label>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-700 dark:text-slate-200 font-outfit">{getTeamName(selectedMatch.awayTeamId)}</span>
                                <input type="number" min="0" value={scoreAway} onChange={(e) => setScoreAway(Math.max(0, parseInt(e.target.value, 10)))} className="input-modern text-center text-xl font-bold font-outfit w-20" />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h5 className="text-lg font-bold font-outfit text-slate-800 dark:text-slate-200">Anotadores</h5>
                        <div className="flex flex-wrap gap-2">
                            <button onClick={() => handleAddScorer(selectedMatch.homeTeamId)} className="btn-primary text-sm py-2 px-4">+ Local</button>
                            <button onClick={() => handleAddScorer(selectedMatch.awayTeamId)} className="btn-primary text-sm py-2 px-4">+ Visitante</button>
                        </div>
                        {scorers.map((scorer, index) => (
                            <div key={index} className="flex flex-wrap items-center gap-2 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                                <select value={scorer.playerId} onChange={(e) => handleScorerChange(index, 'playerId', e.target.value)} className="input-modern flex-1 min-w-[150px] py-2">
                                    <option value="">Selecciona jugador</option>
                                    {getPlayersByTeam(scorer.teamId).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                                <input type="number" min="1" value={scorer.count} onChange={(e) => handleScorerChange(index, 'count', parseInt(e.target.value, 10))} className="input-modern w-20 py-2 text-center" />
                                <button onClick={() => handleRemoveScorer(index)} className="btn-danger text-sm py-2 px-3">X</button>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <button onClick={handleSaveMatch} className="btn-primary flex-1">Guardar Marcador</button>
                        <button onClick={handleNullifyMatch} className="btn-danger flex-1">Anular Partido</button>
                        <button onClick={() => setIsEditing(false)} className="btn-secondary flex-1">Cancelar</button>
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    {filteredMatches.length === 0 ? (
                        <p className="text-center text-slate-500 dark:text-slate-400 py-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
                            No hay partidos para mostrar con los filtros aplicados.
                        </p>
                    ) : (
                        leagues
                            .filter(l => selectedLeagueFilter ? l.id === selectedLeagueFilter : true)
                            .sort(sortLeagues)
                            .map(league => {
                                const leagueMatches = filteredMatches
                                    .filter(m => m.leagueId === league.id)
                                    .sort((a, b) => new Date(a.date) - new Date(b.date));

                                if (leagueMatches.length === 0) return null;

                                return (
                                    <div key={league.id} className="bg-slate-50/70 dark:bg-slate-900/40 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 animate-fade-in-up">
                                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                                            <h4 className="text-lg font-bold font-outfit text-slate-900 dark:text-white flex items-center">
                                                <SportIcon sport={league.sport} />
                                                <span className="ml-2">{league.name}</span>
                                            </h4>
                                            <span className="text-xs font-bold font-outfit bg-indigo-50 dark:bg-indigo-900/40 text-[#101097] dark:text-blue-300 px-3 py-1 rounded-full">
                                                {leagueMatches.length} {leagueMatches.length === 1 ? 'partido' : 'partidos'}
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            {leagueMatches.map(match => {
                                                const isFriendly = match.isFriendly || (inaugurationDate && match.date && match.date < inaugurationDate);
                                                const homeLogo = getTeamLogo ? getTeamLogo(match.homeTeamId) : '';
                                                const awayLogo = getTeamLogo ? getTeamLogo(match.awayTeamId) : '';

                                                return (
                                                    <div
                                                        key={match.id}
                                                        className="bg-white dark:bg-slate-800 p-3.5 sm:p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 hover:shadow-md transition-all"
                                                    >
                                                        <div className="flex items-center justify-between sm:justify-start space-x-3 min-w-[130px]">
                                                            <p className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 font-outfit">
                                                                📅 {match.date}
                                                            </p>
                                                            {isFriendly ? (
                                                                <span className="text-[9px] sm:text-[10px] font-bold font-outfit uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60">
                                                                    🤝 Amistoso
                                                                </span>
                                                            ) : (
                                                                <span className="text-[9px] sm:text-[10px] font-bold font-outfit uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60">
                                                                    🏆 Oficial
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="flex-1 flex items-center justify-center space-x-2 sm:space-x-4">
                                                            {/* Equipo Local */}
                                                            <div className="flex-1 text-right flex items-center justify-end space-x-1.5 sm:space-x-2 min-w-0">
                                                                <span className="font-bold font-outfit text-slate-800 dark:text-white text-xs sm:text-base truncate">
                                                                    {getTeamName(match.homeTeamId)}
                                                                </span>
                                                                {homeLogo && (
                                                                    <img src={homeLogo} alt="" className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-contain bg-white p-0.5 shadow-sm shrink-0" />
                                                                )}
                                                            </div>

                                                            {/* Marcador Badge */}
                                                            <div className="bg-slate-100 dark:bg-slate-900 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-xl font-extrabold font-outfit text-sm sm:text-lg text-[#101097] dark:text-blue-400 min-w-[65px] sm:min-w-[80px] text-center shadow-inner shrink-0">
                                                                {match.scoreHome !== null ? `${match.scoreHome} - ${match.scoreAway}` : 'VS'}
                                                            </div>

                                                            {/* Equipo Visitante */}
                                                            <div className="flex-1 text-left flex items-center justify-start space-x-1.5 sm:space-x-2 min-w-0">
                                                                {awayLogo && (
                                                                    <img src={awayLogo} alt="" className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-contain bg-white p-0.5 shadow-sm shrink-0" />
                                                                )}
                                                                <span className="font-bold font-outfit text-slate-800 dark:text-white text-xs sm:text-base truncate">
                                                                    {getTeamName(match.awayTeamId)}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center space-x-2 justify-end pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-700/50">
                                                            <button
                                                                onClick={() => handleEditMatch(match)}
                                                                className="btn-primary text-xs py-1.5 px-3 flex items-center space-x-1"
                                                            >
                                                                <EditIcon className="w-3.5 h-3.5" />
                                                                <span>Editar</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
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
