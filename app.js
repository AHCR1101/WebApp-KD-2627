// app.js
let actiefDomeinId = '';
let actiefProfielId = '';
let actieveRol = 'student';
let matrixIsOpen = false;
let actiefCurriculumProfielId = '';

function scrollToPageTop() {
  if (typeof window === 'undefined' || !window.scrollTo) return;
  requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }));
}

function openDomeinDashboard(domeinId) {
  actiefDomeinId = domeinId;
  matrixIsOpen = false;
  
  const searchBox = document.getElementById('live-search-box');
  if (searchBox) searchBox.value = '';
  
  const matrixPanel = document.getElementById('matrix-panel');
  if (matrixPanel) matrixPanel.style.display = 'none';
  
  const matrixBtn = document.getElementById('matrix-toggle-btn');
  if (matrixBtn) matrixBtn.innerText = 'Open Vergelijkingsmatrix';

  document.getElementById('landing-layer').style.display = 'none';
  document.getElementById('curriculum-layer').style.display = 'none';
  document.getElementById('dashboard-layer').style.display = 'block';

  const domeinData = kwalificatieDossierDatabase.domeinen.find(d => d.id === domeinId);
  if (!domeinData) return;

  const selectDropdown = document.getElementById('dropdown-profielen');
  selectDropdown.innerHTML = '';
  selectDropdown.onchange = event => switchProfiel(event.target.value);

  domeinData.profielen.forEach(profiel => {
    const optie = document.createElement('option');
    optie.value = profiel.id;
    
    let weergaveNaam = `${profiel.naam} (${profiel.niveau})`;
    
    if (profiel.id === 'medewerker_hospitality') {
      weergaveNaam = `${profiel.naam} (${profiel.niveau}) | Gastvrijheidstalent`;
    } else if (profiel.id === 'zelfstandig_medewerker_hospitality') {
      weergaveNaam = `${profiel.naam} (${profiel.niveau}) | Hospitality Medewerker`;
    } else if (profiel.id === 'leidinggevende_hospitality') {
      weergaveNaam = `${profiel.naam} (${profiel.niveau}) | Hospitality Manager`;
    }
    
    optie.innerText = weergaveNaam;
    selectDropdown.appendChild(optie);
  });

  actiefProfielId = domeinData.profielen[0].id;
  selectDropdown.value = actiefProfielId;
  document.body.className = 'student-mode';
  resetRolKnoppen();
  renderDossierContent();
  scrollToPageTop();
}

function sluitDashboardEnTerug() {
  document.getElementById('landing-layer').style.display = 'block';
  document.getElementById('dashboard-layer').style.display = 'none';
  document.getElementById('curriculum-layer').style.display = 'none';
  document.getElementById('app-subtitle').innerText = 'Dossier- & BPV-Kompas Portaal';
  scrollToPageTop();
}

function getCurriculumProfielen() {
  return kwalificatieDossierDatabase.domeinen
    .filter(domein => domein.id !== 'generiek')
    .flatMap(domein => domein.profielen.map(profiel => ({
      domeinId: domein.id,
      domeinTitel: domein.titel,
      profiel
    })));
}

function openCurriculumDashboard() {
  document.getElementById('landing-layer').style.display = 'none';
  document.getElementById('dashboard-layer').style.display = 'none';
  document.getElementById('curriculum-layer').style.display = 'block';
  document.getElementById('app-subtitle').innerText = 'Curriculum per opleiding';

  const profielen = getCurriculumProfielen();
  const select = document.getElementById('dropdown-curriculum-profielen');
  if (!select || profielen.length === 0) return;

  select.innerHTML = '';
  profielen.forEach(item => {
    const optie = document.createElement('option');
    optie.value = item.profiel.id;
    optie.innerText = `${item.profiel.naam} (${item.profiel.niveau}) - ${item.domeinTitel}`;
    select.appendChild(optie);
  });

  actiefCurriculumProfielId = profielen[0].profiel.id;
  select.value = actiefCurriculumProfielId;
  renderCurriculumContent();
  scrollToPageTop();
}

function sluitCurriculumEnTerug() {
  document.getElementById('landing-layer').style.display = 'block';
  document.getElementById('dashboard-layer').style.display = 'none';
  document.getElementById('curriculum-layer').style.display = 'none';
  document.getElementById('app-subtitle').innerText = 'Dossier- & BPV-Kompas Portaal';
  scrollToPageTop();
}

function switchCurriculumProfiel(profielId) {
  actiefCurriculumProfielId = profielId;
  renderCurriculumContent();
}

function vindCurriculumProfiel() {
  return getCurriculumProfielen().find(item => item.profiel.id === actiefCurriculumProfielId);
}

function getWerkprocessenVoorProfiel(profielId) {
  const sleutels = kwalificatieDossierDatabase.profielKerntaken[profielId] || [];
  return sleutels.flatMap(sleutel => {
    const kerntaak = kwalificatieDossierDatabase.kerntakenDatabase[sleutel];
    if (!kerntaak || !kerntaak.werkprocessen) return [];
    return kerntaak.werkprocessen.map(wp => ({
      code: wp.code,
      titel: wp.titel,
      kerntaak: kerntaak.titel
    }));
  });
}

function verdeelWerkprocessenOverPeriode(werkprocessen, periodeIndex) {
  if (werkprocessen.length === 0) return [];
  const start = Math.floor((periodeIndex / 12) * werkprocessen.length);
  const einde = Math.max(start + 1, Math.floor(((periodeIndex + 1) / 12) * werkprocessen.length));
  return werkprocessen.slice(start, einde);
}

function getCurriculumThemas(leerjaar, periode, profielNaam) {
  const basis = [
    ['Kennismaken met het beroep, beroepshouding, veiligheid en gastvrij werken.', 'Basisvaardigheden oefenen in een veilige schoolsituatie.', 'Vaktaal, samenwerking en zorgvuldig werken.'],
    ['Voorbereiden, uitvoeren en afronden van eenvoudige beroepsopdrachten.', 'Werken volgens stappenplan, instructies en kwaliteitsafspraken.', 'Feedback vragen en verwerken.'],
    ['Praktijksituaties oefenen met meer zelfstandigheid en tijdsdruk.', 'Koppelen van theorie aan beroepshandelingen.', 'Bewijs verzamelen voor BPV en begeleiding.'],
    ['Integreren van leerdoelen in grotere praktijkopdrachten.', 'Reflecteren op voortgang, gedrag en vakvaardigheid.', 'Voorbereiden op de volgende fase of BPV-periode.']
  ];

  if (leerjaar === 2) {
    return [
      `Verdieping van ${profielNaam} met complexere praktijksituaties.`,
      basis[periode - 1][1],
      'Meer aandacht voor plannen, afstemmen, kwaliteit en verantwoordelijkheid.'
    ];
  }

  if (leerjaar === 3) {
    return [
      `Examenvoorbereiding en beroepsbekwaam handelen binnen ${profielNaam}.`,
      'Zelfstandig werken aan beroepstaken, bewijs en reflectie.',
      'Afronden, verantwoorden en verbinden met vervolgstudie of werk.'
    ];
  }

  return basis[periode - 1];
}

function renderCurriculumContent() {
  const target = document.getElementById('curriculum-render-target');
  const item = vindCurriculumProfiel();
  if (!target || !item) return;

  const profiel = item.profiel;
  const werkprocessen = getWerkprocessenVoorProfiel(profiel.id);
  let periodeIndex = 0;

  let html = `
    <div class="summary-card">
      <h4>${profiel.naam} (${profiel.niveau})</h4>
      <p class="curriculum-note">Conceptindeling: gebruik dit als basis om het actuele onderwijsprogramma per periode verder te vullen of aan te scherpen.</p>
    </div>
  `;

  for (let leerjaar = 1; leerjaar <= 3; leerjaar++) {
    html += `
      <div class="curriculum-year">
        <div class="curriculum-year-header" role="button" tabindex="0" aria-expanded="false">
          <h3>LEERJAAR ${leerjaar}</h3>
        </div>
        <div class="curriculum-year-body">
    `;

    for (let periode = 1; periode <= 4; periode++) {
      const themas = getCurriculumThemas(leerjaar, periode, profiel.naam);
      const gekoppeldeWerkprocessen = verdeelWerkprocessenOverPeriode(werkprocessen, periodeIndex);
      periodeIndex++;

      html += `
        <div class="curriculum-period">
          <div class="curriculum-period-header" role="button" tabindex="0" aria-expanded="false">
            <h4>ONDERWIJSPERIODE ${periode}</h4>
          </div>
          <div class="curriculum-period-body">
            <div class="curriculum-block-grid">
              <div class="curriculum-block">
                <strong>Op school behandeld</strong>
                <ul>${themas.map(thema => `<li>${thema}</li>`).join('')}</ul>
              </div>
              <div class="curriculum-block">
                <strong>Koppeling met werkprocessen</strong>
                <ul>${gekoppeldeWerkprocessen.map(wp => `<li>${wp.code} - ${wp.titel}</li>`).join('') || '<li>Werkprocessen worden in deze periode door de opleiding gekoppeld.</li>'}</ul>
              </div>
            </div>
            <p class="curriculum-note">Deze periodekaart is bedoeld als onderwijsplanning en kan later worden aangevuld met lessen, opdrachten, toetsen en BPV-koppelingen.</p>
          </div>
        </div>
      `;
    }

    html += `
        </div>
      </div>
    `;
  }

  target.innerHTML = html;
  prepareCurriculumAccordions();
}

function prepareCurriculumAccordions() {
  const years = Array.from(document.querySelectorAll('.curriculum-year'));
  years.forEach(year => {
    const header = year.querySelector('.curriculum-year-header');
    if (!header) return;

    const toggleYear = () => {
      const wasOpen = year.classList.contains('open');
      years.forEach(otherYear => {
        otherYear.classList.remove('open');
        const otherHeader = otherYear.querySelector('.curriculum-year-header');
        if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        year.classList.add('open');
        header.setAttribute('aria-expanded', 'true');
        requestAnimationFrame(() => year.scrollIntoView({ behavior: 'smooth', block: 'start' }));
      }
    };

    header.addEventListener('click', toggleYear);
    header.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleYear();
      }
    });
  });

  document.querySelectorAll('.curriculum-year').forEach(year => {
    const periods = Array.from(year.querySelectorAll('.curriculum-period'));
    periods.forEach(period => {
      const header = period.querySelector('.curriculum-period-header');
      if (!header) return;

      const togglePeriod = () => {
        const wasOpen = period.classList.contains('open');
        periods.forEach(otherPeriod => {
          otherPeriod.classList.remove('open');
          const otherHeader = otherPeriod.querySelector('.curriculum-period-header');
          if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
        });
        if (!wasOpen) {
          period.classList.add('open');
          header.setAttribute('aria-expanded', 'true');
          requestAnimationFrame(() => period.scrollIntoView({ behavior: 'smooth', block: 'start' }));
        }
      };

      header.addEventListener('click', togglePeriod);
      header.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          togglePeriod();
        }
      });
    });
  });
}

function resetRolKnoppen() {
  const knoppen = document.querySelectorAll('.role-btn');
  knoppen.forEach(k => k.classList.remove('active'));
  const studentBtn = document.getElementById('btn-student');
  if (studentBtn) studentBtn.classList.add('active');
  actieveRol = 'student';
  updateRolInstructieTekst('student');
}

function switchProfiel(profielId) {
  actiefProfielId = profielId;
  const selectDropdown = document.getElementById('dropdown-profielen');
  if (selectDropdown && selectDropdown.value !== profielId) {
    selectDropdown.value = profielId;
  }
  renderDossierContent();
}

function switchRoleView(rol, knopElement) {
  const knoppen = document.querySelectorAll('.role-btn');
  knoppen.forEach(k => k.classList.remove('active'));
  if (knopElement) knopElement.classList.add('active');
  actieveRol = rol;
  document.body.className = rol + '-mode';
  updateRolInstructieTekst(rol);
  renderDossierContent();
}

function getActiefDomeinEnProfiel() {
  const domein = kwalificatieDossierDatabase.domeinen.find(d => d.id === actiefDomeinId);
  const profiel = domein ? domein.profielen.find(p => p.id === actiefProfielId) : null;
  return { domein, profiel };
}

function updateRolInstructieTekst(rol) {
  const introBox = document.getElementById('role-intro-text');
  if (!introBox) return;

  const { profiel } = getActiefDomeinEnProfiel();
  const profielNaam = profiel ? profiel.naam : 'deze opleiding';
  const niveau = profiel ? profiel.niveau : 'het gekozen niveau';

  if (actiefDomeinId === 'generiek') {
    introBox.innerHTML = `
      <h3>Generieke onderdelen</h3>
      <p>Hier staan de wettelijke generieke eisen voor het gekozen mbo-niveau. Deze onderdelen horen bij diplomering, maar zijn geen BPV-checklist voor de beroepspraktijk.</p>
    `;
    return;
  }

  const rolTeksten = {
    student: {
      titel: 'Jouw stage in gewone taal',
      tekst: `Je bekijkt nu ${profielNaam} (${niveau}). Open een basisdeel of profieldeel en kijk per werkproces wat je concreet op stage moet laten zien. Gebruik dit als kompas voor je gedrag, je bewijs en je gesprek met je praktijkopleider.`,
      blokken: [
        ['Wat moet ik doen?', 'Lees per werkproces welke taak centraal staat en welk gedrag daarbij hoort.'],
        ['Wat kan ik verzamelen?', "Denk aan foto's, feedback, observaties, producten, planningen of korte reflecties."],
        ['Wanneer is het goed?', 'Als je kunt uitleggen wat je deed, waarom je dat deed en welk resultaat dat opleverde.']
      ]
    },
    pleider: {
      titel: 'Begeleiden en observeren op de werkvloer',
      tekst: `U bekijkt nu ${profielNaam} (${niveau}). De werkprocessen helpen om gericht te observeren wat de student uitvoert, hoe zelfstandig dat gebeurt en welk resultaat zichtbaar wordt in de praktijk.`,
      blokken: [
        ['Waar let ik op?', 'Observeer concreet gedrag, vakmatige uitvoering, samenwerking en gastgerichtheid.'],
        ['Wat bespreek ik?', 'Koppel feedback aan het werkproces en benoem wat al lukt en wat de volgende stap is.'],
        ['Wat is bewijs?', 'Gebruik praktijkvoorbeelden, producten, observaties en feedbackmomenten als onderbouwing.']
      ]
    },
    docent: {
      titel: 'Onderwijskundige structuur en dossiercontrole',
      tekst: `U bekijkt nu ${profielNaam} (${niveau}). De basisdelen en profieldelen tonen de formele KD-structuur met werkprocessen, complexiteit, verantwoordelijkheid en vakkennis.`,
      blokken: [
        ['Structuur', 'Controleer de samenhang tussen basisdeel, profieldeel en werkprocessen.'],
        ['Duiding', 'Gebruik complexiteit en verantwoordelijkheid om niveauverschillen te bespreken.'],
        ['Begeleiding', 'Verbind de formele eisen aan onderwijsactiviteiten, BPV-opdrachten en beoordeling.']
      ]
    }
  };

  const inhoud = rolTeksten[rol] || rolTeksten.student;
  introBox.innerHTML = `
    <h3>${inhoud.titel}</h3>
    <p>${inhoud.tekst}</p>
    <div class="role-summary-grid">
      ${inhoud.blokken.map(([kop, tekst]) => `
        <div class="role-summary-item">
          <strong>${kop}</strong>
          <span>${tekst}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function executeLiveSearch() {
  const trefwoord = document.getElementById('live-search-box').value.toLowerCase();
  const werkprocessen = document.querySelectorAll('.wp-block');
  const kaarten = document.querySelectorAll('.card');

  werkprocessen.forEach(wp => {
    const inhoud = wp.innerText.toLowerCase();
    wp.style.display = inhoud.includes(trefwoord) ? 'block' : 'none';
  });

  kaarten.forEach(kaart => {
    const totaleProcessen = kaart.querySelectorAll('.wp-block');
    const zichtbareProcessen = Array.from(totaleProcessen).filter(wp => wp.style.display !== 'none');
    if (totaleProcessen.length > 0 && zichtbareProcessen.length === 0 && trefwoord !== '') {
      kaart.style.display = 'none';
    } else {
      kaart.style.display = 'block';
    }
  });
}

function toggleMatrixView() {
  const paneel = document.getElementById('matrix-panel');
  const knop = document.getElementById('matrix-toggle-btn');
  if (!matrixIsOpen) {
    if (paneel) paneel.style.display = 'block';
    if (knop) knop.innerText = 'Sluit Vergelijkingsmatrix';
    genereerMatrixTabel();
    matrixIsOpen = true;
  } else {
    if (paneel) paneel.style.display = 'none';
    if (knop) knop.innerText = 'Open Vergelijkingsmatrix';
    matrixIsOpen = false;
  }
}

function genereerMatrixTabel() {
  const target = document.getElementById('matrix-table-render-target');
  if (!target) return;
  const domein = kwalificatieDossierDatabase.domeinen.find(d => d.id === actiefDomeinId);
  
  let tabelHtml = `<table class="matrix-table"><thead><tr><th>MBO Uitstroomprofiel</th><th>Complexiteitsniveau (KD)</th><th>Verantwoordelijkheidsgrens</th></tr></thead><tbody>`;
  domein.profielen.forEach(p => {
    const kerntaakSleutels = kwalificatieDossierDatabase.profielKerntaken[p.id] || [];
    const eersteSleutel = kerntaakSleutels[0];
    const taakData = kwalificatieDossierDatabase.kerntakenDatabase[eersteSleutel];
    const complexiteit = taakData ? taakData.complexiteit : "Zie de specifieke kerntaken hieronder.";
    const verantwoordelijkheid = taakData ? taakData.verantwoordelijkheid : "Zie de specifieke verantwoordelijkheden.";
    tabelHtml += `<tr><td><strong>${p.naam}</strong><br><small>${p.niveau} (Crebo ${p.crebo})</small></td><td>${complexiteit}</td><td>${verantwoordelijkheid}</td></tr>`;
  });
  tabelHtml += `</tbody></table>`;
  target.innerHTML = tabelHtml;
}


function bepaalBewijsCategorie(wp, kerntaak) {
  const tekst = `${wp.code || ''} ${wp.titel || ''} ${kerntaak ? kerntaak.titel : ''}`.toLowerCase();

  if (/reserver|ontvangt|afscheid|aanspreekpunt|gastgerichte|gastgerichte beleving|klacht|gasttevredenheid/.test(tekst)) return 'gastcontact';
  if (/bestelling|serveert|bedient|drank|spijs|logies|producten\/diensten|verkoopt|verhuurt|activiteiten|evenementen/.test(tekst)) return 'bediening';
  if (/mise en place|gerecht|gerechten|uitgifte|gastronomisch|menu|kook|bereidt|componenten|schoon|ruimt/.test(tekst)) return 'keuken';
  if (/voorraad|bestelt|bestellingen|inkoopt|koopt|fifo|opslag/.test(tekst)) return 'voorraad';
  if (/plant|verdeelt|instrueert|begeleidt|stuurt medewerkers|leiding|functioneren|ontwikkeling|gesprekken|overleg|hr-beleid|stemt af/.test(tekst)) return 'leidinggeven';
  if (/operationeel plan|financieel|begroot|budget|menu-engineering|proces|kwaliteitsbeleid|verbetervoorstel|efficientie|duurzaamheid/.test(tekst)) return 'bedrijfsvoering';
  if (/business plan|profileert|promoot|positioneert|onderneming|zakelijke contacten|hr-plan/.test(tekst)) return 'ondernemen';
  if (/sociaal-hygienisch|veilig|calamiteit|incident|arbo|haccp/.test(tekst)) return 'veiligheid';
  if (/evalueert|reflect|feedback/.test(tekst)) return 'reflectie';

  return 'algemeen';
}

function krijgBewijsVoorbeelden(wp, kerntaak) {
  const categorie = bepaalBewijsCategorie(wp, kerntaak);
  const bewijs = {
    gastcontact: {
      titel: 'Gastcontact en service',
      intro: 'Bewijs laat zien hoe je met gasten communiceert en inspeelt op wensen, vragen of klachten.',
      items: ['Feedback van praktijkopleider over gastcontact', 'Korte reflectie op een gastgesprek of klacht', 'Observatieformulier van ontvangst, afscheid of servicegesprek', 'Gastreactie, compliment of praktijksituatie die je beschrijft']
    },
    bediening: {
      titel: 'Bediening en service-uitvoering',
      intro: 'Bewijs laat zien dat je servicewerkzaamheden zorgvuldig voorbereidt, uitvoert en afrondt.',
      items: ['Foto of beschrijving van een gedekte tafel, bestelling of servicehandeling', 'Feedback op opnemen, klaarzetten of serveren van bestellingen', 'Observatie tijdens een dienst of evenement', "Korte reflectie op samenwerking met bediening, keuken of collega's"]
    },
    keuken: {
      titel: 'Keukenbereiding en productkwaliteit',
      intro: 'Bewijs laat zien hoe je producten, gerechten of onderdelen daarvan veilig en vakmatig bereidt.',
      items: ['Foto van mise-en-place, gerecht of eindproduct', 'Receptuur, werkplanning of productielijst', 'Feedback van praktijkopleider of chef op techniek en kwaliteit', 'Reflectie op hygiene, planning, smaak, presentatie of tempo']
    },
    voorraad: {
      titel: 'Voorraad, inkoop en registratie',
      intro: 'Bewijs laat zien dat je voorraad zorgvuldig controleert, verwerkt en registreert.',
      items: ['Bestellijst, voorraadlijst of ontvangstcontrole', 'Temperatuurregistratie, FIFO-controle of HACCP-formulier', 'Foto van correcte opslag of labeling', 'Korte toelichting op afwijkingen, derving of retouren']
    },
    leidinggeven: {
      titel: 'Plannen, begeleiden en aansturen',
      intro: "Bewijs laat zien hoe je werkzaamheden verdeelt, collega's begeleidt en afstemt op de werkvloer.",
      items: ['Werkplanning, taakverdeling of briefing', 'Feedback van medewerker, collega of praktijkopleider', 'Verslag van begeleidingsgesprek of werkoverleg', 'Reflectie op jouw manier van aansturen en samenwerken']
    },
    bedrijfsvoering: {
      titel: 'Bedrijfsvoering en verbetering',
      intro: 'Bewijs laat zien dat je processen, kwaliteit, kosten of verbeteringen onderbouwd kunt bekijken.',
      items: ['Operationeel plan, verbeterpunt of verbetervoorstel', 'Kostenberekening, begroting of analyse van cijfers', 'Kwaliteitscontrole, evaluatie of procesobservatie', 'Reflectie op efficientie, duurzaamheid, kwaliteit of resultaat']
    },
    ondernemen: {
      titel: 'Ondernemen en positioneren',
      intro: 'Bewijs laat zien hoe je nadenkt over beleid, markt, personeel, financien of profilering.',
      items: ['Onderdeel van businessplan, HR-plan of financieel plan', 'Marketinguiting, doelgroepanalyse of positioneringsvoorstel', 'Verslag van zakelijk contact of netwerkgesprek', "Evaluatie van kansen, risico's of verbeteringen voor de onderneming"]
    },
    veiligheid: {
      titel: 'Veiligheid, hygiene en procedures',
      intro: 'Bewijs laat zien dat je veilig werkt en procedures correct toepast.',
      items: ['HACCP-, schoonmaak- of veiligheidschecklist', 'Observatie van veilig en hygienisch werken', 'Korte beschrijving van incident, calamiteit of preventieve actie', 'Feedback op naleving van huisregels, Arbo of sociaal-hygienisch beleid']
    },
    reflectie: {
      titel: 'Evalueren en verbeteren',
      intro: 'Bewijs laat zien dat je feedback gebruikt en bewust werkt aan verbetering.',
      items: ['Korte reflectie: wat ging goed, wat kan beter', 'Feedbackformulier van praktijkopleider of collega', 'Voor-en-na voorbeeld van een verbetering', 'Leerdoel met concrete vervolgactie']
    },
    algemeen: {
      titel: 'Algemeen BPV-bewijs',
      intro: 'Bewijs laat zien wat je hebt gedaan, hoe je dit hebt aangepakt en wat het resultaat was.',
      items: ['Feedback van praktijkopleider', 'Observatie tijdens een dienst', 'Foto, document of product uit de praktijk', 'Korte reflectie met resultaat en verbeterpunt']
    }
  };

  return bewijs[categorie] || bewijs.algemeen;
}

function renderBewijsVoorbeelden(wp, kerntaak) {
  const bewijs = krijgBewijsVoorbeelden(wp, kerntaak);
  return `
    <div class="evidence-panel">
      <strong class="evidence-title">Voorbeelden van BPV-bewijs: ${bewijs.titel}</strong>
      <p>${bewijs.intro}</p>
      <ul class="evidence-list">
        ${bewijs.items.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </div>
  `;
}

function maakKorteWerkprocesToelichting(wp) {
  const titel = wp.titel || 'Dit werkproces';
  return `De student voert dit werkproces uit in een passende praktijksituatie. Daarbij is zichtbaar wat de student doet, hoe zorgvuldig en gastgericht dit gebeurt en welk resultaat dit oplevert.`;
}

function maakStudentTaal(wp, kerntaak) {
  const titel = wp.titel || 'dit werkproces';
  const kerntaakTitel = kerntaak ? kerntaak.titel : 'deze kerntaak';
  const resultaat = wp.resultaat || 'Het werkproces is zorgvuldig uitgevoerd en het resultaat kan worden toegelicht.';

  return `Bij het werkproces "${titel}" laat je op stage zien dat je een taak uitvoert die hoort bij "${kerntaakTitel}". Je werkt netjes, veilig en gastgericht. Je houdt je aan de afspraken van het leerbedrijf en stemt op tijd af met collega's of je praktijkopleider. Na afloop kun je uitleggen wat je hebt gedaan, waarom je dat zo hebt aangepakt en wat het resultaat was. Als bewijs kun je bijvoorbeeld feedback, een observatie, een foto, een planning, een product uit de praktijk of een korte reflectie gebruiken. Het gewenste resultaat is: ${resultaat}`;
}

function maakChecklistTekst(wp) {
  const resultaat = wp.resultaat || 'Het werkproces is uitgevoerd volgens de afspraken van het leerbedrijf en de eisen van het kwalificatiedossier.';
  return `Te observeren in de praktijk. Let op de uitvoering, de mate van zelfstandigheid, de samenwerking, het veilig en zorgvuldig werken en het behaalde resultaat. Verwacht resultaat: ${resultaat}`;
}

function handleReadMoreToggle(linkElement) {
  const card = linkElement.closest('.summary-card');
  if (card.classList.contains('expanded')) {
    card.classList.remove('expanded');
    linkElement.innerText = 'Lees meer...';
  } else {
    card.classList.add('expanded');
    linkElement.innerText = 'Lees minder';
  }
}

function prepareAccordions() {
  const cards = Array.from(document.querySelectorAll('.card'));

  cards.forEach(card => {
    card.classList.add('accordion-card');
    card.classList.remove('open');

    const header = card.querySelector('.card-header');
    if (!header) return;
    header.setAttribute('role', 'button');
    header.setAttribute('tabindex', '0');
    header.setAttribute('aria-expanded', 'false');

    const toggleCard = () => {
      const wasOpen = card.classList.contains('open');

      cards.forEach(otherCard => {
        otherCard.classList.remove('open');
        const otherHeader = otherCard.querySelector('.card-header');
        if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
      });

      if (!wasOpen) {
        card.classList.add('open');
        header.setAttribute('aria-expanded', 'true');

        requestAnimationFrame(() => {
          card.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    };

    header.addEventListener('click', toggleCard);
    header.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleCard();
      }
    });
  });
}


function printBPVChecklist() {
  if (actiefDomeinId === 'generiek') return;

  const { domein, profiel } = getActiefDomeinEnProfiel();
  if (!domein || !profiel) return;

  const kerntaakSleutels = kwalificatieDossierDatabase.profielKerntaken[profiel.id] || [];
  const datum = new Date().toLocaleDateString('nl-NL');
  const sections = kerntaakSleutels.map(sleutel => {
    const kerntaak = kwalificatieDossierDatabase.kerntakenDatabase[sleutel];
    if (!kerntaak) return '';

    const werkprocessen = (kerntaak.werkprocessen || []).map(wp => `
      <tr>
        <td class="code-cell">${wp.code}</td>
        <td>
          <strong>${wp.titel}</strong><br>
          <span>${maakChecklistTekst(wp)}</span>
        </td>
        <td class="check-cell"></td>
        <td class="note-cell"></td>
      </tr>
    `).join('');

    return `
      <section>
        <h2>${kerntaak.code}: ${kerntaak.titel}</h2>
        <p>${kerntaak.type}</p>
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Werkproces</th>
              <th>Aangetoond</th>
              <th>Opmerking / bewijs</th>
            </tr>
          </thead>
          <tbody>${werkprocessen}</tbody>
        </table>
      </section>
    `;
  }).join('');

  const printVenster = window.open('', '_blank');
  if (!printVenster) return;

  printVenster.document.write(`
    <!DOCTYPE html>
    <html lang="nl">
    <head>
      <meta charset="UTF-8">
      <title>BPV-checklist - ${profiel.naam}</title>
      <style>
        body { font-family: Arial, sans-serif; color: #222; margin: 28px; line-height: 1.35; }
        .print-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; margin-bottom: 18px; }
        .print-logo { width: 118px; height: auto; object-fit: contain; }
        h1 { color: #0a62af; margin: 0 0 6px; }
        h2 { color: #0a62af; font-size: 18px; margin: 24px 0 4px; }
        .meta { margin-bottom: 20px; color: #555; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; table-layout: fixed; }
        th { background: #0a62af; color: white; text-align: left; }
        th, td { border: 1px solid #cbd5e1; padding: 8px; vertical-align: top; }
        th:first-child { width: 118px; }
        .code-cell { width: 118px; white-space: nowrap; font-weight: bold; color: #0a62af; }
        .check-cell { width: 86px; }
        .note-cell { width: 210px; }
        .signature { margin-top: 32px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .line { border-top: 1px solid #222; padding-top: 6px; margin-top: 36px; }
        @media print { body { margin: 14mm; } section { break-inside: avoid; } }
      </style>
    </head>
    <body>
      <div class="print-header">
        <div>
          <h1>BPV-checklist</h1>
          <div class="meta">
            <strong>Opleiding:</strong> ${profiel.naam} (${profiel.niveau})<br>
            <strong>Domein:</strong> ${domein.titel}<br>
            <strong>Crebo:</strong> ${profiel.crebo}<br>
            <strong>Datum:</strong> ${datum}
          </div>
        </div>
        <img class="print-logo" src="LOGO.jpg" alt="Albeda Horecacollege logo">
      </div>
      ${sections}
      <div class="signature">
        <div class="line">Student</div>
        <div class="line">Praktijkopleider</div>
      </div>
    </body>
    </html>
  `);
  printVenster.document.close();
  printVenster.focus();
  printVenster.print();
}

function renderDossierContent() {
  const domein = kwalificatieDossierDatabase.domeinen.find(d => d.id === actiefDomeinId);
  const profiel = domein.profielen.find(p => p.id === actiefProfielId);
  const targetZone = document.getElementById('cards-render-target');
  if (!targetZone || !domein || !profiel) return;

  document.getElementById('app-subtitle').innerText = `Domein: ${domein.titel} | Crebo Dossier ${domein.crebo}`;
  updateRolInstructieTekst(actieveRol);

  let htmlOutput = '';
  const kerntaakSleutels = kwalificatieDossierDatabase.profielKerntaken[profiel.id] || [];

  // SLUITENDE IMPLEMENTATIE: Pakt nu direct de vaste opgemaakte string uit data.js
  if (actiefDomeinId !== 'generiek') {
    htmlOutput += `
      <div class="summary-card">
        <h4>Profiel & Beroepstypering</h4>
        <div class="summary-text-block">
          ${profiel.samenvatting}
        </div>
        <span class="read-more-link" onclick="handleReadMoreToggle(this)">Lees meer...</span>
      </div>
    `;
  } else {
    htmlOutput += `
      <div class="summary-card">
        <h4>Wettelijke Toelichting</h4>
        <div class="verantwoording-accent" style="color: #4a5568; line-height: 1.5;">
          ${profiel.typering}
        </div>
      </div>
    `;
  }

  if (actiefDomeinId !== 'generiek' && profiel.pdfLink && profiel.pdfLink !== "") {
    htmlOutput += `
      <div class="download-wrapper">
        <a href="${profiel.pdfLink}" target="_blank" rel="noopener" class="download-pdf-btn">
          Open / Download Dossier (PDF)
        </a>
        <button type="button" class="print-bpv-btn" onclick="printBPVChecklist()">
          Print BPV-checklist
        </button>
      </div>
    `;
  }


  if (kerntaakSleutels.length === 0) {
    htmlOutput += `<p style="padding:20px; background: var(--white); border:1px solid var(--albeda-gray);">Data volgt.</p>`;
  } else {
    kerntaakSleutels.forEach(sleutel => {
      const kerntaak = kwalificatieDossierDatabase.kerntakenDatabase[sleutel];
      if (!kerntaak) return;

      htmlOutput += `
        <div class="card">
          <div class="card-header">
            <h3>${kerntaak.code}: ${kerntaak.titel}</h3>
            <span class="badge">${kerntaak.type}</span>
          </div>
          <div class="card-body">
            <div class="view-section docent-view">
              <div class="meta-vlak-docent">
                <p style="margin-bottom: 10px;"><strong>Complexiteitsanalyse:</strong> ${kerntaak.complexiteit}</p>
                <p style="margin-bottom: 10px;"><strong>Verantwoordelijkheid:</strong> ${kerntaak.verantwoordelijkheid}</p>
                <strong>Gevalideerde Onderwijskundige Vakkennis:</strong>
                <ul style="margin-left: 15px; margin-top: 5px;">
                  ${kerntaak.vakkennis ? kerntaak.vakkennis.map(kennis => `<li>${kennis}</li>`).join('') : '<li>Informatie volgt.</li>'}
                </ul>
              </div>
            </div>
            ${kerntaak.werkprocessen.map(wp => `
              <div class="wp-block">
                <div class="wp-title">${wp.code} - ${wp.titel}</div>
                ${`<p class="wp-summary">${maakKorteWerkprocesToelichting(wp)}</p>`}
                <div class="view-section student-view">
                  <div class="student-language-card">
                    <strong>CONCREET UITGELEGD</strong>
                    <p>${maakStudentTaal(wp, kerntaak)}</p>
                    ${renderBewijsVoorbeelden(wp, kerntaak)}
                  </div>
                </div>
                <div class="view-section docent-view pleider-view">
                  <p style="margin-bottom: 12px; font-size: 0.95rem; color: #4a5568; font-style: italic;">${wp.omschrijving || wp.samenvatting || "Informatie volgt."}</p>
                </div>
                <div class="view-section pleider-view docent-view" style="margin-bottom: 15px; background: #f0f9ff; padding: 12px; border-radius: 4px; border: 1px solid #bae6fd;">
                  <strong style="color: #0369a1; font-size: 0.85rem; text-transform: uppercase; display: block; margin-bottom: 2px;">Concreet op te leveren resultaat op de werkvloer:</strong>
                  <span style="color: var(--albeda-dark); font-weight: bold; font-size: 0.95rem;">${wp.resultaat || "Het werkproces is aantoonbaar uitgevoerd volgens het kwalificatiedossier."}</span>
                </div>
                <div class="view-section student-view docent-view">
                  <strong style="font-size: 0.9rem; color: var(--albeda-blue); display: block; margin-bottom: 4px;">Verwacht gedrag (Hoe laat je dit zien op stage):</strong>
                  <ul class="check-list">
                    ${(wp.gedrag || []).map(gedragItem => `<li>${gedragItem}</li>`).join('') || `<li>Laat zien dat je dit werkproces zorgvuldig en beroepsgericht uitvoert.</li>`}
                  </ul>
                </div>
                <div class="tag-container">
                  ${(wp.competenties || []).map(comp => `<span class="tag">${comp}</span>`).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });
  }
  targetZone.innerHTML = htmlOutput;
  prepareAccordions();
  executeLiveSearch();
}
