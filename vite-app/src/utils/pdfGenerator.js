import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getSportScoringInfo, getTeamShirtColor } from '../config/constants';

export const calculateStandings = (leagueId, teams, matches, inaugurationDate) => {
    const leagueTeams = teams.filter(t => t.leagueId === leagueId);
    const leagueMatches = matches.filter(m => m.leagueId === leagueId);

    const standings = leagueTeams.map(team => {
        let played = 0, wins = 0, draws = 0, losses = 0, goalsFor = 0, goalsAgainst = 0;

        leagueMatches.forEach(m => {
            if (m.scoreHome === null || m.scoreHome === undefined || m.scoreAway === null || m.scoreAway === undefined) return;
            if (m.isFriendly) return;

            const isHome = m.homeTeamId === team.id;
            const isAway = m.awayTeamId === team.id;

            if (isHome) {
                played++;
                goalsFor += m.scoreHome;
                goalsAgainst += m.scoreAway;
                if (m.scoreHome > m.scoreAway) wins++;
                else if (m.scoreHome === m.scoreAway) draws++;
                else losses++;
            } else if (isAway) {
                played++;
                goalsFor += m.scoreAway;
                goalsAgainst += m.scoreHome;
                if (m.scoreAway > m.scoreHome) wins++;
                else if (m.scoreHome === m.scoreAway) draws++;
                else losses++;
            }
        });

        const goalDifference = goalsFor - goalsAgainst;
        const points = (wins * 3) + (draws * 1);

        return {
            id: team.id,
            name: team.name,
            logoUrl: team.logoUrl,
            shirtColorName: team.shirtColorName,
            shirtColorHex: team.shirtColorHex,
            played,
            wins,
            draws,
            losses,
            goalsFor,
            goalsAgainst,
            goalDifference,
            points
        };
    });

    standings.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
        return a.name.localeCompare(b.name);
    });

    return standings;
};

export const calculateTopScorers = (leagueId, matches, players, teams, inaugurationDate) => {
    const leagueMatches = matches.filter(m => m.leagueId === leagueId);
    const playerGoalsMap = {};

    leagueMatches.forEach(m => {
        if (m.isFriendly) return;
        if (Array.isArray(m.scorers)) {
            m.scorers.forEach(s => {
                if (!s.playerId) return;
                const goalsCount = parseInt(s.goals, 10) || 1;
                playerGoalsMap[s.playerId] = (playerGoalsMap[s.playerId] || 0) + goalsCount;
            });
        }
    });

    const scorersList = [];
    Object.keys(playerGoalsMap).forEach(playerId => {
        const player = players.find(p => p.id === playerId);
        if (player) {
            const team = teams.find(t => t.id === player.teamId);
            scorersList.push({
                playerId,
                playerName: player.name,
                teamName: team?.name || 'Equipo Desconocido',
                teamLogo: team?.logoUrl || '',
                goals: playerGoalsMap[playerId]
            });
        }
    });

    scorersList.sort((a, b) => b.goals - a.goals || a.playerName.localeCompare(b.playerName));
    return scorersList;
};

// --- ROL DE PRÓXIMOS PARTIDOS CON ESCUDOS Y DISEÑO PREMIUM ---
export const printUpcomingMatchesWindow = (visMatches, visLeagues, targetDate, sport, getTeamName, getTeamLogo, showMessage, autoPrint = false) => {
    const matchesToPrint = targetDate ? visMatches.filter(m => m.date === targetDate) : visMatches;
    if (matchesToPrint.length === 0) {
        if (showMessage) showMessage("No hay partidos programados para la fecha seleccionada.");
        return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        if (showMessage) showMessage("Por favor permite las ventanas emergentes para imprimir.");
        return;
    }

    let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Rol de Partidos — ${sport.toUpperCase()} (${targetDate || 'GENERAL'})</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 25px; color: #1e293b; background: #fff; }
                .header { text-align: center; border-bottom: 3px solid #101097; padding-bottom: 15px; margin-bottom: 25px; }
                .logo-school { width: 52px; height: 52px; object-fit: contain; margin-bottom: 8px; }
                h1 { color: #101097; margin: 0 0 5px 0; font-size: 24px; font-weight: 800; }
                h2 { color: #d97706; margin: 0; font-size: 16px; font-weight: 700; }
                p.date { color: #475569; font-size: 14px; font-weight: 600; margin-top: 5px; }
                table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                th { background-color: #101097; color: white; text-align: left; padding: 10px 12px; font-size: 13px; font-weight: 800; }
                td { padding: 12px 10px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; }
                tr:nth-child(even) { background-color: #f8fafc; }
                .team-cell-right { display: flex; align-items: center; justify-content: flex-end; gap: 10px; }
                .team-cell-left { display: flex; align-items: center; justify-content: flex-start; gap: 10px; }
                .team-logo { width: 30px; height: 30px; object-fit: contain; border-radius: 50%; background: #fff; padding: 2px; border: 1px solid #cbd5e1; flex-shrink: 0; }
                .vs-badge { background: #e0e7ff; color: #101097; padding: 4px 10px; border-radius: 8px; font-weight: 900; font-size: 12px; }
                .status-badge { background: #d1fae5; color: #047857; padding: 4px 10px; border-radius: 20px; font-weight: 700; font-size: 12px; display: inline-block; }
                @media print {
                    .no-print { display: none !important; }
                    body { padding: 0; }
                }
            </style>
        </head>
        <body>
            <div class="no-print" style="margin-bottom: 20px; text-align: right;">
                <button onclick="window.print()" style="padding: 10px 24px; background: #101097; color: white; border: none; border-radius: 10px; font-weight: 800; font-size: 14px; cursor: pointer;">🖨️ Guardar como PDF / Imprimir Rol</button>
            </div>
            <div class="header">
                <img src="https://i.imgur.com/pbiHVPL.png" class="logo-school" alt="La Salle Logo" />
                <h1>LIGAS LA SALLE TUXTLA — SECUNDARIA</h1>
                <h2>🗓️ ROL OFICIAL DE PRÓXIMOS PARTIDOS (${sport.toUpperCase()})</h2>
                <p class="date">📅 Fecha: ${targetDate || 'Programación General'}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th style="width: 20%;">Liga</th>
                        <th style="text-align: right; width: 32%;">Equipo Local</th>
                        <th style="text-align: center; width: 8%;">vs</th>
                        <th style="text-align: left; width: 32%;">Equipo Visitante</th>
                        <th style="text-align: center; width: 8%;">Estado</th>
                    </tr>
                </thead>
                <tbody>
    `;

    matchesToPrint.forEach(m => {
        const league = visLeagues.find(l => l.id === m.leagueId);
        const homeName = getTeamName(m.homeTeamId);
        const awayName = getTeamName(m.awayTeamId);
        const homeLogo = getTeamLogo(m.homeTeamId);
        const awayLogo = getTeamLogo(m.awayTeamId);

        htmlContent += `
            <tr>
                <td><strong>${league?.name || 'Liga'}</strong></td>
                <td>
                    <div class="team-cell-right">
                        <span style="font-weight: 800; color: #0f172a;">${homeName}</span>
                        <img src="${homeLogo}" class="team-logo" alt="" />
                    </div>
                </td>
                <td style="text-align: center;"><span class="vs-badge">VS</span></td>
                <td>
                    <div class="team-cell-left">
                        <img src="${awayLogo}" class="team-logo" alt="" />
                        <span style="font-weight: 800; color: #0f172a;">${awayName}</span>
                    </div>
                </td>
                <td style="text-align: center;"><span class="status-badge">${m.status || 'Programado'}</span></td>
            </tr>
        `;
    });

    htmlContent += `
                </tbody>
            </table>
            ${autoPrint ? `<script>window.onload = function() { setTimeout(function() { window.print(); }, 400); };</script>` : ''}
        </body>
        </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
};

export const generateUpcomingMatchesPdf = (visMatches, visLeagues, targetDate, sport, getTeamName, getTeamLogo, showMessage) => {
    printUpcomingMatchesWindow(visMatches, visLeagues, targetDate, sport, getTeamName, getTeamLogo, showMessage, true);
};

// --- ROL DE INAUGURACIÓN DEPORTIVA ---
export const printInaugurationMatches = (visMatches, visLeagues, inaugDate, getTeamName, getTeamLogo, getLeagueName, showMessage) => {
    if (!inaugDate) {
        if (showMessage) showMessage("Por favor primero selecciona la fecha de inauguración deportiva.");
        return;
    }
    const inaugMatches = visMatches.filter(m => m.date === inaugDate);
    if (inaugMatches.length === 0) {
        if (showMessage) showMessage(`No hay partidos asignados para el día de la inauguración (${inaugDate}).`);
        return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        if (showMessage) showMessage("Por favor permite las ventanas emergentes para imprimir.");
        return;
    }

    let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Rol de Partidos — Inauguración Deportiva</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 25px; color: #1e293b; background: #fff; }
                .header { text-align: center; border-bottom: 3px solid #101097; padding-bottom: 15px; margin-bottom: 25px; }
                .logo-school { width: 52px; height: 52px; object-fit: contain; margin-bottom: 8px; }
                h1 { color: #101097; margin: 0 0 5px 0; font-size: 24px; font-weight: 800; }
                h2 { color: #d97706; margin: 0; font-size: 18px; font-weight: 700; }
                p.date { color: #475569; font-size: 14px; font-weight: 600; margin-top: 5px; }
                .badge { background: #fef3c7; color: #92400e; border: 1px solid #fcd34d; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 12px; display: inline-block; }
                table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 30px; }
                th { background-color: #101097; color: white; text-align: left; padding: 10px; font-size: 13px; }
                td { padding: 12px 10px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; }
                tr:nth-child(even) { background-color: #f8fafc; }
                .team-logo { width: 28px; height: 28px; object-fit: contain; border-radius: 50%; background: #fff; padding: 1px; border: 1px solid #cbd5e1; }
                @media print { .no-print { display: none; } }
            </style>
        </head>
        <body>
            <div class="no-print" style="margin-bottom: 20px; text-align: right;">
                <button onclick="window.print()" style="padding: 10px 24px; background: #101097; color: white; border: none; border-radius: 10px; font-weight: 800; font-size: 14px; cursor: pointer;">🖨️ Guardar como PDF / Imprimir Rol de Inauguración</button>
            </div>
            <div class="header">
                <img src="https://i.imgur.com/pbiHVPL.png" class="logo-school" alt="La Salle Logo" />
                <h1>LIGAS LA SALLE TUXTLA — SECUNDARIA</h1>
                <h2>🎉 ROL OFICIAL DE PARTIDOS DE INAUGURACIÓN DEPORTIVA</h2>
                <p class="date">📅 Fecha del Evento: ${new Date(inaugDate + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <span class="badge">🤝 Partidos Amistosos de Apertura (Sin Puntos para Tabla)</span>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Liga</th>
                        <th style="text-align: right;">Equipo Local</th>
                        <th style="text-align: center;">vs</th>
                        <th style="text-align: left;">Equipo Visitante</th>
                        <th style="text-align: center;">Tipo</th>
                    </tr>
                </thead>
                <tbody>
    `;

    inaugMatches.forEach(m => {
        const homeName = getTeamName ? getTeamName(m.homeTeamId) : 'Local';
        const awayName = getTeamName ? getTeamName(m.awayTeamId) : 'Visitante';
        const homeLogo = getTeamLogo ? getTeamLogo(m.homeTeamId) : '';
        const awayLogo = getTeamLogo ? getTeamLogo(m.awayTeamId) : '';
        const league = visLeagues.find(l => l.id === m.leagueId);

        htmlContent += `
            <tr>
                <td>${league?.name || 'Liga'}</td>
                <td style="text-align: right;">
                    <span style="font-weight: 800; margin-right: 8px;">${homeName}</span>
                    <img src="${homeLogo}" class="team-logo" style="vertical-align: middle;" alt="" />
                </td>
                <td style="text-align: center; color: #101097; font-weight: 800;">VS</td>
                <td style="text-align: left;">
                    <img src="${awayLogo}" class="team-logo" style="vertical-align: middle; margin-right: 8px;" alt="" />
                    <span style="font-weight: 800;">${awayName}</span>
                </td>
                <td style="text-align: center;"><span style="color: #b45309; font-weight: 700; font-size: 12px;">🏆 Oficial</span></td>
            </tr>
        `;
    });

    htmlContent += `
                </tbody>
            </table>
        </body>
        </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
};

// --- CÉDULAS DE ARBITRAJE CON NÓMINA DE ALUMNOS, TARJETAS, GOLES Y COLORES DE PLAYERA GILDAN ---
export const printRefereeSheetWindow = (visMatches, visPlayers, visLeagues, targetDate, getLeagueName, getTeamName, getTeamLogo, getPlayersByTeam, showMessage, autoPrint = false, visTeams = []) => {
    const matchesToPrint = targetDate ? visMatches.filter(m => m.date === targetDate) : visMatches;
    if (matchesToPrint.length === 0) {
        if (showMessage) showMessage("No hay partidos programados para la fecha seleccionada.");
        return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        if (showMessage) showMessage("Por favor permite las ventanas emergentes para imprimir.");
        return;
    }

    let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Cédulas de Partido — Arbitraje</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 25px; color: #0f172a; background: #fff; max-width: 840px; margin: 0 auto; }
                .card-container { page-break-inside: avoid; border: 2px solid #101097; border-radius: 16px; padding: 20px; margin-bottom: 35px; background: #fff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
                .logo-school { width: 44px; height: 44px; object-fit: contain; margin-bottom: 4px; }
                .main-title { text-align: center; font-size: 20px; font-weight: 800; color: #101097; margin-bottom: 4px; }
                .sub-header { display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; color: #334155; border-bottom: 2px solid #101097; padding-bottom: 6px; margin-bottom: 16px; }
                .match-teams { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; padding: 0 10px; }
                .team-left { display: flex; align-items: center; gap: 10px; width: 42%; }
                .team-right { display: flex; align-items: center; justify-content: flex-end; gap: 10px; width: 42%; text-align: right; }
                .team-logo { width: 36px; height: 36px; object-fit: contain; border-radius: 50%; background: #fff; padding: 2px; border: 1px solid #cbd5e1; flex-shrink: 0; }
                .team-name { font-size: 15px; font-weight: 800; color: #0f172a; }
                .vs-badge { font-size: 13px; font-weight: 900; color: #101097; background: #e0e7ff; padding: 4px 10px; border-radius: 8px; }
                .players-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
                .table-header { background: #101097; color: white; padding: 6px 10px; font-weight: 800; font-size: 11px; display: flex; justify-content: space-between; border-radius: 6px 6px 0 0; }
                .players-list { border: 1px solid #cbd5e1; border-top: none; padding: 4px 8px; border-radius: 0 0 6px 6px; background: #fafafa; }
                .player-row { display: flex; justify-content: space-between; align-items: center; font-size: 11px; font-weight: 600; padding: 3.5px 0; border-bottom: 1px solid #e2e8f0; }
                .player-row:last-child { border-bottom: none; }
                .box-cell { width: 22px; height: 18px; border: 1px solid #94a3b8; border-radius: 3px; display: inline-block; text-align: center; line-height: 18px; font-size: 10px; font-weight: bold; background: #fff; }
                .footer-row { display: flex; justify-content: space-between; gap: 15px; margin-top: 12px; font-size: 12px; font-weight: 700; }
                .score-box { flex: 1; display: flex; align-items: center; gap: 8px; }
                .score-input { width: 55px; height: 26px; border: 1.5px solid #0f172a; border-radius: 4px; }
                .obs-box { flex: 2; display: flex; align-items: center; gap: 8px; }
                .obs-input { flex: 1; height: 26px; border: 1.5px solid #cbd5e1; border-radius: 4px; }
                .signatures { display: flex; justify-content: space-around; margin-top: 25px; }
                .sig-line { width: 180px; border-top: 1px solid #94a3b8; text-align: center; font-size: 11px; color: #64748b; padding-top: 4px; }
                @media print { .no-print { display: none !important; } }
            </style>
        </head>
        <body>
            <div class="no-print" style="margin-bottom: 20px; text-align: right;">
                <button onclick="window.print()" style="padding: 10px 24px; background: #7c3aed; color: white; border: none; border-radius: 10px; font-weight: 800; font-size: 14px; cursor: pointer;">🖨️ Guardar como PDF / Imprimir Cédulas</button>
            </div>
    `;

    const defaultStudentNames = [
        'Gabriel Santos',
        'Mateo Hernández',
        'Santiago López',
        'Leonardo Ramírez',
        'Diego Morales',
        'Sofía Castro'
    ];

    matchesToPrint.forEach(m => {
        const homeName = getTeamName(m.homeTeamId);
        const awayName = getTeamName(m.awayTeamId);
        const homeLogo = getTeamLogo(m.homeTeamId);
        const awayLogo = getTeamLogo(m.awayTeamId);
        const leagueName = getLeagueName(m.leagueId);
        
        const homeTeamObj = visTeams ? visTeams.find(t => t.id === m.homeTeamId) : null;
        const awayTeamObj = visTeams ? visTeams.find(t => t.id === m.awayTeamId) : null;
        const homeShirtColor = getTeamShirtColor(homeTeamObj, visTeams);
        const awayShirtColor = getTeamShirtColor(awayTeamObj, visTeams);

        let homePlayers = getPlayersByTeam ? getPlayersByTeam(m.homeTeamId) : [];
        if (homePlayers.length === 0 && visPlayers) {
            homePlayers = visPlayers.filter(p => p.teamId === m.homeTeamId);
        }

        let awayPlayers = getPlayersByTeam ? getPlayersByTeam(m.awayTeamId) : [];
        if (awayPlayers.length === 0 && visPlayers) {
            awayPlayers = visPlayers.filter(p => p.teamId === m.awayTeamId);
        }

        const renderPlayerTable = (pList, teamTitle, shirtColor) => {
            const displayList = pList.length > 0 
                ? pList 
                : defaultStudentNames.map((n, i) => ({ name: n, number: [7, 10, 9, 11, 4, 8][i] }));

            const rowCount = Math.max(displayList.length, 8);
            let rowsHtml = '';
            for (let i = 0; i < rowCount; i++) {
                const player = displayList[i];
                const nameStr = player ? player.name : '________________________';
                const numStr = player?.number ? player.number : '';
                rowsHtml += `
                    <div class="player-row">
                        <span style="color: #0f172a; font-weight: 700;">${i + 1}. ${nameStr}</span>
                        <div style="display: flex; gap: 4px; align-items: center;">
                            <span class="box-cell" title="Número">${numStr}</span>
                            <span class="box-cell" title="Goles"></span>
                            <span class="box-cell" title="Tarjeta Amarilla (TA)" style="background: #fef08a; border-color: #ca8a04;"></span>
                            <span class="box-cell" title="Tarjeta Roja (TR)" style="background: #fecdd3; border-color: #e11d48;"></span>
                        </div>
                    </div>
                `;
            }
            return `
                <div>
                    <div class="table-header" style="justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span>${teamTitle}</span>
                            <span style="background-color: ${shirtColor.hex}; color: ${shirtColor.isLight ? '#000' : '#fff'}; border: 1px solid ${shirtColor.border}; padding: 1px 6px; border-radius: 6px; font-size: 9px; font-weight: 800;">👕 ${shirtColor.name}</span>
                        </div>
                        <span>Nº | G | TA | TR</span>
                    </div>
                    <div class="players-list">
                        ${rowsHtml}
                    </div>
                </div>
            `;
        };

        htmlContent += `
            <div class="card-container">
                <div style="text-align: center;">
                    <img src="https://i.imgur.com/pbiHVPL.png" class="logo-school" alt="" />
                    <div class="main-title">LIGAS LA SALLE TUXTLA — SECUNDARIA</div>
                </div>
                <div class="sub-header">
                    <span>📋 CÉDULA OFICIAL DE ARBITRAJE</span>
                    <span>LIGA: ${leagueName.toUpperCase()}</span>
                    <span>FECHA: ${m.date || targetDate || 'Programado'}</span>
                </div>
                <div class="match-teams">
                    <div class="team-left">
                        <img src="${homeLogo}" class="team-logo" alt="" />
                        <span class="team-name">${homeName}</span>
                    </div>
                    <div class="vs-badge">VS</div>
                    <div class="team-right">
                        <span class="team-name">${awayName}</span>
                        <img src="${awayLogo}" class="team-logo" alt="" />
                    </div>
                </div>
                <div class="players-grid">
                    ${renderPlayerTable(homePlayers, 'Jugadores Local', homeShirtColor)}
                    ${renderPlayerTable(awayPlayers, 'Jugadores Visitante', awayShirtColor)}
                </div>
                <div class="footer-row">
                    <div class="score-box"><span>Marcador Final:</span><div class="score-input"></div></div>
                    <div class="obs-box"><span>Observaciones:</span><div class="obs-input"></div></div>
                </div>
                <div class="signatures">
                    <div class="sig-line">Firma Árbitro</div>
                    <div class="sig-line">Firma Capitán Local</div>
                    <div class="sig-line">Firma Capitán Visitante</div>
                </div>
            </div>
        `;
    });

    htmlContent += `
            ${autoPrint ? `<script>window.onload = function() { setTimeout(function() { window.print(); }, 400); };</script>` : ''}
        </body>
        </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
};

export const generateRefereeSheetPdf = (visMatches, visPlayers, visLeagues, targetDate, getLeagueName, getTeamName, getTeamLogo, getPlayersByTeam, showMessage, visTeams = []) => {
    printRefereeSheetWindow(visMatches, visPlayers, visLeagues, targetDate, getLeagueName, getTeamName, getTeamLogo, getPlayersByTeam, showMessage, true, visTeams);
};

// --- REPORTE DE CLASIFICACIÓN Y GOLEO CON ESCUDOS Y PODIO ---
export const printStandingsAndTopScorersWindow = (visLeagues, visTeams, visMatches, visPlayers, tournamentId, showMessage, autoPrint = false) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        if (showMessage) showMessage("Por favor permite las ventanas emergentes para imprimir.");
        return;
    }

    let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Clasificación y Goleo — Ligas La Salle</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 25px; color: #0f172a; background: #fff; }
                .header { text-align: center; border-bottom: 3px solid #101097; padding-bottom: 15px; margin-bottom: 25px; }
                .logo-school { width: 52px; height: 52px; object-fit: contain; margin-bottom: 8px; }
                h1 { color: #101097; margin: 0 0 5px 0; font-size: 24px; font-weight: 800; }
                h2 { color: #d97706; margin: 0; font-size: 16px; font-weight: 700; }
                .league-block { page-break-inside: avoid; margin-bottom: 35px; }
                .league-title { font-size: 18px; font-weight: 800; color: #101097; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 15px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
                th { background-color: #101097; color: white; text-align: center; padding: 8px 6px; font-weight: 800; }
                th.left { text-align: left; }
                td { padding: 8px 6px; border-bottom: 1px solid #e2e8f0; font-weight: 600; text-align: center; }
                td.left { text-align: left; }
                tr:nth-child(even) { background-color: #f8fafc; }
                .team-cell { display: flex; align-items: center; gap: 8px; }
                .team-logo { width: 24px; height: 24px; object-fit: contain; border-radius: 50%; background: #fff; border: 1px solid #cbd5e1; flex-shrink: 0; }
                .pos-1 { background: #fef3c7; font-weight: 800; }
                .pos-2 { background: #f1f5f9; font-weight: 800; }
                .pos-3 { background: #fff7ed; font-weight: 800; }
                .grid-2 { display: grid; grid-template-columns: 2.2fr 1fr; gap: 20px; }
                @media print { .no-print { display: none !important; } }
            </style>
        </head>
        <body>
            <div class="no-print" style="margin-bottom: 20px; text-align: right;">
                <button onclick="window.print()" style="padding: 10px 24px; background: #101097; color: white; border: none; border-radius: 10px; font-weight: 800; font-size: 14px; cursor: pointer;">🖨️ Guardar como PDF / Imprimir Reporte</button>
            </div>
            <div class="header">
                <img src="https://i.imgur.com/pbiHVPL.png" class="logo-school" alt="La Salle Logo" />
                <h1>LIGAS LA SALLE TUXTLA — SECUNDARIA</h1>
                <h2>🏆 REPORTE OFICIAL DE CLASIFICACIÓN Y MÁXIMOS ANOTADORES</h2>
            </div>
    `;

    visLeagues.forEach(league => {
        const standings = calculateStandings(league.id, visTeams, visMatches);
        const scorers = calculateTopScorers(league.id, visMatches, visPlayers, visTeams);
        if (standings.length === 0) return;

        htmlContent += `
            <div class="league-block">
                <div class="league-title">⚽ ${league.name} (${league.sport || 'Fútbol'})</div>
                <div class="grid-2">
                    <div>
                        <h4 style="margin: 0 0 10px 0; color: #101097; font-size: 14px;">📊 Tabla de Posiciones</h4>
                        <table>
                            <thead>
                                <tr>
                                    <th style="width: 30px;">#</th>
                                    <th class="left">Equipo</th>
                                    <th>PJ</th>
                                    <th>G</th>
                                    <th>E</th>
                                    <th>P</th>
                                    <th>GF</th>
                                    <th>GC</th>
                                    <th>DG</th>
                                    <th style="background: #0f172a;">PTS</th>
                                </tr>
                            </thead>
                            <tbody>
        `;

        standings.forEach((t, idx) => {
            const posClass = idx === 0 ? 'pos-1' : idx === 1 ? 'pos-2' : idx === 2 ? 'pos-3' : '';
            const logo = t.logoUrl || 'https://crests.football-data.org/86.png';
            htmlContent += `
                <tr class="${posClass}">
                    <td><strong>${idx + 1}</strong></td>
                    <td class="left">
                        <div class="team-cell">
                            <img src="${logo}" class="team-logo" alt="" />
                            <span>${t.name}</span>
                        </div>
                    </td>
                    <td>${t.played}</td>
                    <td>${t.wins}</td>
                    <td>${t.draws}</td>
                    <td>${t.losses}</td>
                    <td>${t.goalsFor}</td>
                    <td>${t.goalsAgainst}</td>
                    <td>${t.goalDifference > 0 ? '+' + t.goalDifference : t.goalDifference}</td>
                    <td style="font-weight: 900; color: #101097;">${t.points}</td>
                </tr>
            `;
        });

        htmlContent += `
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h4 style="margin: 0 0 10px 0; color: #b45309; font-size: 14px;">🏆 Goleadores / Anotadores</h4>
                        <table>
                            <thead>
                                <tr>
                                    <th style="width: 30px;">#</th>
                                    <th class="left">Alumno</th>
                                    <th style="background: #b45309;">Goles</th>
                                </tr>
                            </thead>
                            <tbody>
        `;

        if (scorers.length > 0) {
            scorers.slice(0, 5).forEach((s, sIdx) => {
                htmlContent += `
                    <tr>
                        <td><strong>${sIdx + 1}</strong></td>
                        <td class="left">
                            <div class="team-cell">
                                <img src="${s.teamLogo || 'https://crests.football-data.org/86.png'}" class="team-logo" alt="" />
                                <div>
                                    <div style="font-weight: 700;">${s.playerName}</div>
                                    <div style="font-size: 10px; color: #64748b;">${s.teamName}</div>
                                </div>
                            </div>
                        </td>
                        <td style="font-weight: 900; color: #b45309;">${s.goals}</td>
                    </tr>
                `;
            });
        } else {
            htmlContent += `<tr><td colspan="3" style="color: #94a3b8; font-style: italic; padding: 15px;">Sin registros</td></tr>`;
        }

        htmlContent += `
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    });

    htmlContent += `
            ${autoPrint ? `<script>window.onload = function() { setTimeout(function() { window.print(); }, 400); };</script>` : ''}
        </body>
        </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
};

export const generateStandingsAndTopScorersPdf = (visLeagues, visTeams, visMatches, visPlayers, tournamentId, showMessage) => {
    printStandingsAndTopScorersWindow(visLeagues, visTeams, visMatches, visPlayers, tournamentId, showMessage, true);
};

// --- ROSTER DE JUGADORES Y EQUIPOS CON ESCUDOS Y PLAYERA GILDAN ---
export const printTeamsAndPlayersRosterWindow = (visLeagues, visTeams, visPlayers, showMessage, autoPrint = false) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        if (showMessage) showMessage("Por favor permite las ventanas emergentes para imprimir.");
        return;
    }

    let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Nómina Oficial de Equipos y Alumnos</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 25px; color: #0f172a; background: #fff; }
                .header { text-align: center; border-bottom: 3px solid #101097; padding-bottom: 15px; margin-bottom: 25px; }
                .logo-school { width: 52px; height: 52px; object-fit: contain; margin-bottom: 8px; }
                h1 { color: #101097; margin: 0 0 5px 0; font-size: 24px; font-weight: 800; }
                h2 { color: #d97706; margin: 0; font-size: 16px; font-weight: 700; }
                .league-title { font-size: 18px; font-weight: 800; color: #101097; margin-top: 25px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; }
                .team-card { border: 1px solid #cbd5e1; border-radius: 12px; padding: 15px; margin-top: 15px; page-break-inside: avoid; }
                .team-header { display: flex; align-items: center; justify-content: space-between; font-size: 16px; font-weight: 800; color: #0f172a; margin-bottom: 10px; }
                .team-logo { width: 32px; height: 32px; object-fit: contain; border-radius: 50%; border: 1px solid #cbd5e1; padding: 1px; }
                .player-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px; font-size: 13px; font-weight: 600; }
                .player-item { background: #f8fafc; padding: 6px 10px; border-radius: 6px; border: 1px solid #e2e8f0; }
                @media print { .no-print { display: none !important; } }
            </style>
        </head>
        <body>
            <div class="no-print" style="margin-bottom: 20px; text-align: right;">
                <button onclick="window.print()" style="padding: 10px 24px; background: #101097; color: white; border: none; border-radius: 10px; font-weight: 800; font-size: 14px; cursor: pointer;">🖨️ Guardar como PDF / Imprimir Roster</button>
            </div>
            <div class="header">
                <img src="https://i.imgur.com/pbiHVPL.png" class="logo-school" alt="La Salle Logo" />
                <h1>LIGAS LA SALLE TUXTLA — SECUNDARIA</h1>
                <h2>📋 CÉDULA DE INSCRIPCIÓN: EQUIPOS Y ALUMNOS POR LIGA</h2>
            </div>
    `;

    visLeagues.forEach(league => {
        const lTeams = visTeams.filter(t => t.leagueId === league.id);
        if (lTeams.length === 0) return;

        htmlContent += `<div class="league-title">🏆 ${league.name}</div>`;
        lTeams.forEach(team => {
            const shirtColor = getTeamShirtColor(team, visTeams);
            const teamPlayers = visPlayers.filter(p => p.teamId === team.id);
            htmlContent += `
                <div class="team-card">
                    <div class="team-header">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <img src="${team.logoUrl || 'https://crests.football-data.org/86.png'}" class="team-logo" alt="" />
                            <span>${team.name} (${teamPlayers.length} alumnos)</span>
                        </div>
                        <div style="display: inline-flex; align-items: center; gap: 6px; background-color: ${shirtColor.hex}; color: ${shirtColor.isLight ? '#000000' : '#ffffff'}; border: 1.5px solid ${shirtColor.border}; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 800;">
                            <span>👕</span>
                            <span>Playera: ${shirtColor.name}</span>
                        </div>
                    </div>
                    <div class="player-grid">
                        ${teamPlayers.length > 0 ? teamPlayers.map((p, i) => `<div class="player-item">${i + 1}. ${p.name}</div>`).join('') : '<div style="color:#94a3b8; font-style:italic;">Sin alumnos registrados</div>'}
                    </div>
                </div>
            `;
        });
    });

    htmlContent += `
            ${autoPrint ? `<script>window.onload = function() { setTimeout(function() { window.print(); }, 400); };</script>` : ''}
        </body>
        </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
};

export const generateTeamsAndPlayersRosterPdf = (visLeagues, visTeams, visPlayers, tournamentId, showMessage) => {
    printTeamsAndPlayersRosterWindow(visLeagues, visTeams, visPlayers, showMessage, true);
};
