import React, { useState } from 'react';
import { CHAMPIONS_LEAGUE_CLUBS } from '../config/constants';
import { CloseIcon, FlagIcon } from './Icons';

export const ClubSelectorModal = ({ show, onClose, onSelectClub }) => {
    const [searchQuery, setSearchQuery] = useState('');
    if (!show) return null;

    const filteredClubs = CHAMPIONS_LEAGUE_CLUBS.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.country.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 max-w-2xl w-full space-y-6 shadow-2xl border border-slate-100 dark:border-slate-700/60 max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
                    <h3 className="text-xl font-bold font-outfit text-slate-800 dark:text-white flex items-center">
                        <span className="mr-2 text-2xl">⚽</span> Asignar Club Oficial de Champions League
                    </h3>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <CloseIcon />
                    </button>
                </div>

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar por equipo o país (ej. Real Madrid, España)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-modern bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 pl-4 py-3"
                    />
                </div>

                <div className="overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pr-1">
                    {filteredClubs.map(club => (
                        <button
                            key={club.id}
                            onClick={() => { onSelectClub(club); onClose(); }}
                            className="flex items-center space-x-3 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/70 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:border-indigo-200 dark:hover:border-indigo-700 transition-all text-left group"
                        >
                            <img src={club.logoUrl} alt={club.name} className="w-10 h-10 object-contain rounded-full bg-white p-1 shadow-sm group-hover:scale-110 transition-transform" />
                            <div className="min-w-0 flex-1">
                                <p className="font-bold text-sm text-slate-800 dark:text-white truncate font-outfit">{club.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center mt-0.5">
                                    <FlagIcon className="w-3 h-3 mr-1 text-slate-400" /> {club.country}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const CountrySelectorModal = ClubSelectorModal;
