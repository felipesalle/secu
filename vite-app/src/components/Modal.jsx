import React from 'react';

export const Modal = ({ show, message, onClose }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl border border-slate-100 dark:border-slate-700/60">
                <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/40 text-[#101097] dark:text-blue-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold font-outfit shadow-inner">
                    📣
                </div>
                <p className="text-slate-700 dark:text-slate-200 font-semibold font-outfit text-base leading-relaxed">{message}</p>
                <button onClick={onClose} className="btn-primary w-full py-3">Entendido</button>
            </div>
        </div>
    );
};
