import React, { useState } from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { db, APP_ID } from '../config/firebase';
import { dayOptions } from '../config/constants';
import { SportIcon, ChevronDownIcon, ChevronUpIcon, EditIcon, TrashIcon, PlusIcon } from './Icons';

export const LeagueCard = ({ league, teams, players, showMessage, onMatchDayChange, onEditTeam, onAddPlayers, onAddNewTeam, onOpenCountrySelector }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleDeletePlayer = async (playerId) => {
        if (confirm("¿Estás seguro de que quieres eliminar a este alumno de la plantilla?")) {
            try {
                await deleteDoc(doc(db, `artifacts/${APP_ID}/public/data/players`, playerId));
                showMessage("Alumno eliminado con éxito.");
            } catch (e) {
                console.error("Error al eliminar alumno:", e);
                showMessage("Error al eliminar.");
            }
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 transition-all duration-300">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h4 className="text-xl font-bold font-outfit text-slate-900 dark:text-white flex items-center">
                    <SportIcon sport={league.sport} /> {league.name}
                </h4>
                <div className="flex items-center space-x-3">
                    <select
                        value={league.matchDay ?? ''}
                        onChange={(e) => onMatchDayChange(league.id, e.target.value)}
                        className="input-modern text-sm py-2 w-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <option value="">-- Día de Juego --</option>
                        {dayOptions.map(day => <option key={day.value} value={day.value}>{day.label}</option>)}
                    </select>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-2 text-[#101097] hover:text-[#2a2ad9] dark:text-blue-400 bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md transition-all"
                        aria-label="Expandir"
                    >
                        {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </button>
                </div>
            </div>
            {isExpanded && (
                <div className="mt-6 space-y-6">
                    {teams.map(team => (
                        <div key={team.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/60 space-y-3">
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <div className="flex items-center space-x-3">
                                    <img src={team.logoUrl} alt={`Logo de ${team.name}`} className="w-10 h-10 rounded-full shadow-md object-contain bg-white p-0.5" />
                                    <span className="font-bold font-outfit text-slate-800 dark:text-white text-lg">{team.name}</span>
                                    <button onClick={() => onEditTeam(team)} className="text-slate-400 hover:text-blue-500 p-1 rounded-full hover:bg-blue-50 transition-colors" title="Editar Nombre/Logo">
                                        <EditIcon className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => onOpenCountrySelector(team)} className="text-xs py-1.5 px-3 bg-indigo-50 dark:bg-indigo-900/30 text-[#101097] dark:text-blue-300 font-bold rounded-lg hover:bg-indigo-100 transition-colors font-outfit flex items-center space-x-1" title="Asignar Club de Champions League">
                                        <span>⚽ Cambiar Club (Champions)</span>
                                    </button>
                                </div>
                                <button onClick={() => onAddPlayers(team)} className="btn-primary text-xs py-2 px-4">Añadir Jugadores</button>
                            </div>
                            <ul className="list-none text-slate-600 dark:text-slate-300 space-y-2 mt-2 pl-0">
                                {players.filter(p => p.teamId === team.id).length > 0 ? (
                                    players.filter(p => p.teamId === team.id).map(player => (
                                        <li key={player.id} className="flex items-center justify-between text-sm bg-slate-50 dark:bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-100 dark:border-slate-800">
                                            <span className="font-medium">{player.name}</span>
                                            <button onClick={() => handleDeletePlayer(player.id)} className="text-red-400 hover:text-[#CE0E2D] p-1 rounded-full hover:bg-red-50 transition-colors" aria-label="Eliminar"><TrashIcon className="w-4 h-4" /></button>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-sm text-slate-400 italic px-4 py-2">No hay alumnos registrados en este equipo.</li>
                                )}
                            </ul>
                        </div>
                    ))}
                    <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700 flex justify-center">
                        <button onClick={() => onAddNewTeam(league.id)} className="btn-primary flex items-center text-sm">
                            <PlusIcon className="w-4 h-4 mr-2" /> Añadir Nuevo Equipo
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
