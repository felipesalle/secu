import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { collection, onSnapshot, doc, setDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { db, auth, APP_ID } from './config/firebase';
import { sendTelegramNotification, CHAMPIONS_LEAGUE_CLUBS, sortLeagues, getSportScoringInfo, dayOptions, getUniqueDefaultShirtColor } from './config/constants';
import { PlusIcon, CalendarIcon, TrophyIcon, EditIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon, LockIcon, CloseIcon, FlagIcon, SportIcon } from './components/Icons';
import { Modal } from './components/Modal';
import { ClubSelectorModal } from './components/ClubSelectorModal';
import { TeamProfileModal } from './components/TeamProfileModal';
import { EditTeamModal } from './components/EditTeamModal';
import { SportsHeroBanner } from './components/SportsHeroBanner';
import { StandingsTable } from './components/StandingsTable';
import { ResultsList } from './components/ResultsList';
import { TopScorersTable } from './components/TopScorersTable';
import { LeagueCard } from './components/LeagueCard';
import { InteractiveCalendar } from './components/InteractiveCalendar';
import { MatchesView } from './components/MatchesView';
import { Ticker } from './components/Ticker';
import {
    calculateStandings,
    calculateTopScorers,
    generateUpcomingMatchesPdf,
    printUpcomingMatchesWindow,
    generateRefereeSheetPdf,
    printRefereeSheetWindow,
    generateStandingsAndTopScorersPdf,
    generateTeamsAndPlayersRosterPdf,
    printTeamsAndPlayersRosterWindow,
    printInaugurationMatches
} from './utils/pdfGenerator';
import { copyFacebookSummaryText, printFacebookSummaryWindow } from './utils/facebookPoster';

// Helper de formateo local seguro sin desfase de zona horaria (UTC offset)
const formatDateLocal = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Helper universal para obtener el Miércoles de cualquier fecha (Sábado, Domingo, Miércoles, etc.)
const getWednesdayForDate = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    if (!y || !m || !d) return null;
    const dateObj = new Date(y, m - 1, d);
    const dayOfWeek = dateObj.getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
    const diffToWed = 3 - dayOfWeek;
    dateObj.setDate(dateObj.getDate() + diffToWed);
    return formatDateLocal(dateObj);
};

export default function App() {
    // --- Estados Principales ---
    const [view, setView] = useState('standings');
    const [adminTab, setAdminTab] = useState('tournaments');
    
    const [tournaments, setTournaments] = useState([]);
    const [selectedTournamentId, setSelectedTournamentId] = useState('');
    const [leagues, setLeagues] = useState([]);
    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    const [matches, setMatches] = useState([]);

    // --- Filtros de Clasificación Públicos & Admin ---
    const [selectedStandingsLeagueFilter, setSelectedStandingsLeagueFilter] = useState('');
    const [selectedDateFilter, setSelectedDateFilter] = useState('');
    const [selectedLeagueFilter, setSelectedLeagueFilter] = useState('');
    const [scheduleStartDate, setScheduleStartDate] = useState('');
    const [inaugInputDate, setInaugInputDate] = useState('');

    // --- Autenticación y UI ---
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // Default to dark mode (true) unless explicitly saved as 'light'
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : true;
    });

    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [teamProfile, setTeamProfile] = useState(null);
    const [showClubModal, setShowClubModal] = useState(false);
    const [selectedTeamForClub, setSelectedTeamForClub] = useState(null);

    // --- Formulario de Torneos y Clonación ---
    const [newTournamentName, setNewTournamentName] = useState('');
    const [selectedSport, setSelectedSport] = useState('Fútbol');
    const [inaugurationDate, setInaugurationDate] = useState('');
    const [creationMode, setCreationMode] = useState('clone');
    const [cloneSourceTournamentId, setCloneSourceTournamentId] = useState('');
    const [isCreatingTournament, setIsCreatingTournament] = useState(false);

    // --- Formularios de Equipos y Jugadores ---
    const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
    const [selectedTeamForAddPlayer, setSelectedTeamForAddPlayer] = useState(null);
    const [newPlayerName, setNewPlayerName] = useState('');

    const [showEditTeamModal, setShowEditTeamModal] = useState(false);
    const [selectedTeamForEdit, setSelectedTeamForEdit] = useState(null);
    const [editTeamName, setEditTeamName] = useState('');

    // --- Reportes & Fechas ---
    const [upcomingMatchesDate, setUpcomingMatchesDate] = useState('');
    const [refereeMatchDate, setRefereeMatchDate] = useState('');

    // --- Efecto Tema Oscuro / Claro con persistencia ---
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    // --- Autenticación Firebase ---
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (usr) => {
            setUser(usr);
        });
        return () => unsubscribe();
    }, []);

    // --- Subscripción Real-Time a Firestore ---
    useEffect(() => {
        const collectionsList = ['tournaments', 'leagues', 'teams', 'players', 'matches'];
        const setters = {
            tournaments: setTournaments,
            leagues: setLeagues,
            teams: setTeams,
            players: setPlayers,
            matches: setMatches
        };

        const unsubscribers = collectionsList.map(collName => {
            const path = `artifacts/${APP_ID}/public/data/${collName}`;
            return onSnapshot(collection(db, path), (snapshot) => {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setters[collName](data);
            }, (error) => console.error(`Error loading ${collName}:`, error));
        });

        return () => unsubscribers.forEach(unsub => unsub());
    }, []);

    // --- Ordenar Torneos por Fecha de Creación (El más reciente primero) ---
    const sortedTournaments = useMemo(() => {
        return [...tournaments].sort((a, b) => {
            if (a.createdAt && b.createdAt) {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            const timeA = parseInt(a.id.replace(/\D/g, ''), 10) || 0;
            const timeB = parseInt(b.id.replace(/\D/g, ''), 10) || 0;
            return timeB - timeA;
        });
    }, [tournaments]);

    // Seleccionar automáticamente el torneo MÁS RECIENTE por defecto
    useEffect(() => {
        if (sortedTournaments.length > 0 && !selectedTournamentId) {
            setSelectedTournamentId(sortedTournaments[0].id);
        }
    }, [sortedTournaments, selectedTournamentId]);

    // Torneo Activo y Deporte Activo
    const currentTournament = useMemo(() => sortedTournaments.find(t => t.id === selectedTournamentId) || sortedTournaments[0], [sortedTournaments, selectedTournamentId]);
    const currentSport = currentTournament?.sport || 'Fútbol';

    useEffect(() => {
        if (currentTournament) {
            setInaugurationDate(currentTournament.inaugurationDate || '');
            setInaugInputDate(currentTournament.inaugurationDate || '');
        }
    }, [currentTournament]);

    const showMessage = (msg) => { setModalMessage(msg); setShowModal(true); };

    // --- Ayudantes de Datos Filtrados por Torneo Seleccionado ---
    const visibleLeagues = useMemo(() => leagues.filter(l => l.tournamentId === currentTournament?.id), [leagues, currentTournament]);
    const visibleTeams = useMemo(() => teams.filter(t => visibleLeagues.some(l => l.id === t.leagueId)), [teams, visibleLeagues]);
    const visiblePlayers = useMemo(() => players.filter(p => visibleTeams.some(t => t.id === p.teamId)), [players, visibleTeams]);
    const visibleMatches = useMemo(() => matches.filter(m => visibleLeagues.some(l => l.id === m.leagueId)), [matches, visibleLeagues]);

    const getTeamName = useCallback((teamId) => teams.find(t => t.id === teamId)?.name || 'Equipo Desconocido', [teams]);
    const getTeamLogo = useCallback((teamId) => teams.find(t => t.id === teamId)?.logoUrl || 'https://crests.football-data.org/86.png', [teams]);
    const getLeagueName = useCallback((leagueId) => leagues.find(l => l.id === leagueId)?.name || 'Liga Desconocida', [leagues]);
    const getPlayersByTeam = useCallback((teamId) => players.filter(p => p.teamId === teamId), [players]);

    // --- Cálculo Dinámico de Estadísticas para el Hero Banner ---
    const heroStats = useMemo(() => {
        const isFiltered = Boolean(selectedStandingsLeagueFilter);
        const targetLeagues = isFiltered 
            ? visibleLeagues.filter(l => l.id === selectedStandingsLeagueFilter)
            : visibleLeagues;
        const targetMatches = isFiltered 
            ? visibleMatches.filter(m => m.leagueId === selectedStandingsLeagueFilter)
            : visibleMatches;

        // 1. Encontrar Líder General o por Liga
        let topTeams = [];
        let maxPoints = -1;

        targetLeagues.forEach(league => {
            const standings = calculateStandings(league.id, visibleTeams, visibleMatches, currentTournament?.inaugurationDate);
            if (standings.length > 0) {
                const top = standings[0];
                if (top.points > maxPoints) {
                    maxPoints = top.points;
                    topTeams = [top.name];
                } else if (top.points === maxPoints && maxPoints > 0) {
                    if (!topTeams.includes(top.name)) {
                        topTeams.push(top.name);
                    }
                }
            }
        });

        const leaderTeam = topTeams.length > 0 ? topTeams.join(' / ') : 'Por definir';

        // 2. Encontrar Máximo Anotador General o por Liga
        let allScorers = [];
        targetLeagues.forEach(league => {
            const scorers = calculateTopScorers(league.id, visibleMatches, visiblePlayers, visibleTeams, currentTournament?.inaugurationDate);
            allScorers = [...allScorers, ...scorers];
        });
        allScorers.sort((a, b) => b.goals - a.goals);
        const topScorer = allScorers.length > 0 ? `${allScorers[0].playerName} (${allScorers[0].goals})` : 'Sin registro';

        // 3. Conteo de partidos jugados
        const totalMatchesPlayed = targetMatches.filter(m => m.scoreHome !== null && m.scoreHome !== undefined).length;

        // 4. Conteo total de puntos/goles
        const totalScores = targetMatches.reduce((acc, m) => acc + (m.scoreHome || 0) + (m.scoreAway || 0), 0);

        const scoringInfo = getSportScoringInfo(currentSport);

        return {
            leaderTeam,
            leaderTitle: isFiltered ? 'Líder de Liga' : 'Líder General',
            topScorer,
            scorerTitle: isFiltered ? 'Goleador de Liga' : scoringInfo.leaderTitle,
            totalMatchesPlayed,
            totalScores
        };
    }, [selectedStandingsLeagueFilter, visibleLeagues, visibleTeams, visibleMatches, visiblePlayers, currentTournament, currentSport]);

    // --- Lógica de Inicio de Sesión ---
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            sendTelegramNotification(`🔑 Inicio de Sesión Administrador en la App\nUsuario: ${email}`, email);
            showMessage("¡Bienvenido al Panel Administrador!");
        } catch (err) {
            console.error("Login error:", err);
            showMessage("Error de autenticación. Verifica tus credenciales.");
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        setUser(null);
        setView('standings');
        showMessage("Sesión cerrada.");
    };

    // --- Eliminación Completa de Torneo ---
    const handleDeleteTournament = async () => {
        if (!selectedTournamentId) return showMessage("Selecciona un torneo para eliminar.");
        const tObj = sortedTournaments.find(t => t.id === selectedTournamentId);
        if (confirm(`¿Estás seguro de que quieres eliminar el torneo "${tObj?.name || selectedTournamentId}"? Se borrarán todas sus ligas, equipos, alumnos y partidos.`)) {
            try {
                for (const m of visibleMatches) {
                    await deleteDoc(doc(db, `artifacts/${APP_ID}/public/data/matches`, m.id));
                }
                for (const p of visiblePlayers) {
                    await deleteDoc(doc(db, `artifacts/${APP_ID}/public/data/players`, p.id));
                }
                for (const t of visibleTeams) {
                    await deleteDoc(doc(db, `artifacts/${APP_ID}/public/data/teams`, t.id));
                }
                for (const l of visibleLeagues) {
                    await deleteDoc(doc(db, `artifacts/${APP_ID}/public/data/leagues`, l.id));
                }
                await deleteDoc(doc(db, `artifacts/${APP_ID}/public/data/tournaments`, selectedTournamentId));

                sendTelegramNotification(`🗑️ Torneo Eliminado (${tObj?.sport || 'Deporte'}): ${tObj?.name}`, user?.email);
                setSelectedTournamentId('');
                showMessage(`Torneo "${tObj?.name || ''}" eliminado con éxito.`);
            } catch (err) {
                console.error("Error al eliminar torneo:", err);
                showMessage("Error al eliminar el torneo.");
            }
        }
    };

    // --- Creación de Torneo y Clonación Completa ---
    const handleCreateTournament = async (e) => {
        e.preventDefault();
        const tName = newTournamentName.trim();
        if (!tName) return showMessage("Ingresa el nombre del torneo.");
        if (isCreatingTournament) return;

        setIsCreatingTournament(true);
        const tournamentId = 'tourn_' + Date.now();

        try {
            await setDoc(doc(db, `artifacts/${APP_ID}/public/data/tournaments`, tournamentId), {
                id: tournamentId,
                name: tName,
                sport: selectedSport,
                inaugurationDate: inaugurationDate || '',
                createdAt: new Date().toISOString()
            });

            let cloned = false;
            let copiedTeamsCount = 0;
            let copiedPlayersCount = 0;
            let sourceTournamentName = '';

            if (creationMode === 'clone' && sortedTournaments.length > 0) {
                const targetSourceId = cloneSourceTournamentId || sortedTournaments[0].id;
                const sourceTournament = sortedTournaments.find(t => t.id === targetSourceId) || sortedTournaments[0];
                sourceTournamentName = sourceTournament.name;

                const prevLeagues = leagues.filter(l => l.tournamentId === sourceTournament.id);
                if (prevLeagues.length > 0) {
                    cloned = true;
                    for (const prevLeague of prevLeagues) {
                        const newLeagueId = `league_${tournamentId}_${prevLeague.name.replace(/\s+/g, '_')}`;
                        await setDoc(doc(db, `artifacts/${APP_ID}/public/data/leagues`, newLeagueId), {
                            id: newLeagueId,
                            name: prevLeague.name,
                            sport: selectedSport,
                            tournamentId,
                            matchDay: prevLeague.matchDay || 3
                        });

                        const prevTeams = teams.filter(t => t.leagueId === prevLeague.id);
                        for (const prevTeam of prevTeams) {
                            copiedTeamsCount++;
                            const newTeamId = `team_${newLeagueId}_${prevTeam.id.split('_').pop() || Math.random().toString(36).substring(2,7)}`;
                            await setDoc(doc(db, `artifacts/${APP_ID}/public/data/teams`, newTeamId), {
                                id: newTeamId,
                                name: prevTeam.name,
                                leagueId: newLeagueId,
                                logoUrl: prevTeam.logoUrl || 'https://crests.football-data.org/86.png',
                                shirtColorName: prevTeam.shirtColorName || '',
                                shirtColorHex: prevTeam.shirtColorHex || ''
                            });

                            const prevPlayers = players.filter(p => p.teamId === prevTeam.id);
                            for (const prevPlayer of prevPlayers) {
                                copiedPlayersCount++;
                                const newPlayerId = 'player_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
                                await setDoc(doc(db, `artifacts/${APP_ID}/public/data/players`, newPlayerId), {
                                    id: newPlayerId,
                                    name: prevPlayer.name,
                                    teamId: newTeamId
                                });
                            }
                        }
                    }
                }
            }

            if (!cloned) {
                const defaultLeagues = ['Grupos A Varonil', 'Grupos A Femenil', 'Grupos B Varonil', 'Grupos B Femenil'];
                const sampleStudents = [
                    { name: 'Gabriel Santos', number: '10' },
                    { name: 'Mateo Hernández', number: '7' },
                    { name: 'Santiago López', number: '9' },
                    { name: 'Leonardo Ramírez', number: '11' },
                    { name: 'Diego Morales', number: '4' },
                    { name: 'Sofía Castro', number: '8' }
                ];
                for (const lName of defaultLeagues) {
                    const newLeagueId = `league_${tournamentId}_${lName.replace(/\s+/g, '_')}`;
                    await setDoc(doc(db, `artifacts/${APP_ID}/public/data/leagues`, newLeagueId), {
                        id: newLeagueId,
                        name: lName,
                        sport: selectedSport,
                        tournamentId,
                        matchDay: 3
                    });

                    for (let i = 1; i <= 4; i++) {
                        const newTeamId = `team_${newLeagueId}_${i}`;
                        const club = CHAMPIONS_LEAGUE_CLUBS[(i - 1 + Math.floor(Math.random() * CHAMPIONS_LEAGUE_CLUBS.length)) % CHAMPIONS_LEAGUE_CLUBS.length];
                        await setDoc(doc(db, `artifacts/${APP_ID}/public/data/teams`, newTeamId), {
                            id: newTeamId,
                            name: club.name,
                            leagueId: newLeagueId,
                            logoUrl: club.logoUrl,
                            shirtColorName: club.shirtColorName || 'Royal',
                            shirtColorHex: club.shirtColorHex || '#1565C0'
                        });

                        for (const s of sampleStudents) {
                            const newPlayerId = `player_${newTeamId}_${Math.random().toString(36).substring(2, 7)}`;
                            await setDoc(doc(db, `artifacts/${APP_ID}/public/data/players`, newPlayerId), {
                                id: newPlayerId,
                                name: s.name,
                                number: s.number,
                                teamId: newTeamId
                            });
                        }
                    }
                }
            }

            setNewTournamentName('');
            setSelectedTournamentId(tournamentId);

            if (cloned) {
                showMessage(`🎉 ¡Torneo "${tName}" creado! Se clonaron ${copiedTeamsCount} equipos y ${copiedPlayersCount} alumnos desde "${sourceTournamentName}".`);
                sendTelegramNotification(`🏆 Nuevo Torneo creado (${selectedSport}): ${tName} (Clonado de ${sourceTournamentName})`, user?.email);
            } else {
                showMessage(`🎉 Torneo "${tName}" creado exitosamente con la estructura base de Secundaria.`);
                sendTelegramNotification(`🏆 Nuevo Torneo creado (${selectedSport}): ${tName}`, user?.email);
            }
        } catch (err) {
            console.error("Error al crear torneo:", err);
            showMessage("Error al crear el torneo.");
        } finally {
            setIsCreatingTournament(false);
        }
    };

    // --- Helper para Próximo Miércoles Lectivo (Garantizando Calendario SEP) ---
    const getNextValidWednesday = (date) => {
        const result = new Date(date);
        const dayOfWeek = result.getDay();
        const daysUntilWednesday = (3 - dayOfWeek + 7) % 7;
        result.setDate(result.getDate() + daysUntilWednesday);

        const isVacation = (d) => {
            const month = d.getMonth();
            const day = d.getDate();
            if (month === 8 && day === 16) return true;
            if (month === 4 && day === 5) return true;
            if (month === 10 && day === 2) return true;
            if ((month === 11 && day >= 19) || (month === 0 && day <= 6)) return true;
            if ((month === 2 && day >= 22) || (month === 3 && day <= 9)) return true;
            if (month === 6 || month === 7) return true;
            return false;
        };

        while (isVacation(result)) {
            result.setDate(result.getDate() + 7);
        }
        return result;
    };

    // --- Generación Automática del Calendario Base del Torneo FLEXIBLE por Período de Inicio ---
    const generateSchedule = async () => {
        if (!scheduleStartDate) return showMessage("Por favor selecciona una fecha de inicio (Miércoles).");
        if (visibleLeagues.length === 0) return showMessage("No hay ligas en este torneo.");

        try {
            const [sy, sm, sd] = scheduleStartDate.split('-').map(Number);
            const startDateObj = new Date(sy, sm - 1, sd);
            const startYear = startDateObj.getFullYear();
            const startMonth = startDateObj.getMonth();
            let targetEndDate;

            if (startMonth >= 7) {
                targetEndDate = new Date(startYear, 11, 18);
            } else if (startMonth <= 2) {
                targetEndDate = new Date(startYear, 2, 27);
            } else {
                targetEndDate = new Date(startYear, 5, 30);
            }

            if (targetEndDate < startDateObj) {
                targetEndDate.setFullYear(targetEndDate.getFullYear() + 1);
            }

            let totalMatchesCreated = 0;
            const targetWednesday = currentTournament?.inaugurationDate ? getWednesdayForDate(currentTournament.inaugurationDate) : null;

            for (const league of visibleLeagues) {
                const leagueTeams = visibleTeams.filter(t => t.leagueId === league.id);
                if (leagueTeams.length < 2) continue;

                const numTeams = leagueTeams.length;
                const roundsPerCycle = numTeams % 2 === 0 ? numTeams - 1 : numTeams;
                let currentDate = getNextValidWednesday(startDateObj);
                let roundCounter = 0;

                while (currentDate <= targetEndDate) {
                    let teamList = [...leagueTeams];
                    if (numTeams % 2 !== 0) teamList.push(null);

                    const roundInCycle = roundCounter % (roundsPerCycle * 2);
                    for (let r = 0; r < roundInCycle; r++) {
                        teamList.splice(1, 0, teamList.pop());
                    }

                    for (let i = 0; i < teamList.length / 2; i++) {
                        const home = teamList[i];
                        const away = teamList[teamList.length - 1 - i];

                        if (home && away) {
                            const wednesdayStr = formatDateLocal(currentDate);
                            let assignedDate = wednesdayStr;
                            let isFriendlyMatch = false;

                            if (targetWednesday) {
                                if (wednesdayStr === targetWednesday) {
                                    assignedDate = currentTournament.inaugurationDate;
                                    isFriendlyMatch = false;
                                } else if (wednesdayStr < targetWednesday) {
                                    isFriendlyMatch = true;
                                } else {
                                    isFriendlyMatch = false;
                                }
                            }

                            const matchId = `match_${league.id}_${assignedDate}_${home.id}_vs_${away.id}`;

                            await setDoc(doc(db, `artifacts/${APP_ID}/public/data/matches`, matchId), {
                                id: matchId,
                                leagueId: league.id,
                                homeTeamId: roundInCycle % 2 === 0 ? home.id : away.id,
                                awayTeamId: roundInCycle % 2 === 0 ? away.id : home.id,
                                scoreHome: null,
                                scoreAway: null,
                                scorers: [],
                                date: assignedDate,
                                originalDate: wednesdayStr,
                                isFriendly: isFriendlyMatch,
                                status: 'Programado'
                            });

                            totalMatchesCreated++;
                        }
                    }

                    currentDate.setDate(currentDate.getDate() + 7);
                    currentDate = getNextValidWednesday(currentDate);
                    roundCounter++;
                }
            }

            sendTelegramNotification(`🗓️ Calendario Generado (${currentSport}): ${currentTournament?.name} (${totalMatchesCreated} partidos)`, user?.email);
            showMessage(`🎉 Calendario generado exitosamente. Se crearon ${totalMatchesCreated} partidos.`);
        } catch (e) {
            console.error("Error al generar calendario:", e);
            showMessage("Error al generar el calendario.");
        }
    };

    // --- Borrado del Calendario de Partidos del Torneo ---
    const handleDeleteSchedule = async () => {
        if (!visibleMatches.length) return showMessage("No hay partidos para borrar en este torneo.");
        if (confirm("¿Estás seguro de que deseas borrar TODOS los partidos y el calendario de este torneo?")) {
            try {
                for (const m of visibleMatches) {
                    await deleteDoc(doc(db, `artifacts/${APP_ID}/public/data/matches`, m.id));
                }
                sendTelegramNotification(`🗑️ Calendario Borrado (${currentSport}): ${currentTournament?.name}`, user?.email);
                showMessage("Calendario de partidos eliminado con éxito.");
            } catch (e) {
                console.error("Error al borrar calendario:", e);
                showMessage("Error al borrar el calendario.");
            }
        }
    };

    // --- Cambio / Remoción de Fecha de Inauguración Deportiva (Sábado) con Traslado Completo Universal ---
    const handleInaugurationChange = async (inaugDate) => {
        if (!currentTournament) return;
        try {
            await setDoc(doc(db, `artifacts/${APP_ID}/public/data/tournaments`, currentTournament.id), {
                ...currentTournament,
                inaugurationDate: inaugDate
            }, { merge: true });

            let movedCount = 0;
            let revertedCount = 0;
            const targetWednesday = inaugDate ? getWednesdayForDate(inaugDate) : null;

            if (targetWednesday) {
                setScheduleStartDate(targetWednesday);
            }

            for (const m of visibleMatches) {
                const matchWed = getWednesdayForDate(m.date) || getWednesdayForDate(m.originalDate);
                if (!matchWed) continue;

                let targetDate = matchWed;
                let isFriendlyMatch = false;

                if (targetWednesday && matchWed === targetWednesday) {
                    targetDate = inaugDate;
                    isFriendlyMatch = false;
                    movedCount++;
                } else {
                    targetDate = matchWed;
                    revertedCount++;
                    if (targetWednesday) isFriendlyMatch = matchWed < targetWednesday;
                    else isFriendlyMatch = false;
                }

                await setDoc(doc(db, `artifacts/${APP_ID}/public/data/matches`, m.id), {
                    date: targetDate,
                    originalDate: matchWed,
                    isFriendly: isFriendlyMatch
                }, { merge: true });
            }

            setInaugurationDate(inaugDate);
            sendTelegramNotification(`🎉 Inauguración Actualizada: ${currentTournament.name} (${inaugDate || 'Removida'})`, user?.email);
            if (inaugDate) showMessage(`🎉 Inauguración actualizada al Sábado ${inaugDate}. Se trasladaron los ${movedCount} partidos de la jornada al sábado (el miércoles quedó libre).`);
            else showMessage(`ℹ️ Fecha de inauguración removida. Todos los partidos han retornado a sus miércoles originales.`);
        } catch (e) {
            console.error("Error al actualizar inauguración:", e);
            showMessage("Error al actualizar la fecha de inauguración.");
        }
    };

    // --- Renderizado de Vista Pública ---
    const renderStandingsView = () => {
        const sortedLeagues = [...visibleLeagues].sort(sortLeagues);

        return (
            <div className="space-y-8 animate-fade-in">
                {/* Hero Banner por Deporte */}
                <SportsHeroBanner
                    sport={currentSport}
                    tournamentName={currentTournament?.name}
                    leaderTeam={heroStats.leaderTeam}
                    leaderTitle={heroStats.leaderTitle}
                    topScorer={heroStats.topScorer}
                    scorerTitle={heroStats.scorerTitle}
                    totalMatchesPlayed={heroStats.totalMatchesPlayed}
                    totalScores={heroStats.totalScores}
                />

                {/* Desplegables Principales (Torneo y Liga) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sortedTournaments.length > 0 ? (
                        <div className="card p-2 flex items-center space-x-2">
                            <span className="pl-4 text-xl">🏆</span>
                            <select value={currentTournament?.id || ''} onChange={(e) => setSelectedTournamentId(e.target.value)} className="bg-transparent p-3 font-bold font-outfit text-slate-800 dark:text-white focus:outline-none cursor-pointer w-full text-base">
                                {sortedTournaments.map(t => <option key={t.id} value={t.id}>{t.name} ({t.sport || 'Fútbol'})</option>)}
                            </select>
                        </div>
                    ) : (
                        <p className="text-center text-slate-500 dark:text-slate-400 py-6 bg-white dark:bg-slate-800/60 rounded-2xl shadow-sm col-span-full">No hay torneos creados aún.</p>
                    )}

                    {visibleLeagues.length > 0 && (
                        <div className="card p-2 flex items-center space-x-2">
                            <span className="pl-4 text-xl">⚽</span>
                            <select value={selectedStandingsLeagueFilter} onChange={(e) => setSelectedStandingsLeagueFilter(e.target.value)} className="bg-transparent p-3 font-bold font-outfit text-slate-800 dark:text-white focus:outline-none cursor-pointer w-full text-base">
                                <option value="">Todas las Ligas de Secundaria</option>
                                {visibleLeagues.sort(sortLeagues).map(league => <option key={league.id} value={league.id}>{league.name}</option>)}
                            </select>
                        </div>
                    )}
                </div>

                {/* Secciones por Liga (Layout Exacto: Clasificación e Marcadores a la Izquierda, Goleadores a la Derecha) */}
                {sortedLeagues
                    .filter(l => selectedStandingsLeagueFilter ? l.id === selectedStandingsLeagueFilter : true)
                    .map(league => {
                        const standings = calculateStandings(league.id, visibleTeams, visibleMatches, currentTournament?.inaugurationDate);
                        const leagueMatches = visibleMatches.filter(m => m.leagueId === league.id);
                        const leagueScorers = calculateTopScorers(league.id, visibleMatches, visiblePlayers, visibleTeams, currentTournament?.inaugurationDate);

                        return (
                            <div key={league.id} className="card p-6 md:p-8 space-y-6 animate-fade-in-up">
                                <div className="flex items-center border-b border-slate-100 dark:border-slate-700 pb-4">
                                    <h3 className="text-2xl font-bold font-outfit text-slate-900 dark:text-white flex items-center">
                                        <SportIcon sport={league.sport} /> {league.name}
                                    </h3>
                                    {league.sport && (
                                        <span className="ml-auto text-xs font-bold font-outfit text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full uppercase">
                                            {league.sport}
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0">
                                    {/* Columna Izquierda: Clasificación con Podio 3D y Últimos Marcadores (flex-1) */}
                                    <div className="flex-1 space-y-8">
                                        <div>
                                            <h4 className="text-lg font-bold font-outfit text-slate-800 dark:text-slate-200 mb-4 flex items-center">
                                                <TrophyIcon className="w-5 h-5 mr-2 text-amber-500" /> Clasificación con Podio 3D
                                            </h4>
                                            <StandingsTable standings={standings} onTeamClick={(t) => setTeamProfile(t)} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold font-outfit text-slate-800 dark:text-slate-200 mb-4 flex items-center">
                                                <CalendarIcon className="w-5 h-5 mr-2 text-[#101097] dark:text-blue-400" /> Últimos Marcadores
                                            </h4>
                                            <ResultsList matches={leagueMatches} getTeamName={getTeamName} getTeamLogo={getTeamLogo} />
                                        </div>
                                    </div>

                                    {/* Columna Derecha: Máximos Anotadores (lg:w-1/3) */}
                                    <div className="lg:w-1/3">
                                        <h4 className="text-lg font-bold font-outfit text-slate-800 dark:text-slate-200 mb-4 flex items-center">
                                            <TrophyIcon className="w-5 h-5 mr-2 text-red-500" /> Máximos Anotadores
                                        </h4>
                                        <TopScorersTable scorers={leagueScorers} sport={currentSport} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
        );
    };

    // --- Renderizado de Panel de Administración ---
    const renderAdminPanel = () => {
        if (!user) {
            return (
                <div className="max-w-md mx-auto card p-8 space-y-6 text-center animate-fade-in-up mt-10">
                    <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/40 text-[#101097] dark:text-blue-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold font-outfit shadow-inner">
                        <LockIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold font-outfit text-slate-900 dark:text-white">Acceso Administrador</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Inicia sesión para gestionar los torneos, plantillas y marcadores.</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4 text-left">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 font-outfit mb-1">Correo Electrónico</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-modern" placeholder="admin@lasalle.edu.mx" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 font-outfit mb-1">Contraseña</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-modern" placeholder="••••••••" />
                        </div>
                        <button type="submit" className="btn-primary w-full py-3">Ingresar al Panel</button>
                    </form>
                </div>
            );
        }

        return (
            <div className="space-y-8 animate-fade-in">
                {/* Navegación Sub-Admin Adaptativa */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/90 dark:bg-slate-800/80 p-3 sm:p-4 rounded-2xl shadow-md border border-slate-100 dark:border-slate-700/60">
                    <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none max-w-full">
                        <button onClick={() => setAdminTab('tournaments')} className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold font-outfit whitespace-nowrap shrink-0 transition-all ${adminTab === 'tournaments' ? 'bg-[#101097] text-white shadow-md' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300'}`}>
                            🏆 Torneos & Backup
                        </button>
                        <button onClick={() => setAdminTab('teams')} className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold font-outfit whitespace-nowrap shrink-0 transition-all ${adminTab === 'teams' ? 'bg-[#101097] text-white shadow-md' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300'}`}>
                            👥 Plantillas & Equipos
                        </button>
                        <button onClick={() => setAdminTab('schedule')} className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold font-outfit whitespace-nowrap shrink-0 transition-all ${adminTab === 'schedule' ? 'bg-[#101097] text-white shadow-md' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300'}`}>
                            ⚽ Calendario & Partidos
                        </button>
                        <button onClick={() => setAdminTab('reports')} className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold font-outfit whitespace-nowrap shrink-0 transition-all ${adminTab === 'reports' ? 'bg-[#101097] text-white shadow-md' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300'}`}>
                            📄 Reportes & PDFs
                        </button>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end space-x-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-700">
                        <span className="text-[11px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400 font-outfit truncate">● Admin ({user.email})</span>
                        <button onClick={handleLogout} className="btn-danger py-1.5 px-3 text-xs whitespace-nowrap">Cerrar Sesión</button>
                    </div>
                </div>

                {/* Sub-Pestaña 1: Torneos & Clonación */}
                {adminTab === 'tournaments' && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Card 1: Selección y Borrado de Torneo */}
                            <div className="card p-8 space-y-4">
                                <h3 className="text-xl font-bold font-outfit text-slate-800 dark:text-white flex items-center border-b border-slate-100 dark:border-slate-700 pb-3">
                                    Selección de Torneo
                                </h3>
                                {sortedTournaments.length > 0 ? (
                                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                                        <select
                                            value={currentTournament?.id || ''}
                                            onChange={(e) => setSelectedTournamentId(e.target.value)}
                                            className="input-modern flex-1"
                                        >
                                            {sortedTournaments.map(t => (
                                                <option key={t.id} value={t.id}>{t.name} ({t.sport || 'Fútbol'})</option>
                                            ))}
                                        </select>
                                        <button onClick={handleDeleteTournament} className="btn-danger flex items-center justify-center whitespace-nowrap">
                                            <TrashIcon className="w-5 h-5 mr-2" /> Eliminar
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-center text-slate-500 dark:text-slate-400 py-8 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                                        No hay torneos creados. Crea uno para empezar.
                                    </p>
                                )}
                            </div>

                            {/* Card 2: Crear Torneo y Clonar Equipos/Alumnos */}
                            <div className="card p-8 space-y-4">
                                <h3 className="text-xl font-bold font-outfit text-slate-800 dark:text-white flex items-center border-b border-slate-100 dark:border-slate-700 pb-3">
                                    🏆 Crear Nuevo Torneo de Secundaria
                                </h3>
                                <form onSubmit={handleCreateTournament} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1 font-outfit">Nombre del Torneo</label>
                                        <input
                                            type="text"
                                            value={newTournamentName}
                                            onChange={(e) => setNewTournamentName(e.target.value)}
                                            placeholder="Ej. Torneo Básquetbol Secundaria 2026"
                                            className="input-modern"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1 font-outfit">Disciplina Deportiva</label>
                                        <select value={selectedSport} onChange={(e) => setSelectedSport(e.target.value)} className="input-modern">
                                            <option value="Fútbol">⚽ Fútbol</option>
                                            <option value="Básquetbol">🏀 Básquetbol</option>
                                            <option value="Tocho">🏈 Tocho</option>
                                            <option value="Voleibol">🏐 Voleibol</option>
                                        </select>
                                    </div>

                                    {sortedTournaments.length > 0 && (
                                        <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-outfit">📋 Equipos y Alumnos del Ciclo Escolar</label>
                                            <div className="space-y-2">
                                                <label className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-200 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="creationMode"
                                                        value="clone"
                                                        checked={creationMode === 'clone'}
                                                        onChange={() => setCreationMode('clone')}
                                                        className="text-[#101097] focus:ring-[#101097]"
                                                    />
                                                    <span className="font-semibold">Clonar equipos y lista de alumnos de un torneo previo</span>
                                                </label>

                                                {creationMode === 'clone' && (
                                                    <div className="ml-6 pt-1">
                                                        <label className="block text-xs text-slate-500 mb-1">Selecciona el torneo origen a clonar:</label>
                                                        <select
                                                            value={cloneSourceTournamentId || (sortedTournaments[0] ? sortedTournaments[0].id : '')}
                                                            onChange={(e) => setCloneSourceTournamentId(e.target.value)}
                                                            className="input-modern text-sm py-2"
                                                        >
                                                            {sortedTournaments.map(t => (
                                                                <option key={t.id} value={t.id}>
                                                                    {t.name} ({t.sport || 'Fútbol'})
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}

                                                <label className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-200 cursor-pointer pt-1">
                                                    <input
                                                        type="radio"
                                                        name="creationMode"
                                                        value="default"
                                                        checked={creationMode === 'default'}
                                                        onChange={() => setCreationMode('default')}
                                                        className="text-[#101097] focus:ring-[#101097]"
                                                    />
                                                    <span>Crear torneo desde cero (con equipos por defecto)</span>
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isCreatingTournament}
                                        className={`btn-primary w-full flex items-center justify-center py-3 ${isCreatingTournament ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {isCreatingTournament ? (
                                            <span>Clonando y creando torneo...</span>
                                        ) : (
                                            <>
                                                <PlusIcon className="w-5 h-5 mr-2" />
                                                {creationMode === 'clone' && sortedTournaments.length > 0 ? 'Crear y Clonar Equipos' : 'Crear Torneo'}
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sub-Pestaña 2: Plantillas & Equipos */}
                {adminTab === 'teams' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {visibleLeagues.map(league => (
                                <LeagueCard
                                    key={league.id}
                                    league={league}
                                    teams={visibleTeams.filter(t => t.leagueId === league.id)}
                                    players={visiblePlayers}
                                    showMessage={showMessage}
                                    onMatchDayChange={async (lId, val) => {
                                        await setDoc(doc(db, `artifacts/${APP_ID}/public/data/leagues`, lId), { matchDay: parseInt(val, 10) }, { merge: true });
                                        showMessage("Día de juego actualizado.");
                                    }}
                                    onEditTeam={(t) => { setSelectedTeamForEdit(t); setEditTeamName(t.name); setShowEditTeamModal(true); }}
                                    onAddPlayers={(t) => { setSelectedTeamForAddPlayer(t); setShowAddPlayerModal(true); }}
                                    onAddNewTeam={async (lId) => {
                                        const name = prompt("Nombre del nuevo equipo:");
                                        if (name) {
                                            const existingLeagueTeams = visibleTeams.filter(t => t.leagueId === lId);
                                            const assignedColor = getUniqueDefaultShirtColor(existingLeagueTeams);
                                            await addDoc(collection(db, `artifacts/${APP_ID}/public/data/teams`), {
                                                name,
                                                leagueId: lId,
                                                logoUrl: 'https://crests.football-data.org/86.png',
                                                shirtColorName: assignedColor.name,
                                                shirtColorHex: assignedColor.hex
                                            });
                                            showMessage(`Equipo "${name}" (Playera ${assignedColor.name}) añadido.`);
                                        }
                                    }}
                                    onOpenCountrySelector={(t) => { setSelectedTeamForClub(t); setShowClubModal(true); }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Sub-Pestaña 3: Calendario & Partidos (Todas las 3 Tarjetas Completas) */}
                {adminTab === 'schedule' && (
                    <div className="space-y-8 animate-fade-in-up">
                        
                        {/* Card 1: Generar Calendario Base del Torneo */}
                        <div className="card p-8 space-y-6">
                            <h3 className="text-xl font-bold font-outfit text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center justify-between">
                                <span>Generar Calendario Base del Torneo</span>
                                <span className="text-xs font-bold font-outfit bg-indigo-100 dark:bg-indigo-900/40 text-[#101097] dark:text-blue-300 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                                    🏆 Deporte: {currentSport}
                                </span>
                            </h3>

                            {/* Sección de Fecha de Inauguración Deportiva (Sábado) */}
                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 p-4 rounded-2xl space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-1 font-outfit">
                                            🎉 Fecha de Inauguración Deportiva (Sábado)
                                        </label>
                                        <p className="text-xs text-amber-700 dark:text-amber-400">
                                            Al guardar el sábado de inauguración, los partidos del miércoles previo se trasladarán automáticamente a este día.
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <input
                                            type="date"
                                            value={inaugInputDate}
                                            onChange={(e) => setInaugInputDate(e.target.value)}
                                            className="input-modern bg-white dark:bg-slate-900 sm:w-44"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleInaugurationChange(inaugInputDate)}
                                            className="btn-primary text-xs py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md transition-all whitespace-nowrap"
                                            title="Guardar y aplicar fecha de inauguración"
                                        >
                                            💾 Guardar
                                        </button>
                                        {currentTournament?.inaugurationDate && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setInaugInputDate('');
                                                    handleInaugurationChange('');
                                                }}
                                                className="btn-danger text-xs py-2.5 px-3 whitespace-nowrap"
                                                title="Quitar fecha de inauguración y retornar partidos a miércoles"
                                            >
                                                ❌ Quitar
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {currentTournament?.inaugurationDate && (
                                    <div className="pt-2 border-t border-amber-200 dark:border-amber-800/40 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => printInaugurationMatches(visibleMatches, visibleLeagues, currentTournament.inaugurationDate, getTeamName, getTeamLogo, getLeagueName, showMessage)}
                                            className="btn-primary text-xs py-2 px-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-bold flex items-center shadow-sm hover:scale-105 transition-transform"
                                        >
                                            🖨️ Imprimir Rol de la Inauguración Deportiva ({currentTournament.inaugurationDate})
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1 font-outfit">
                                    Fecha de Inicio (Calendario Base - Miércoles)
                                </label>
                                <input
                                    type="date"
                                    value={scheduleStartDate}
                                    onChange={(e) => setScheduleStartDate(e.target.value)}
                                    className="input-modern"
                                />
                            </div>

                            <div className="flex flex-wrap gap-4 pt-2">
                                <button
                                    onClick={generateSchedule}
                                    className="btn-primary flex-1 min-w-[200px] flex items-center justify-center"
                                >
                                    <CalendarIcon className="w-5 h-5 mr-2" /> Generar Calendario Base
                                </button>
                                {visibleMatches.length > 0 && (
                                    <button
                                        onClick={handleDeleteSchedule}
                                        className="btn-danger flex-1 min-w-[200px] flex items-center justify-center"
                                    >
                                        <TrashIcon className="w-5 h-5 mr-2" /> Borrar Calendario del Torneo
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Card 2: Calendario Interactivo de Jornadas */}
                        <InteractiveCalendar
                            matches={visibleMatches}
                            selectedDateFilter={selectedDateFilter}
                            onSelectDate={(d) => setSelectedDateFilter(d)}
                            inaugurationDate={currentTournament?.inaugurationDate}
                        />

                        {/* Card 3: Administrar Partidos y Marcadores */}
                        <div className="card p-8 space-y-6">
                            <h3 className="text-xl font-bold font-outfit text-slate-800 dark:text-white flex items-center border-b border-slate-100 dark:border-slate-700 pb-3">
                                ⚽ Administrar Partidos y Marcadores
                            </h3>
                            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                                <select
                                    value={selectedLeagueFilter}
                                    onChange={(e) => setSelectedLeagueFilter(e.target.value)}
                                    className="input-modern flex-1"
                                >
                                    <option value="">Filtrar por Liga</option>
                                    {visibleLeagues.sort(sortLeagues).map(league => (
                                        <option key={league.id} value={league.id}>{league.name}</option>
                                    ))}
                                </select>
                                <select
                                    value={selectedDateFilter}
                                    onChange={(e) => setSelectedDateFilter(e.target.value)}
                                    className="input-modern flex-1"
                                >
                                    <option value="">Filtrar por Fecha</option>
                                    {[...new Set(visibleMatches.map(m => m.date))].filter(Boolean).sort().map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                            <MatchesView
                                matches={visibleMatches}
                                leagues={visibleLeagues}
                                teams={visibleTeams}
                                players={visiblePlayers}
                                getLeagueName={getLeagueName}
                                getTeamName={getTeamName}
                                getTeamLogo={getTeamLogo}
                                getPlayersByTeam={getPlayersByTeam}
                                showMessage={showMessage}
                                selectedDateFilter={selectedDateFilter}
                                selectedLeagueFilter={selectedLeagueFilter}
                                inaugurationDate={currentTournament?.inaugurationDate}
                                user={user}
                            />
                        </div>

                    </div>
                )}

                {/* Sub-Pestaña 4: Reportes & PDFs (Todas las 5 Tarjetas Completas) */}
                {adminTab === 'reports' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up">
                        
                        {/* Card 1: Próximos Partidos */}
                        <div className="card p-6 space-y-4 border-t-4 border-blue-600 shadow-md">
                            <h3 className="text-xl font-bold font-outfit text-slate-800 dark:text-white flex items-center border-b border-slate-100 dark:border-slate-700 pb-3">
                                🗓️ Reporte de Próximos Partidos (con Escudos)
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Genera una lámina imprimible o PDF con el rol de juegos programados para una fecha específica, incluyendo los escudos de cada equipo.
                            </p>
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 font-outfit">
                                    Selecciona la Fecha del Partido:
                                </label>
                                <input 
                                    type="date" 
                                    value={upcomingMatchesDate} 
                                    onChange={(e) => setUpcomingMatchesDate(e.target.value)} 
                                    className="input-modern" 
                                />
                                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                                    <button 
                                        onClick={() => generateUpcomingMatchesPdf(visibleMatches, visibleLeagues, upcomingMatchesDate, currentSport, getTeamName, getTeamLogo, showMessage)} 
                                        className="btn-primary flex-1 flex items-center justify-center text-sm"
                                    >
                                        📄 Descargar PDF
                                    </button>
                                    <button 
                                        onClick={() => printUpcomingMatchesWindow(visibleMatches, visibleLeagues, upcomingMatchesDate, currentSport, getTeamName, getTeamLogo, showMessage)} 
                                        className="btn-secondary flex-1 flex items-center justify-center text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-all cursor-pointer"
                                    >
                                        🖨️ Vista Previa e Imprimir
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Cédulas de Arbitraje */}
                        <div className="card p-6 space-y-4 border-t-4 border-purple-600 shadow-md">
                            <h3 className="text-xl font-bold font-outfit text-slate-800 dark:text-white flex items-center border-b border-slate-100 dark:border-slate-700 pb-3">
                                ⚖️ Cédulas Oficiales de Arbitraje
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Imprime las cédulas de arbitraje para la mesa de control con listas de alumnos, casillas de goles/puntos, observaciones y firmas.
                            </p>
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 font-outfit">
                                    Selecciona la Fecha de los Partidos:
                                </label>
                                <input 
                                    type="date" 
                                    value={refereeMatchDate} 
                                    onChange={(e) => setRefereeMatchDate(e.target.value)} 
                                    className="input-modern" 
                                />
                                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                                    <button 
                                        onClick={() => generateRefereeSheetPdf(visibleMatches, visiblePlayers, visibleLeagues, refereeMatchDate, getLeagueName, getTeamName, getTeamLogo, getPlayersByTeam, showMessage)} 
                                        className="btn-primary flex-1 flex items-center justify-center text-sm"
                                    >
                                        📄 Descargar PDF Cédulas
                                    </button>
                                    <button 
                                        onClick={() => printRefereeSheetWindow(visibleMatches, visiblePlayers, visibleLeagues, refereeMatchDate, getLeagueName, getTeamName, getTeamLogo, getPlayersByTeam, showMessage)} 
                                        className="btn-secondary flex-1 flex items-center justify-center text-sm bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-all cursor-pointer"
                                    >
                                        🖨️ Vista Previa e Imprimir
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Card 3: Tabla de Clasificación y Tabla de Goleo */}
                        <div className="card p-6 space-y-4 border-t-4 border-emerald-600 shadow-md lg:col-span-2">
                            <h3 className="text-xl font-bold font-outfit text-slate-800 dark:text-white flex items-center border-b border-slate-100 dark:border-slate-700 pb-3">
                                📊 Reporte General de Clasificaciones y Máximos Anotadores
                            </h3>
                            <div className="p-5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="space-y-1 text-center md:text-left">
                                    <h4 className="font-bold text-slate-800 dark:text-white font-outfit">Informe Completo del Torneo</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Exporta en formato PDF la tabla general de posiciones actualizada de todas las ligas de Secundaria y la tabla de goleo individual.
                                    </p>
                                </div>
                                <button 
                                    onClick={() => generateStandingsAndTopScorersPdf(visibleLeagues, visibleTeams, visibleMatches, visiblePlayers, selectedTournamentId, showMessage)} 
                                    className="btn-primary whitespace-nowrap px-6 py-3 text-sm bg-gradient-to-r from-emerald-600 to-teal-700"
                                >
                                    🏆 Generar PDF de Clasificación y Goleo
                                </button>
                            </div>
                        </div>

                        {/* Card 4: Roster de Inscripción de Alumnos */}
                        <div className="card p-6 space-y-4 border-t-4 border-indigo-600 shadow-md lg:col-span-2">
                            <h3 className="text-xl font-bold font-outfit text-slate-800 dark:text-white flex items-center border-b border-slate-100 dark:border-slate-700 pb-3">
                                📋 Cédula de Inscripción: Equipos y Jugadores por Liga
                            </h3>
                            <div className="p-5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Genera la lista oficial y ordenada de todas las ligas, mostrando cada equipo con su escudo asignado (Champions League) y la nómina completa de alumnos inscritos.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <button 
                                        onClick={() => generateTeamsAndPlayersRosterPdf(visibleLeagues, visibleTeams, visiblePlayers, selectedTournamentId, showMessage)} 
                                        className="btn-primary flex-1 min-w-[220px] flex items-center justify-center text-sm"
                                    >
                                        📄 Descargar PDF Roster Completo
                                    </button>
                                    <button 
                                        onClick={() => printTeamsAndPlayersRosterWindow(visibleLeagues, visibleTeams, visiblePlayers, showMessage)} 
                                        className="btn-primary flex-1 min-w-[220px] flex items-center justify-center text-sm bg-gradient-to-r from-indigo-700 to-blue-800"
                                    >
                                        🖨️ Imprimir / Vista Previa Roster (HTML)
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Card 5: Resumen de la Jornada para Redes Sociales */}
                        <div className="card p-6 space-y-4 border-t-4 border-amber-500 shadow-md lg:col-span-2">
                            <h3 className="text-xl font-bold font-outfit text-slate-800 dark:text-white flex items-center border-b border-slate-100 dark:border-slate-700 pb-3">
                                📱 Resumen de la Jornada para Redes Sociales (Facebook / Instagram)
                            </h3>
                            <div className="p-5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Genera la tarjeta visual del resumen semanal con los partidos jugados por grupo, máximos anotadores (incluyendo empates) y la programación completa de la próxima jornada.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <button 
                                        onClick={() => printFacebookSummaryWindow(visibleMatches, visibleLeagues, visibleTeams, visiblePlayers, upcomingMatchesDate, currentSport, showMessage)} 
                                        className="btn-primary flex-1 min-w-[220px] flex items-center justify-center text-sm bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold"
                                    >
                                        📷 Generar Tarjeta Visual (Vista Previa / Imprimir)
                                    </button>
                                    <button 
                                        onClick={() => copyFacebookSummaryText(visibleMatches, visibleLeagues, visibleTeams, visiblePlayers, upcomingMatchesDate, currentSport, getTeamName, showMessage)} 
                                        className="btn-secondary flex-1 min-w-[220px] flex items-center justify-center text-sm bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 px-4 rounded-xl shadow-md transition-all cursor-pointer"
                                    >
                                        📋 Copiar Texto Formateado para Facebook
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-300">
            {/* Header Principal */}
            <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex items-center space-x-2.5 sm:space-x-3">
                        <img src="https://i.imgur.com/pbiHVPL.png" alt="Logo Colegio La Salle" className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-md" />
                        <div>
                            <div className="flex items-center space-x-1.5 sm:space-x-2">
                                <h1 className="text-base sm:text-lg md:text-xl font-black font-outfit text-[#101097] dark:text-blue-400 leading-none">
                                    Ligas <span className="text-[#CE0E2D]">La Salle</span>
                                </h1>
                                <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest px-1.5 sm:px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-[#101097] dark:text-blue-300 font-outfit">
                                    SECUNDARIA
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Switcher de Vistas Adaptativo */}
                    <div className="flex items-center space-x-1.5 sm:space-x-3">
                        <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center space-x-1 border border-slate-200/60 dark:border-slate-700/60">
                            <button 
                                onClick={() => setView('standings')} 
                                className={`px-2.5 sm:px-4 py-1.5 rounded-lg text-xs font-bold font-outfit flex items-center space-x-1 transition-all ${view === 'standings' ? 'bg-[#101097] text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-[#101097]'}`}
                            >
                                <span>⭐</span>
                                <span className="text-[11px] sm:text-xs">Clasificación</span>
                            </button>
                            <button 
                                onClick={() => setView('admin')} 
                                className={`px-2.5 sm:px-4 py-1.5 rounded-lg text-xs font-bold font-outfit flex items-center space-x-1 transition-all ${view === 'admin' ? 'bg-[#101097] text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-[#101097]'}`}
                            >
                                <span>🔒</span>
                                <span className="text-[11px] sm:text-xs">Admin</span>
                            </button>
                        </div>

                        <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:scale-105 transition-all text-xs sm:text-sm" title="Cambiar Tema">
                            {darkMode ? '☀️' : '🌙'}
                        </button>

                        {user && (
                            <button onClick={handleLogout} className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-sm">
                                Salir
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Ticker Bar para Próximos Partidos */}
            <Ticker matches={visibleMatches} getTeamName={getTeamName} />

            {/* Contenido Principal */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {view === 'standings' ? renderStandingsView() : renderAdminPanel()}
            </main>

            {/* Modales */}
            <Modal show={showModal} message={modalMessage} onClose={() => setShowModal(false)} />
            <TeamProfileModal team={teamProfile} players={visiblePlayers} matches={visibleMatches} getTeamName={getTeamName} onClose={() => setTeamProfile(null)} />
            <ClubSelectorModal
                show={showClubModal}
                onClose={() => setShowClubModal(false)}
                onSelectClub={async (club) => {
                    if (selectedTeamForClub) {
                        await setDoc(doc(db, `artifacts/${APP_ID}/public/data/teams`, selectedTeamForClub.id), {
                            logoUrl: club.logoUrl,
                            clubId: club.id,
                            shirtColorName: club.shirtColorName || 'Royal',
                            shirtColorHex: club.shirtColorHex || '#1565C0'
                        }, { merge: true });
                        showMessage(`Club ${club.name} (Playera ${club.shirtColorName || ''}) asignado a ${selectedTeamForClub.name}.`);
                    }
                }}
            />

            <EditTeamModal
                show={showEditTeamModal}
                team={selectedTeamForEdit}
                allTeams={teams}
                onClose={() => setShowEditTeamModal(false)}
                onSave={async (teamId, name, logoUrl, shirtColorName, shirtColorHex) => {
                    try {
                        await setDoc(doc(db, `artifacts/${APP_ID}/public/data/teams`, teamId), {
                            name,
                            logoUrl,
                            shirtColorName,
                            shirtColorHex
                        }, { merge: true });
                        showMessage(`Equipo "${name}" y playera (${shirtColorName}) actualizados.`);
                    } catch (err) {
                        console.error("Error al actualizar equipo:", err);
                        showMessage("Error al guardar cambios.");
                    }
                }}
            />

            {/* Modal Añadir Jugador */}
            {showAddPlayerModal && selectedTeamForAddPlayer && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-100 dark:border-slate-700">
                        <h4 className="text-xl font-bold font-outfit text-slate-800 dark:text-white">Añadir Alumno a {selectedTeamForAddPlayer.name}</h4>
                        <input
                            type="text"
                            placeholder="Nombre del alumno (ej. Gabriel Santos)"
                            value={newPlayerName}
                            onChange={(e) => setNewPlayerName(e.target.value)}
                            className="input-modern"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={async () => {
                                    if (newPlayerName.trim()) {
                                        await addDoc(collection(db, `artifacts/${APP_ID}/public/data/players`), {
                                            name: newPlayerName.trim(),
                                            teamId: selectedTeamForAddPlayer.id
                                        });
                                        setNewPlayerName('');
                                        setShowAddPlayerModal(false);
                                        showMessage("Alumno añadido con éxito.");
                                    }
                                }}
                                className="btn-primary flex-1"
                            >
                                Guardar Alumno
                            </button>
                            <button onClick={() => setShowAddPlayerModal(false)} className="btn-secondary flex-1">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
