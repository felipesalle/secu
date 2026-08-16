import React, { useState, useEffect } from 'react';
import { GILDAN_COLOR_PALETTE, getTeamShirtColor } from '../config/constants';
import { CloseIcon } from './Icons';

export const EditTeamModal = ({ show, team, allTeams, onClose, onSave }) => {
    const [teamName, setTeamName] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [shirtColorName, setShirtColorName] = useState('Royal');

    useEffect(() => {
        if (team) {
            setTeamName(team.name || '');
            setLogoUrl(team.logoUrl || '');
            const currentColor = getTeamShirtColor(team, allTeams);
            setShirtColorName(currentColor.name);
        }
    }, [team, allTeams]);

    if (!show || !team) return null;

    const selectedColorObj = GILDAN_COLOR_PALETTE.find(c => c.name === shirtColorName) || GILDAN_COLOR_PALETTE[0];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!teamName.trim()) return;
        onSave(team.id, teamName.trim(), logoUrl.trim(), selectedColorObj.name, selectedColorObj.hex);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full space-y-6 shadow-2xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
                    <h3 className="text-xl font-bold font-outfit text-slate-800 dark:text-white flex items-center">
                        <span>✏️ Editar Equipo y Playera</span>
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5 font-outfit">
                            Nombre del Equipo
                        </label>
                        <input
                            type="text"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            required
                            className="input-modern"
                            placeholder="Ej. Real Madrid"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5 font-outfit">
                            URL del Escudo / Logo
                        </label>
                        <input
                            type="url"
                            value={logoUrl}
                            onChange={(e) => setLogoUrl(e.target.value)}
                            className="input-modern"
                            placeholder="https://..."
                        />
                    </div>

                    <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-outfit">
                            👕 Color de Playera (Catálogo Gildan)
                        </label>
                        <div className="flex items-center space-x-3">
                            <span
                                className="w-9 h-9 rounded-full border-2 shadow-sm flex items-center justify-center shrink-0 transition-all duration-300"
                                style={{
                                    backgroundColor: selectedColorObj.hex,
                                    borderColor: selectedColorObj.border
                                }}
                                title={`Vista Previa: ${selectedColorObj.name}`}
                            >
                                <span className="text-xs">👕</span>
                            </span>

                            <select
                                value={shirtColorName}
                                onChange={(e) => setShirtColorName(e.target.value)}
                                className="input-modern font-bold text-sm py-2"
                            >
                                {GILDAN_COLOR_PALETTE.map(color => (
                                    <option key={color.name} value={color.name}>
                                        {color.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="submit" className="btn-primary flex-1 py-3">
                            Guardar Cambios
                        </button>
                        <button type="button" onClick={onClose} className="btn-secondary flex-1 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold rounded-xl">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
