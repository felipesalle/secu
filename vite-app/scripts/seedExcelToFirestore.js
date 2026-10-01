import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBHX9ezfBiEZhxIDZTr-OTB5hgKV-zt0G4",
    authDomain: "torneos-lasalle-2.firebaseapp.com",
    projectId: "torneos-lasalle-2",
    storageBucket: "torneos-lasalle-2.firebasestorage.app",
    messagingSenderId: "860168864523",
    appId: "1:860168864523:web:1da5a47fa8ccb20def980e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const APP_ID = 'lasalle-secundaria-deportes';

const REAL_DATASET = [
    {
        leagueName: 'Grupos A Varonil',
        sport: 'Fútbol',
        teams: [
            {
                name: 'AEK Atenas',
                logoUrl: 'https://crests.football-data.org/1031.png',
                shirtColorName: 'Negro',
                shirtColorHex: '#1A1A1A',
                players: [
                    { name: 'ROGER MORALES GONZALEZ', gradeGroup: '3A' },
                    { name: 'VICTOR HUGO ORRICO PEÑA', gradeGroup: '3A' },
                    { name: 'HECTOR ZEFERINO NANGO ALVAREZ', gradeGroup: '3A' },
                    { name: 'ALEJANDRO MELCHOR ROVIROSA', gradeGroup: '2A' },
                    { name: 'SANTIAGO DOMINGUEZ HERNANDEZ', gradeGroup: '2A' },
                    { name: 'MAXIMILIANO AGUILAR AGUILAR', gradeGroup: '1A' },
                    { name: 'JOSE EMILIANO ESPINOSA MORALES', gradeGroup: '1A' },
                    { name: 'IAN ALEXANDER FLORES TRUJILLO', gradeGroup: '1A' },
                    { name: 'MATIAS EMILIANO HERNANDEZ ESPINOSA', gradeGroup: '1A' }
                ]
            },
            {
                name: 'Arsenal FC',
                logoUrl: 'https://crests.football-data.org/57.png',
                shirtColorName: 'Jaspe',
                shirtColorHex: '#B5B7B9',
                players: [
                    { name: 'SEBASTIAN ZENTENO TEJADA', gradeGroup: '3A' },
                    { name: 'JUAN PABLO ALVAREZ OCHOA', gradeGroup: '3A' },
                    { name: 'BASTIAN ALESSANDRO ACEVEDO BARRERA', gradeGroup: '3A' },
                    { name: 'ITHAN FREDERICK RUIZ VELASCO', gradeGroup: '2A' },
                    { name: 'LUIS ADRIAN ROSADO CRUZ', gradeGroup: '2A' },
                    { name: 'DIEGO ALBERTO JULIAN PIMENTEL', gradeGroup: '1A' },
                    { name: 'ALBERTO ZAMUDIO OLIVARES', gradeGroup: '1A' },
                    { name: 'EDUARDO ESQUINCA CHACON', gradeGroup: '1A' },
                    { name: 'NICOLAS BERNARDO LOPEZ SANCHEZ', gradeGroup: '1A' }
                ]
            },
            {
                name: 'FC Barcelona',
                logoUrl: 'https://crests.football-data.org/81.png',
                shirtColorName: 'Rey',
                shirtColorHex: '#0055D4',
                players: [
                    { name: 'SANTIAGO ROMAN SOLIS', gradeGroup: '3A' },
                    { name: 'SANTIAGO CRUZ DIAZ', gradeGroup: '3A' },
                    { name: 'LUIS FERNANDO FIGUEROA DUQUE DE ESTRADA', gradeGroup: '2A' },
                    { name: 'JORGE AGUSTIN PEREZ MARTINEZ', gradeGroup: '2A' },
                    { name: 'DEREK ALEXANDER DIAZ VAZQUEZ', gradeGroup: '2A' },
                    { name: 'GAEL PEREZ NARCIA', gradeGroup: '1A' },
                    { name: 'DIEGO LEON LOPEZ', gradeGroup: '1A' },
                    { name: 'AARON ROMERO VELAZQUEZ', gradeGroup: '1A' },
                    { name: 'LUIS RODRIGO MARTINEZ NAJERA', gradeGroup: '1A' }
                ]
            },
            {
                name: 'Bayern München',
                logoUrl: 'https://crests.football-data.org/5.png',
                shirtColorName: 'Perry',
                shirtColorHex: '#00738C',
                players: [
                    { name: 'CARLOS IVAN GOMEZ HERNANDEZ', gradeGroup: '3A' },
                    { name: 'ANGEL DAVID OCHOA CRUZ', gradeGroup: '3A' },
                    { name: 'ALAN RODOLFO SANTOS ALBORES', gradeGroup: '2A' },
                    { name: 'JOSE EMILIO CRUZ LOPEZ', gradeGroup: '2A' },
                    { name: 'JORGE EMILIANO CHANONA LOPEZ', gradeGroup: '2A' },
                    { name: 'ALENDRO MORALES DIAZ', gradeGroup: '1A' },
                    { name: 'DANIEL MONTALVO MORALES', gradeGroup: '1A' },
                    { name: 'CESAR MAURICIO BERNARD HERNANDEZ', gradeGroup: '1A' }
                ]
            }
        ]
    },
    {
        leagueName: 'Grupos A Femenil',
        sport: 'Fútbol',
        teams: [
            {
                name: 'Aston Villa',
                logoUrl: 'https://crests.football-data.org/58.png',
                shirtColorName: 'Oxford',
                shirtColorHex: '#59626A',
                players: [
                    { name: 'DASHA AIMEE SOLANO CARBALLO', gradeGroup: '3A' },
                    { name: 'MARIA ALEXANDRA PEREZ VASQUEZ', gradeGroup: '1A' },
                    { name: 'DIANE PEREZ ZARATE', gradeGroup: '2A' },
                    { name: 'CAROLINA DURAN', gradeGroup: '3A' },
                    { name: 'ANDREA MAHR CORZO', gradeGroup: '2A' },
                    { name: 'KEYLA PABLO PABLO', gradeGroup: '3A' },
                    { name: 'ABRIL ARANTXA ROBLEDO RUIZ', gradeGroup: '1A' },
                    { name: 'CELINA MARIA DOMINGUEZ RIZO', gradeGroup: '1A' }
                ]
            },
            {
                name: 'Atlético de Madrid',
                logoUrl: 'https://crests.football-data.org/78.png',
                shirtColorName: 'Marino',
                shirtColorHex: '#001A4D',
                players: [
                    { name: 'NAHOMI MONSERRAT', gradeGroup: '3A' },
                    { name: 'ARIANA GALINDO GUZMAN', gradeGroup: '1A' },
                    { name: 'RENATA ATZIMBA VELASCO OROZCO', gradeGroup: '3A' },
                    { name: 'VALERIA MONSERRAT SOTO RUIZ', gradeGroup: '1A' },
                    { name: 'CAELI ESTEFANIA GARCIA RANGEL', gradeGroup: '2A' },
                    { name: 'MARIA FERNANDA GUTIERREZ GUTIERREZ', gradeGroup: '2A' },
                    { name: 'SOFIA ANZUREZ MATUS', gradeGroup: '2A' }
                ]
            },
            {
                name: 'Borussia Dortmund',
                logoUrl: 'https://crests.football-data.org/4.png',
                shirtColorName: 'Turquesa',
                shirtColorHex: '#00A3E0',
                players: [
                    { name: 'ANA GORETTI GONZALEZ HERNANDEZ', gradeGroup: '3A' },
                    { name: 'ANA PAOLA CACERES NANGUSE', gradeGroup: '3A' },
                    { name: 'RENATA TOVILLA RUIZ', gradeGroup: '2A' },
                    { name: 'GRECIA SOPHIA ORTIZ COUTIÑO', gradeGroup: '2A' },
                    { name: 'XIMENA ANALISSE DIAZ IBARRA', gradeGroup: '2A' },
                    { name: 'MARIA JOSE CLEMENTE HERNANDEZ', gradeGroup: '1A' },
                    { name: 'ITATI CONCEPCION SALTOS ALBORES', gradeGroup: '1A' },
                    { name: 'ABIGAEL SANCHEZ GAMBOA', gradeGroup: '3A' }
                ]
            },
            {
                name: 'Como 1907',
                logoUrl: 'https://crests.football-data.org/1057.png',
                shirtColorName: 'Aqua',
                shirtColorHex: '#00B5AD',
                players: [
                    { name: 'DOMINGUEZ RINCON CAROL', gradeGroup: '3A' },
                    { name: 'DANIELA GUADALUPE OCHOA GOMEZ', gradeGroup: '1A' },
                    { name: 'VIVIAN MONSERRAT LLAVEN MINA', gradeGroup: '1A' },
                    { name: 'ANDREA BERMUDEZ BURGOS', gradeGroup: '2A' },
                    { name: 'DENISE HALLY RIOS PARKER', gradeGroup: '1A' },
                    { name: 'ROMINA VIVIAN DOMINGUEZ LOPEZ', gradeGroup: '3A' },
                    { name: 'MARIA FERNANDA JIMENEZ AVENDAÑO', gradeGroup: '1A' }
                ]
            },
            {
                name: 'Feyenoord',
                logoUrl: 'https://crests.football-data.org/675.png',
                shirtColorName: 'Menta',
                shirtColorHex: '#A2E8DD',
                players: [
                    { name: 'MARIA MAGDALENA ALVAREZ TIRADO', gradeGroup: '3A' },
                    { name: 'ISSABELA SOFIA BAUTISTA MONTOYA', gradeGroup: '3A' },
                    { name: 'VICTORIA ZARATE RAMIREZ', gradeGroup: '1A' },
                    { name: 'ANA PAULA PEREZ SAMAYOA', gradeGroup: '1A' },
                    { name: 'ALEXANDRA ISABELLA RODRIGUEZ RAMIREZ', gradeGroup: '2A' },
                    { name: 'ALEXA VALENTINA MAGDALENO ROMAN', gradeGroup: '2A' },
                    { name: 'ROSA KAMILA SANCHO ESTRADA', gradeGroup: '3A' }
                ]
            },
            {
                name: 'Galatasaray',
                logoUrl: 'https://crests.football-data.org/610.png',
                shirtColorName: 'Bandera',
                shirtColorHex: '#008037',
                players: [
                    { name: 'SOFIA VICTORIA CAPETILLO ESPINOSA', gradeGroup: '3A' },
                    { name: 'NASHMA NICOLE AGUIRRE CHAVEZ', gradeGroup: '3A' },
                    { name: 'KARIME MAITE CHACON FARRERA', gradeGroup: '1A' },
                    { name: 'ANA LUCIA CONTRERAS GARCIA', gradeGroup: '1A' },
                    { name: 'KIMBERLY YATZIRI LOPEZ ZARAZUA', gradeGroup: '2A' },
                    { name: 'VALERIA ARANDA VALENZUELA', gradeGroup: '2A' },
                    { name: 'GRETTEL RODRIGUEZ', gradeGroup: '3A' }
                ]
            }
        ]
    },
    {
        leagueName: 'Grupos B Varonil',
        sport: 'Fútbol',
        teams: [
            {
                name: 'Inter de Milán',
                logoUrl: 'https://crests.football-data.org/108.png',
                shirtColorName: 'Hueso',
                shirtColorHex: '#F5F2EB',
                players: [
                    { name: 'VICTOR MANUEL MAGDALENO AGUILAR', gradeGroup: '3B' },
                    { name: 'CRISTOPHER PEREZ VASQUEZ', gradeGroup: '3B' },
                    { name: 'YAMIL ARTURO CASTILLO CHAGOYA', gradeGroup: '2B' },
                    { name: 'PATRICIO RAMOS CAMPOS', gradeGroup: '2B' },
                    { name: 'IKER PEREZ MOLINA', gradeGroup: '1B' },
                    { name: 'MIGUEL ANIBAL MORALES SUAREZ', gradeGroup: '1B' },
                    { name: 'LEONARDO GAEL JIMENEZ VENTURA', gradeGroup: '1B' },
                    { name: 'MATEO HERNANDEZ PONCE', gradeGroup: '1B' }
                ]
            },
            {
                name: 'RB Leipzig',
                logoUrl: 'https://crests.football-data.org/721.png',
                shirtColorName: 'Canario',
                shirtColorHex: '#FFE600',
                players: [
                    { name: 'JOSE JACOB MOLINA GUILLEN', gradeGroup: '3B' },
                    { name: 'GABRIEL CONDE MONTEJO', gradeGroup: '3B' },
                    { name: 'FERNANDO MORALES DIAZ', gradeGroup: '2B' },
                    { name: 'JOSE MATIAS ESPINOSA SANCHEZ', gradeGroup: '2B' },
                    { name: 'MATIAS RUIZ MALO', gradeGroup: '2B' },
                    { name: 'GIBRAN ROMERO VELAZQUEZ', gradeGroup: '1B' },
                    { name: 'ERICK DELGADO ZENTENO', gradeGroup: '1B' },
                    { name: 'KENNETH ALEJANRO MUÑOZ NARCIA', gradeGroup: '1B' }
                ]
            },
            {
                name: 'Manchester City',
                logoUrl: 'https://crests.football-data.org/65.png',
                shirtColorName: 'Salmón',
                shirtColorHex: '#FF6B6B',
                players: [
                    { name: 'SANTIAGO DIAZ GASTELUM', gradeGroup: '3B' },
                    { name: 'DANIEL MIGUEL GONZALEZ VARGAS', gradeGroup: '3B' },
                    { name: 'IVAN GORDILLO BALBUENA', gradeGroup: '3B' },
                    { name: 'LEONARDO TOPKE GORDILLO', gradeGroup: '2B' },
                    { name: 'MIGUEL ALFONSO PANIAGUA CASTELLANOS', gradeGroup: '2B' },
                    { name: 'JUAN PABLO DOMINGUEZ DAHMLOW', gradeGroup: '1B' },
                    { name: 'JUAN JOSE MOTA VELAZQUEZ', gradeGroup: '1B' },
                    { name: 'JOSE MIGUEL ORRICO PEÑA', gradeGroup: '1B' }
                ]
            },
            {
                name: 'Manchester United',
                logoUrl: 'https://crests.football-data.org/66.png',
                shirtColorName: 'Vino',
                shirtColorHex: '#6B1D2F',
                players: [
                    { name: 'JOSE ALEJANDRO ORANTES DUARTE', gradeGroup: '3B' },
                    { name: 'JORGE ANTONIO CASTORENA LOPEZ', gradeGroup: '3B' },
                    { name: 'MATEO VALENCIA MARTINEZ', gradeGroup: '3B' },
                    { name: 'RODRIGO VAZQUEZ CUESTA', gradeGroup: '2B' },
                    { name: 'AXEL KAMIL GUTIERREZ ORDOÑEZ', gradeGroup: '2B' },
                    { name: 'DAVID ALEXANDER ALEGRIA VAZQUEZ', gradeGroup: '1B' },
                    { name: 'DAVID ZUÑIGA GRAJALES', gradeGroup: '1B' }
                ]
            }
        ]
    },
    {
        leagueName: 'Grupos B Femenil',
        sport: 'Fútbol',
        teams: [
            {
                name: 'Lille OSC',
                logoUrl: 'https://crests.football-data.org/521.png',
                shirtColorName: 'Naranja',
                shirtColorHex: '#FF5500',
                players: [
                    { name: 'CONSTANZA CASTILLEJOS MORENO', gradeGroup: '3B' },
                    { name: 'TAHIRA JIMENEZ PATJANE', gradeGroup: '2B' },
                    { name: 'CAROLINA CHANONA MOLINA', gradeGroup: '2B' },
                    { name: 'LUNA MAYTE MARTINEZ COELLO', gradeGroup: '2B' },
                    { name: 'MARIA FERNANDA PALAFOX GUTIERREZ', gradeGroup: '3B' },
                    { name: 'STHEFANI GUILLEN COUTIÑO', gradeGroup: '1B' },
                    { name: 'KEYLIN GONZALEZ ALVARADO', gradeGroup: '1B' },
                    { name: 'XIMENA YONG MAZA', gradeGroup: '1B' },
                    { name: 'VANESSA BAUTISTA OLMOS', gradeGroup: '3B' },
                    { name: 'VANESSA ALVARADO LOZANO', gradeGroup: '3B' }
                ]
            },
            {
                name: 'Liverpool FC',
                logoUrl: 'https://crests.football-data.org/64.png',
                shirtColorName: 'Rojo',
                shirtColorHex: '#D50000',
                players: [
                    { name: 'DANNA SOFIA PASCACIO GARCIA', gradeGroup: '3B' },
                    { name: 'RENATA ESQUINCA NIVON', gradeGroup: '3B' },
                    { name: 'VALENTINA GORDILLO BALBUENA', gradeGroup: '1B' },
                    { name: 'ISABELLA ZARATE PIMENTEL', gradeGroup: '1B' },
                    { name: 'VICTORIA MALO AQUINO', gradeGroup: '1B' },
                    { name: 'MARIANA MENDOZA LOPEZ', gradeGroup: '3B' },
                    { name: 'SOPHIA NUÑEZ PEREZ', gradeGroup: '2B' },
                    { name: 'ROMINA JIMENEZ NANGO', gradeGroup: '2B' }
                ]
            },
            {
                name: 'Paris Saint-Germain',
                logoUrl: 'https://crests.football-data.org/524.png',
                shirtColorName: 'Rosa',
                shirtColorHex: '#FFB6C1',
                players: [
                    { name: 'MIRANDA GORDILLO JUAREZ', gradeGroup: '3B' },
                    { name: 'CAMILA ESPINOSA URIBE', gradeGroup: '3B' },
                    { name: 'AMAYA MORA JIMENEZ', gradeGroup: '1B' },
                    { name: 'GENESIS ROSE DIAZ BULADACO', gradeGroup: '1B' },
                    { name: 'SABINA MORALES NUÑEZ', gradeGroup: '1B' },
                    { name: 'CAMILA ALEXA GALINDO ESCOBAR', gradeGroup: '1B' },
                    { name: 'VALENTINA ABARCA FLORES', gradeGroup: '2B' },
                    { name: 'GRETHEL VALDEZ JIMENEZ', gradeGroup: '2B' }
                ]
            },
            {
                name: 'Real Madrid',
                logoUrl: 'https://crests.football-data.org/86.png',
                shirtColorName: 'Militar',
                shirtColorHex: '#4B5320',
                players: [
                    { name: 'CAMILA RUBI ESPINOSA MORALES', gradeGroup: '3B' },
                    { name: 'MARIA FENANDA GARCIA GARCIA', gradeGroup: '3B' },
                    { name: 'GUADALUPE SANCHEZ LAPARRA', gradeGroup: '1B' },
                    { name: 'ISABELLA ANZA TRUJILLO', gradeGroup: '1B' },
                    { name: 'MARIA JOSE NARCIA NUCAMENDI', gradeGroup: '1B' },
                    { name: 'IVANNA MARTINEZ LOPEZ', gradeGroup: '2B' },
                    { name: 'MONSERRAT DOMINGUEZ', gradeGroup: '1B' },
                    { name: 'DIANA VALENTINA MORALES GUTIERREZ', gradeGroup: '2B' }
                ]
            },
            {
                name: 'Sporting CP',
                logoUrl: 'https://crests.football-data.org/498.png',
                shirtColorName: 'Cherry',
                shirtColorHex: '#8B0021',
                players: [
                    { name: 'MELISSA ROMERO VELASQUEZ', gradeGroup: '3B' },
                    { name: 'KARLA MARIA ZUART RODRIGUEZ', gradeGroup: '3B' },
                    { name: 'ELENA MARGARITA SANCHEZ SANCHEZ', gradeGroup: '3B' },
                    { name: 'FATIMA LILIANA ORTIZ RUIZ', gradeGroup: '2B' },
                    { name: 'RENATA LOPEZ AQUIAHUATL', gradeGroup: '2B' },
                    { name: 'MARIA JOSE ESPINOSA MONTES', gradeGroup: '1B' },
                    { name: 'XIMENA FONSECA TOLEDO', gradeGroup: '1B' },
                    { name: 'GRETTEL SOLIS AGUILAR', gradeGroup: '1B' }
                ]
            },
            {
                name: 'Villarreal CF',
                logoUrl: 'https://crests.football-data.org/94.png',
                shirtColorName: 'Botella',
                shirtColorHex: '#1E4D2B',
                players: [
                    { name: 'HAMMIA GONZALEZ AKVARADO', gradeGroup: '3B' },
                    { name: 'CERSEI ADRIANAN RODRIGUEZ ESPINOSA', gradeGroup: '2B' },
                    { name: 'MARIA FOX AGUILAR', gradeGroup: '1B' },
                    { name: 'XIMENA RIVERA GALVAN', gradeGroup: '1B' },
                    { name: 'ALEXA ZOE COELLO LARA', gradeGroup: '3B' },
                    { name: 'EMILY SOPHIA JIMENEZ ESTRADA', gradeGroup: '2B' },
                    { name: 'NAOMI HISSEL NUCAMENDI PINEDA', gradeGroup: '1B' },
                    { name: 'ZOE GUADALUPE MORALES MEZA', gradeGroup: '3B' }
                ]
            }
        ]
    }
];

async function seedData() {
    console.log("🔥 Autenticando en Firebase...");
    const emailsToTry = [
        { e: 'felipe.sancha.hernandez@gmail.com', p: '123456' },
        { e: 'felipe.sancha.hernandez@gmail.com', p: 'admin123' },
        { e: 'admin@lasalle.edu.mx', p: '123456' }
    ];

    let authenticated = false;
    for (const cred of emailsToTry) {
        try {
            await signInWithEmailAndPassword(auth, cred.e, cred.p);
            console.log(`🔑 Autenticado con éxito como: ${cred.e}`);
            authenticated = true;
            break;
        } catch (e) {
            // Continuar intentando
        }
    }

    if (!authenticated) {
        console.warn("⚠️ Intentando continuar autenticación implícita...");
    }

    // 1. Obtener torneos existentes
    const tourneysSnap = await getDocs(collection(db, `artifacts/${APP_ID}/public/data/tournaments`));
    let tournamentId = '';

    if (!tourneysSnap.empty) {
        const tourneys = tourneysSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        tourneys.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        tournamentId = tourneys[0].id;
        console.log(`📌 Torneo activo encontrado: "${tourneys[0].name}" (${tournamentId})`);
    } else {
        tournamentId = 'tournament_2026_oficial';
        await setDoc(doc(db, `artifacts/${APP_ID}/public/data/tournaments`, tournamentId), {
            id: tournamentId,
            name: 'Torneo Oficial Secundaria 2026',
            sport: 'Fútbol',
            inaugurationDate: '2026-10-01',
            createdAt: Date.now()
        });
        console.log(`📌 Creado nuevo torneo activo: "${tournamentId}"`);
    }

    // 2. Obtener ligas del torneo o crearlas
    const leaguesSnap = await getDocs(collection(db, `artifacts/${APP_ID}/public/data/leagues`));
    const existingLeagues = leaguesSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter(l => l.tournamentId === tournamentId);

    // Limpiar equipos y jugadores previos
    const teamsSnap = await getDocs(collection(db, `artifacts/${APP_ID}/public/data/teams`));
    const playersSnap = await getDocs(collection(db, `artifacts/${APP_ID}/public/data/players`));

    console.log("🧹 Limpiando equipos y alumnos antiguos...");
    for (const pDoc of playersSnap.docs) {
        await deleteDoc(doc(db, `artifacts/${APP_ID}/public/data/players`, pDoc.id));
    }
    for (const tDoc of teamsSnap.docs) {
        await deleteDoc(doc(db, `artifacts/${APP_ID}/public/data/teams`, tDoc.id));
    }

    let totalTeams = 0;
    let totalPlayers = 0;

    for (const groupData of REAL_DATASET) {
        let leagueObj = existingLeagues.find(l => l.name.toLowerCase().trim() === groupData.leagueName.toLowerCase().trim());
        let leagueId = leagueObj ? leagueObj.id : `league_${tournamentId}_${groupData.leagueName.replace(/\s+/g, '_')}`;

        await setDoc(doc(db, `artifacts/${APP_ID}/public/data/leagues`, leagueId), {
            id: leagueId,
            name: groupData.leagueName,
            sport: groupData.sport,
            tournamentId,
            matchDay: 3
        });

        console.log(`🏆 Liga configurada: "${groupData.leagueName}" (${leagueId})`);

        for (const teamData of groupData.teams) {
            const teamId = `team_${leagueId}_${teamData.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
            await setDoc(doc(db, `artifacts/${APP_ID}/public/data/teams`, teamId), {
                id: teamId,
                name: teamData.name,
                leagueId,
                logoUrl: teamData.logoUrl,
                shirtColorName: teamData.shirtColorName,
                shirtColorHex: teamData.shirtColorHex
            });
            totalTeams++;

            for (const playerData of teamData.players) {
                const playerId = `player_${teamId}_${Math.random().toString(36).substring(2, 7)}`;
                await setDoc(doc(db, `artifacts/${APP_ID}/public/data/players`, playerId), {
                    id: playerId,
                    name: playerData.name,
                    gradeGroup: playerData.gradeGroup,
                    teamId
                });
                totalPlayers++;
            }
        }
    }

    console.log(`✅ ¡Éxito Total! Se cargaron ${totalTeams} equipos reales y ${totalPlayers} alumnos reales con su grado y grupo en Firestore.`);
    process.exit(0);
}

seedData().catch(err => {
    console.error("❌ Error ejecutando seedData:", err);
    process.exit(1);
});
