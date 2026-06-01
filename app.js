// app.js
let actiefDomeinId = '';
let actiefProfielId = '';
let actieveRol = 'student';
let matrixIsOpen = false;
let actiefCurriculumProfielId = '';
let documentViewerBlobUrl = '';
let actieveTaal = localStorage.getItem('ahcrLanguage') || 'nl';

const uiTeksten = {
  nl: {
    appSubtitle: 'Dossier- & BPV-Kompas Portaal',
    curriculumSubtitle: 'Curriculum per opleiding',
    landingTitle: 'Welkom bij het Onderwijs- & Kwalificatieportaal',
    landingIntro: 'Dit interactieve portaal is speciaal ontwikkeld voor de modernisering van de horeca-opleidingen binnen het Albeda Horecacollege. Selecteer hieronder een van de hoofddomeinen of verplichte examenvakken om te starten:',
    landingStudent: '<strong>De Student:</strong> Krijgt direct inzicht in het verwachte praktijkgedrag en de guest journey tijdens de stageperiode;',
    landingTrainer: '<strong>De Praktijkopleider:</strong> Ziet in een oogopslag de kerntaken en het concreet op te leveren resultaat op de werkvloer om studenten objectief te kunnen begeleiden;',
    landingTeacher: '<strong>De Docent:</strong> Beschikt over de volledige onderwijskundige structuur, de formele complexiteit en de geverifieerde vakkennis per mbo-niveau.',
    genericCardTitle: 'Generieke Onderdelen & Keuzedelen',
    genericCardText: 'Wettelijke Exameneisen Nederlands, Rekenen, LOB & Engels',
    curriculumTitle: 'Curriculum',
    curriculumCardText: 'Leerjaren, onderwijsperiodes en schoolinhoud per opleiding',
    backMain: 'Terug naar Hoofddomeinen',
    curriculumIntro: 'Kies een opleiding en bekijk per leerjaar en onderwijsperiode welke thema\'s, vaardigheden en gekoppelde werkprocessen centraal staan op school.',
    chooseProgramme: 'Kies opleiding:',
    searchPlaceholder: 'Live zoeken in dossier (bv. HACCP)...',
    chooseMbo: 'Kies MBO-Opleiding / Uitstroom:',
    levelCompare: 'Niveau Vergelijker:',
    openMatrix: 'Open Vergelijkingsmatrix',
    closeMatrix: 'Sluit Vergelijkingsmatrix',
    matrixTitle: 'Vergelijkingsmatrix MBO-Niveaus',
    matrixIntro: 'Vergelijk direct de stijging in complexiteit en verschuiving in verantwoordelijkheid tussen de uitstroomprofielen.',
    chooseRole: 'Kies uw rol (Invalshoek):',
    roleStudentBtn: 'Ik ben Student',
    roleTrainerBtn: 'Ik ben Praktijkopleider',
    roleTeacherBtn: 'Ik ben Docent',
    backToApp: 'Terug naar app',
    openExternal: 'Open extern',
    footerInfoTitle: 'Disclaimer & Info',
    footerDisclaimer: 'Dit portaal dient ter ondersteuning van studenten, docenten en praktijkopleiders tijdens de beroepspraktijkvorming (BPV). De getoonde kerntaken en geverifieerde werkprocessen zijn gebaseerd op de formele, landelijk vastgestelde kwalificatiedossiers.',
    footerRights: 'Albeda Horecacollege. Alle rechten voorbehouden.',
    genericIntroTitle: 'Generieke onderdelen',
    genericIntroText: 'Hier staan de wettelijke generieke eisen voor het gekozen mbo-niveau. Deze onderdelen horen bij diplomering, maar zijn geen BPV-checklist voor de beroepspraktijk.',
    studentSummaryTitle: 'Jouw stage in gewone taal',
    studentSummaryText: 'Je bekijkt nu {profile} ({level}). Open een basisdeel of profieldeel en kijk per werkproces wat je concreet op stage moet laten zien. Gebruik dit als kompas voor je gedrag, je bewijs en je gesprek met je praktijkopleider.',
    trainerSummaryTitle: 'Begeleiden en observeren op de werkvloer',
    trainerSummaryText: 'U bekijkt nu {profile} ({level}). De werkprocessen helpen om gericht te observeren wat de student uitvoert, hoe zelfstandig dat gebeurt en welk resultaat zichtbaar wordt in de praktijk.',
    teacherSummaryTitle: 'Onderwijskundige structuur en dossiercontrole',
    teacherSummaryText: 'U bekijkt nu {profile} ({level}). De basisdelen en profieldelen tonen de formele KD-structuur met werkprocessen, complexiteit, verantwoordelijkheid en vakkennis.',
    studentBlocks: [['Wat moet ik doen?', 'Lees per werkproces welke taak centraal staat en welk gedrag daarbij hoort.'], ['Wat kan ik verzamelen?', 'Denk aan foto\'s, feedback, observaties, producten, planningen of korte reflecties.'], ['Wanneer is het goed?', 'Als je kunt uitleggen wat je deed, waarom je dat deed en welk resultaat dat opleverde.']],
    trainerBlocks: [['Waar let ik op?', 'Observeer concreet gedrag, vakmatige uitvoering, samenwerking en gastgerichtheid.'], ['Wat bespreek ik?', 'Koppel feedback aan het werkproces en benoem wat al lukt en wat de volgende stap is.'], ['Wat is bewijs?', 'Gebruik praktijkvoorbeelden, producten, observaties en feedbackmomenten als onderbouwing.']],
    teacherBlocks: [['Structuur', 'Controleer de samenhang tussen basisdeel, profieldeel en werkprocessen.'], ['Duiding', 'Gebruik complexiteit en verantwoordelijkheid om niveauverschillen te bespreken.'], ['Begeleiding', 'Verbind de formele eisen aan onderwijsactiviteiten, BPV-opdrachten en beoordeling.']],
    profileSummary: 'Profiel & Beroepstypering',
    legalExplanation: 'Wettelijke Toelichting',
    readMore: 'Lees meer...',
    readLess: 'Lees minder',
    dossierPdf: 'Open / Download Dossier (PDF)',
    bpvChecklist: 'Open BPV-checklist',
    dataPending: 'Data volgt.',
    complexity: 'Complexiteitsanalyse:',
    responsibility: 'Verantwoordelijkheid:',
    knowledge: 'Gevalideerde Onderwijskundige Vakkennis:',
    infoPending: 'Informatie volgt.',
    concreteExplained: 'CONCREET UITGELEGD',
    resultOnFloor: 'Concreet op te leveren resultaat op de werkvloer:',
    defaultResult: 'Het werkproces is aantoonbaar uitgevoerd volgens het kwalificatiedossier.',
    expectedBehaviour: 'Verwacht gedrag (Hoe laat je dit zien op stage):',
    defaultBehaviour: 'Laat zien dat je dit werkproces zorgvuldig en beroepsgericht uitvoert.',
    domainSubtitle: 'Domein: {domain} | Crebo Dossier {crebo}',
    curriculumConcept: 'Conceptindeling: gebruik dit als basis om het actuele onderwijsprogramma per periode verder te vullen of aan te scherpen.',
    schoolContent: 'Op school behandeld',
    workprocessLink: 'Koppeling met werkprocessen',
    workprocessesLinkedLater: 'Werkprocessen worden in deze periode door de opleiding gekoppeld.',
    curriculumNote: 'Deze periodekaart is bedoeld als onderwijsplanning en kan later worden aangevuld met lessen, opdrachten, toetsen en BPV-koppelingen.',
    year: 'LEERJAAR',
    period: 'ONDERWIJSPERIODE',
    matrixProfile: 'MBO Uitstroomprofiel',
    matrixComplexity: 'Complexiteitsniveau (KD)',
    matrixResponsibility: 'Verantwoordelijkheidsgrens',
    seeTasks: 'Zie de specifieke kerntaken hieronder.',
    seeResponsibilities: 'Zie de specifieke verantwoordelijkheden.'
  },
  en: {
    appSubtitle: 'Qualification & Work Placement Compass Portal',
    curriculumSubtitle: 'Curriculum by programme',
    landingTitle: 'Welcome to the Education & Qualification Portal',
    landingIntro: 'This interactive portal has been developed for the renewed hospitality programmes at Albeda Horecacollege. Select one of the main domains or compulsory examination subjects below to begin:',
    landingStudent: '<strong>Student:</strong> Gains immediate insight into the expected professional behaviour and guest journey during work placement;',
    landingTrainer: '<strong>Workplace Trainer:</strong> Sees the core tasks and concrete workplace outcomes at a glance, making student guidance more objective;',
    landingTeacher: '<strong>Teacher:</strong> Has access to the full educational structure, formal complexity and verified professional knowledge for each mbo level.',
    genericCardTitle: 'General Components & Electives',
    genericCardText: 'Statutory examination requirements: Dutch, Mathematics, Career Development, Citizenship and English',
    curriculumTitle: 'Curriculum',
    curriculumCardText: 'Academic years, teaching periods and school content by programme',
    backMain: 'Back to Main Domains',
    curriculumIntro: 'Choose a programme and view the themes, skills and linked work processes covered at school for each academic year and teaching period.',
    chooseProgramme: 'Choose programme:',
    searchPlaceholder: 'Search the dossier live (e.g. HACCP)...',
    chooseMbo: 'Choose MBO Programme / Profile:',
    levelCompare: 'Level Comparison:',
    openMatrix: 'Open Comparison Matrix',
    closeMatrix: 'Close Comparison Matrix',
    matrixTitle: 'MBO Level Comparison Matrix',
    matrixIntro: 'Compare the increase in complexity and the shift in responsibility between the qualification profiles.',
    chooseRole: 'Choose your role (perspective):',
    roleStudentBtn: 'I am a Student',
    roleTrainerBtn: 'I am a Workplace Trainer',
    roleTeacherBtn: 'I am a Teacher',
    backToApp: 'Back to app',
    openExternal: 'Open externally',
    footerInfoTitle: 'Disclaimer & Information',
    footerDisclaimer: 'This portal supports students, teachers and workplace trainers during work placement. The core tasks and verified work processes shown are based on the formal, nationally established qualification dossiers.',
    footerRights: 'Albeda Horecacollege. All rights reserved.',
    genericIntroTitle: 'General components',
    genericIntroText: 'This section shows the statutory general requirements for the selected mbo level. These components are part of qualification, but they are not a work placement checklist for professional practice.',
    studentSummaryTitle: 'Your work placement in plain language',
    studentSummaryText: 'You are viewing {profile} ({level}). Open a basic component or profile component and check what each work process asks you to demonstrate during work placement. Use this as a compass for your behaviour, your evidence and your conversation with your workplace trainer.',
    trainerSummaryTitle: 'Guidance and observation in the workplace',
    trainerSummaryText: 'You are viewing {profile} ({level}). The work processes help you observe what the student does, how independently they work and what result becomes visible in practice.',
    teacherSummaryTitle: 'Educational structure and dossier check',
    teacherSummaryText: 'You are viewing {profile} ({level}). The basic components and profile components show the formal qualification structure with work processes, complexity, responsibility and professional knowledge.',
    studentBlocks: [['What should I do?', 'Read which task is central in each work process and which behaviour is expected.'], ['What can I collect?', 'Think of photos, feedback, observations, products, schedules or short reflections.'], ['When is it good enough?', 'When you can explain what you did, why you did it and what result it produced.']],
    trainerBlocks: [['What should I look for?', 'Observe concrete behaviour, professional execution, cooperation and guest focus.'], ['What should I discuss?', 'Link feedback to the work process and name what already works well and what the next step is.'], ['What counts as evidence?', 'Use practical examples, products, observations and feedback moments as evidence.']],
    teacherBlocks: [['Structure', 'Check the coherence between basic components, profile components and work processes.'], ['Interpretation', 'Use complexity and responsibility to discuss differences between levels.'], ['Guidance', 'Connect the formal requirements to learning activities, work placement assignments and assessment.']],
    profileSummary: 'Profile & Occupational Description',
    legalExplanation: 'Statutory Explanation',
    readMore: 'Read more...',
    readLess: 'Read less',
    dossierPdf: 'Open / Download Dossier (PDF)',
    bpvChecklist: 'Open Work Placement Checklist',
    dataPending: 'Data to follow.',
    complexity: 'Complexity analysis:',
    responsibility: 'Responsibility:',
    knowledge: 'Verified Educational Professional Knowledge:',
    infoPending: 'Information to follow.',
    concreteExplained: 'EXPLAINED CONCRETELY',
    resultOnFloor: 'Concrete workplace outcome to be delivered:',
    defaultResult: 'The work process has demonstrably been carried out according to the qualification dossier.',
    expectedBehaviour: 'Expected behaviour (how to demonstrate this during work placement):',
    defaultBehaviour: 'Show that you carry out this work process carefully and professionally.',
    domainSubtitle: 'Domain: {domain} | Crebo Dossier {crebo}',
    curriculumConcept: 'Concept structure: use this as a basis for further developing or refining the current programme content by period.',
    schoolContent: 'Covered at school',
    workprocessLink: 'Link to work processes',
    workprocessesLinkedLater: 'Work processes will be linked to this period by the programme team.',
    curriculumNote: 'This period card is intended as a teaching plan and can later be supplemented with lessons, assignments, tests and work placement links.',
    year: 'ACADEMIC YEAR',
    period: 'TEACHING PERIOD',
    matrixProfile: 'MBO Qualification Profile',
    matrixComplexity: 'Complexity Level (QD)',
    matrixResponsibility: 'Scope of Responsibility',
    seeTasks: 'See the specific core tasks below.',
    seeResponsibilities: 'See the specific responsibilities.'
  }
};

function t(sleutel, waarden = {}) {
  const taalSet = uiTeksten[actieveTaal] || uiTeksten.nl;
  let tekst = taalSet[sleutel] ?? uiTeksten.nl[sleutel] ?? sleutel;
  if (typeof tekst !== 'string') return tekst;
  Object.keys(waarden).forEach(key => {
    tekst = tekst.replaceAll(`{${key}}`, waarden[key]);
  });
  return tekst;
}

function veld(item, naam) {
  if (!item) return '';
  const engelsVeld = `${naam}_en`;
  return actieveTaal === 'en' && item[engelsVeld] ? item[engelsVeld] : (item[naam] || '');
}

function applyLanguageToStaticText() {
  document.documentElement.lang = actieveTaal === 'en' ? 'en' : 'nl';
  document.querySelectorAll('[data-i18n]').forEach(element => {
    element.innerText = t(element.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-html]').forEach(element => {
    element.innerHTML = t(element.getAttribute('data-i18n-html'));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    element.setAttribute('placeholder', t(element.getAttribute('data-i18n-placeholder')));
  });
  document.querySelectorAll('.language-btn').forEach(button => button.classList.remove('active'));
  const activeButton = document.getElementById(`lang-${actieveTaal}`);
  if (activeButton) activeButton.classList.add('active');
}

function switchLanguage(taal) {
  actieveTaal = taal === 'en' ? 'en' : 'nl';
  localStorage.setItem('ahcrLanguage', actieveTaal);
  applyLanguageToStaticText();

  const vorigDomeinId = actiefDomeinId;
  const vorigProfielId = actiefProfielId;
  const vorigCurriculumProfielId = actiefCurriculumProfielId;

  if (document.getElementById('curriculum-layer')?.style.display === 'block') {
    openCurriculumDashboard();
    if (vorigCurriculumProfielId) {
      actiefCurriculumProfielId = vorigCurriculumProfielId;
      const select = document.getElementById('dropdown-curriculum-profielen');
      if (select) select.value = vorigCurriculumProfielId;
      renderCurriculumContent();
    }
    return;
  }

  if (document.getElementById('dashboard-layer')?.style.display === 'block' && vorigDomeinId) {
    openDomeinDashboard(vorigDomeinId);
    if (vorigProfielId) {
      actiefProfielId = vorigProfielId;
      const selectDropdown = document.getElementById('dropdown-profielen');
      if (selectDropdown) selectDropdown.value = vorigProfielId;
      renderDossierContent();
    }
  }
}
function resetDocumentViewerSource() {
  if (documentViewerBlobUrl && window.URL) {
    URL.revokeObjectURL(documentViewerBlobUrl);
    documentViewerBlobUrl = '';
  }
}

function toonDocumentViewer(titel) {
  const viewer = document.getElementById('document-viewer');
  const title = document.getElementById('document-viewer-title');
  if (!viewer) return false;

  if (title) title.innerText = titel || 'Document';
  viewer.classList.add('open');
  viewer.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  return true;
}

function openDocumentViewer(event, documentUrl, titel) {
  if (event) event.preventDefault();

  const frame = document.getElementById('document-viewer-frame');
  const external = document.getElementById('document-viewer-external');
  if (!frame || !external || !toonDocumentViewer(titel)) {
    window.open(documentUrl, '_blank', 'noopener');
    return;
  }

  resetDocumentViewerSource();
  frame.removeAttribute('srcdoc');
  frame.src = documentUrl;
  external.href = documentUrl;
}

function openHtmlDocumentViewer(html, titel) {
  const frame = document.getElementById('document-viewer-frame');
  const external = document.getElementById('document-viewer-external');
  if (!frame || !external || !toonDocumentViewer(titel)) {
    const fallback = window.open('', '_blank', 'noopener');
    if (fallback) {
      fallback.document.write(html);
      fallback.document.close();
    }
    return;
  }

  resetDocumentViewerSource();
  frame.removeAttribute('src');
  frame.srcdoc = html;

  if (window.Blob && window.URL) {
    documentViewerBlobUrl = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    external.href = documentViewerBlobUrl;
  } else {
    external.href = '#';
  }
}

function closeDocumentViewer() {
  const viewer = document.getElementById('document-viewer');
  const frame = document.getElementById('document-viewer-frame');
  if (!viewer) return;

  viewer.classList.remove('open');
  viewer.setAttribute('aria-hidden', 'true');
  if (frame) {
    frame.removeAttribute('srcdoc');
    frame.src = 'about:blank';
  }
  resetDocumentViewerSource();
  document.body.style.overflow = '';
}

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeDocumentViewer();
  });
}
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
  if (matrixBtn) matrixBtn.innerText = t('openMatrix');

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
    
    let weergaveNaam = `${veld(profiel, 'naam')} (${veld(profiel, 'niveau')})`;
    
    if (profiel.id === 'medewerker_hospitality') {
      weergaveNaam = `${veld(profiel, 'naam')} (${veld(profiel, 'niveau')}) | Gastvrijheidstalent`;
    } else if (profiel.id === 'zelfstandig_medewerker_hospitality') {
      weergaveNaam = `${veld(profiel, 'naam')} (${veld(profiel, 'niveau')}) | Hospitality Medewerker`;
    } else if (profiel.id === 'leidinggevende_hospitality') {
      weergaveNaam = `${veld(profiel, 'naam')} (${veld(profiel, 'niveau')}) | Hospitality Manager`;
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
  document.getElementById('app-subtitle').innerText = t('appSubtitle');
  scrollToPageTop();
}

function getCurriculumProfielen() {
  return kwalificatieDossierDatabase.domeinen
    .filter(domein => domein.id !== 'generiek')
    .flatMap(domein => domein.profielen.map(profiel => ({
      domeinId: domein.id,
      domeinTitel: veld(domein, 'titel'),
      profiel
    })));
}

function openCurriculumDashboard() {
  document.getElementById('landing-layer').style.display = 'none';
  document.getElementById('dashboard-layer').style.display = 'none';
  document.getElementById('curriculum-layer').style.display = 'block';
  document.getElementById('app-subtitle').innerText = t('curriculumSubtitle');

  const profielen = getCurriculumProfielen();
  const select = document.getElementById('dropdown-curriculum-profielen');
  if (!select || profielen.length === 0) return;

  select.innerHTML = '';
  profielen.forEach(item => {
    const optie = document.createElement('option');
    optie.value = item.profiel.id;
    optie.innerText = `${veld(item.profiel, 'naam')} (${veld(item.profiel, 'niveau')}) - ${item.domeinTitel}`;
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
  document.getElementById('app-subtitle').innerText = t('appSubtitle');
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
      titel: veld(wp, 'titel'),
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
      <h4>${veld(profiel, 'naam')} (${veld(profiel, 'niveau')})</h4>
      <p class="curriculum-note">${t('curriculumConcept')}</p>
    </div>
  `;

  for (let leerjaar = 1; leerjaar <= 3; leerjaar++) {
    html += `
      <div class="curriculum-year">
        <div class="curriculum-year-header" role="button" tabindex="0" aria-expanded="false">
          <h3>${t('year')} ${leerjaar}</h3>
        </div>
        <div class="curriculum-year-body">
    `;

    for (let periode = 1; periode <= 4; periode++) {
      const themas = getCurriculumThemas(leerjaar, periode, veld(profiel, 'naam'));
      const gekoppeldeWerkprocessen = verdeelWerkprocessenOverPeriode(werkprocessen, periodeIndex);
      periodeIndex++;

      html += `
        <div class="curriculum-period">
          <div class="curriculum-period-header" role="button" tabindex="0" aria-expanded="false">
            <h4>${t('period')} ${periode}</h4>
          </div>
          <div class="curriculum-period-body">
            <div class="curriculum-block-grid">
              <div class="curriculum-block">
                <strong>${t('schoolContent')}</strong>
                <ul>${themas.map(thema => `<li>${thema}</li>`).join('')}</ul>
              </div>
              <div class="curriculum-block">
                <strong>${t('workprocessLink')}</strong>
                <ul>${gekoppeldeWerkprocessen.map(wp => `<li>${wp.code} - ${wp.titel}</li>`).join('') || `<li>${t('workprocessesLinkedLater')}</li>`}</ul>
              </div>
            </div>
            <p class="curriculum-note">${t('curriculumNote')}</p>
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
  const profielNaam = profiel ? veld(profiel, 'naam') : (actieveTaal === 'en' ? 'this programme' : 'deze opleiding');
  const niveau = profiel ? veld(profiel, 'niveau') : (actieveTaal === 'en' ? 'the selected level' : 'het gekozen niveau');

  if (actiefDomeinId === 'generiek') {
    introBox.innerHTML = `
      <h3>${t('genericIntroTitle')}</h3>
      <p>${t('genericIntroText')}</p>
    `;
    return;
  }

  const rolTeksten = {
    student: {
      titel: t('studentSummaryTitle'),
      tekst: t('studentSummaryText', { profile: profielNaam, level: niveau }),
      blokken: t('studentBlocks')
    },
    pleider: {
      titel: t('trainerSummaryTitle'),
      tekst: t('trainerSummaryText', { profile: profielNaam, level: niveau }),
      blokken: t('trainerBlocks')
    },
    docent: {
      titel: t('teacherSummaryTitle'),
      tekst: t('teacherSummaryText', { profile: profielNaam, level: niveau }),
      blokken: t('teacherBlocks')
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
    if (knop) knop.innerText = t('closeMatrix');
    genereerMatrixTabel();
    matrixIsOpen = true;
  } else {
    if (paneel) paneel.style.display = 'none';
    if (knop) knop.innerText = t('openMatrix');
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
  const bewijsNl = {
    gastcontact: { titel: 'Gastcontact en service', intro: 'Bewijs laat zien hoe je met gasten communiceert en inspeelt op wensen, vragen of klachten.', items: ['Feedback van praktijkopleider over gastcontact', 'Korte reflectie op een gastgesprek of klacht', 'Observatieformulier van ontvangst, afscheid of servicegesprek', 'Gastreactie, compliment of praktijksituatie die je beschrijft'] },
    bediening: { titel: 'Bediening en service-uitvoering', intro: 'Bewijs laat zien dat je servicewerkzaamheden zorgvuldig voorbereidt, uitvoert en afrondt.', items: ['Foto of beschrijving van een gedekte tafel, bestelling of servicehandeling', 'Feedback op opnemen, klaarzetten of serveren van bestellingen', 'Observatie tijdens een dienst of evenement', "Korte reflectie op samenwerking met bediening, keuken of collega's"] },
    keuken: { titel: 'Keukenbereiding en productkwaliteit', intro: 'Bewijs laat zien hoe je producten, gerechten of onderdelen daarvan veilig en vakmatig bereidt.', items: ['Foto van mise-en-place, gerecht of eindproduct', 'Receptuur, werkplanning of productielijst', 'Feedback van praktijkopleider of chef op techniek en kwaliteit', 'Reflectie op hygiene, planning, smaak, presentatie of tempo'] },
    voorraad: { titel: 'Voorraad, inkoop en registratie', intro: 'Bewijs laat zien dat je voorraad zorgvuldig controleert, verwerkt en registreert.', items: ['Bestellijst, voorraadlijst of ontvangstcontrole', 'Temperatuurregistratie, FIFO-controle of HACCP-formulier', 'Foto van correcte opslag of labeling', 'Korte toelichting op afwijkingen, derving of retouren'] },
    leidinggeven: { titel: 'Plannen, begeleiden en aansturen', intro: "Bewijs laat zien hoe je werkzaamheden verdeelt, collega's begeleidt en afstemt op de werkvloer.", items: ['Werkplanning, taakverdeling of briefing', 'Feedback van medewerker, collega of praktijkopleider', 'Verslag van begeleidingsgesprek of werkoverleg', 'Reflectie op jouw manier van aansturen en samenwerken'] },
    bedrijfsvoering: { titel: 'Bedrijfsvoering en verbetering', intro: 'Bewijs laat zien dat je processen, kwaliteit, kosten of verbeteringen onderbouwd kunt bekijken.', items: ['Operationeel plan, verbeterpunt of verbetervoorstel', 'Kostenberekening, begroting of analyse van cijfers', 'Kwaliteitscontrole, evaluatie of procesobservatie', 'Reflectie op efficientie, duurzaamheid, kwaliteit of resultaat'] },
    ondernemen: { titel: 'Ondernemen en positioneren', intro: 'Bewijs laat zien hoe je nadenkt over beleid, markt, personeel, financien of profilering.', items: ['Onderdeel van businessplan, HR-plan of financieel plan', 'Marketinguiting, doelgroepanalyse of positioneringsvoorstel', 'Verslag van zakelijk contact of netwerkgesprek', "Evaluatie van kansen, risico's of verbeteringen voor de onderneming"] },
    veiligheid: { titel: 'Veiligheid, hygiene en procedures', intro: 'Bewijs laat zien dat je veilig werkt en procedures correct toepast.', items: ['HACCP-, schoonmaak- of veiligheidschecklist', 'Observatie van veilig en hygienisch werken', 'Korte beschrijving van incident, calamiteit of preventieve actie', 'Feedback op naleving van huisregels, Arbo of sociaal-hygienisch beleid'] },
    reflectie: { titel: 'Evalueren en verbeteren', intro: 'Bewijs laat zien dat je feedback gebruikt en bewust werkt aan verbetering.', items: ['Korte reflectie: wat ging goed, wat kan beter', 'Feedbackformulier van praktijkopleider of collega', 'Voor-en-na voorbeeld van een verbetering', 'Leerdoel met concrete vervolgactie'] },
    algemeen: { titel: 'Algemeen BPV-bewijs', intro: 'Bewijs laat zien wat je hebt gedaan, hoe je dit hebt aangepakt en wat het resultaat was.', items: ['Feedback van praktijkopleider', 'Observatie tijdens een dienst', 'Foto, document of product uit de praktijk', 'Korte reflectie met resultaat en verbeterpunt'] }
  };
  const bewijsEn = {
    gastcontact: { titel: 'Guest contact and service', intro: 'Evidence shows how you communicate with guests and respond to wishes, questions or complaints.', items: ['Feedback from your workplace trainer on guest contact', 'Short reflection on a guest conversation or complaint', 'Observation form for welcoming, farewell or service conversation', 'Guest response, compliment or practical situation you describe'] },
    bediening: { titel: 'Service and operational delivery', intro: 'Evidence shows that you prepare, carry out and complete service tasks carefully.', items: ['Photo or description of a table setting, order or service action', 'Feedback on taking, preparing or serving orders', 'Observation during a shift or event', 'Short reflection on cooperation with service, kitchen or colleagues'] },
    keuken: { titel: 'Kitchen preparation and product quality', intro: 'Evidence shows how you prepare products, dishes or parts of dishes safely and professionally.', items: ['Photo of mise en place, dish or final product', 'Recipe, work plan or production list', 'Feedback from workplace trainer or chef on technique and quality', 'Reflection on hygiene, planning, taste, presentation or pace'] },
    voorraad: { titel: 'Stock, purchasing and registration', intro: 'Evidence shows that you check, process and record stock carefully.', items: ['Order list, stock list or delivery check', 'Temperature record, FIFO check or HACCP form', 'Photo of correct storage or labelling', 'Short explanation of deviations, waste or returns'] },
    leidinggeven: { titel: 'Planning, coaching and leadership', intro: 'Evidence shows how you divide work, guide colleagues and coordinate on the shop floor.', items: ['Work schedule, task division or briefing', 'Feedback from employee, colleague or workplace trainer', 'Report of a guidance conversation or team meeting', 'Reflection on your leadership and cooperation'] },
    bedrijfsvoering: { titel: 'Operations and improvement', intro: 'Evidence shows that you can substantiate processes, quality, costs or improvements.', items: ['Operational plan, improvement point or improvement proposal', 'Cost calculation, budget or analysis of figures', 'Quality check, evaluation or process observation', 'Reflection on efficiency, sustainability, quality or result'] },
    ondernemen: { titel: 'Entrepreneurship and positioning', intro: 'Evidence shows how you think about policy, market, staff, finance or positioning.', items: ['Part of a business plan, HR plan or financial plan', 'Marketing item, target group analysis or positioning proposal', 'Report of business contact or networking conversation', 'Evaluation of opportunities, risks or improvements for the business'] },
    veiligheid: { titel: 'Safety, hygiene and procedures', intro: 'Evidence shows that you work safely and apply procedures correctly.', items: ['HACCP, cleaning or safety checklist', 'Observation of safe and hygienic working practice', 'Short description of an incident, emergency or preventive action', 'Feedback on following house rules, health and safety rules or social hygiene policy'] },
    reflectie: { titel: 'Evaluation and improvement', intro: 'Evidence shows that you use feedback and consciously work on improvement.', items: ['Short reflection: what went well and what can improve', 'Feedback form from workplace trainer or colleague', 'Before-and-after example of an improvement', 'Learning goal with concrete follow-up action'] },
    algemeen: { titel: 'General work placement evidence', intro: 'Evidence shows what you did, how you approached it and what the result was.', items: ['Feedback from workplace trainer', 'Observation during a shift', 'Photo, document or product from practice', 'Short reflection with result and improvement point'] }
  };
  const bron = actieveTaal === 'en' ? bewijsEn : bewijsNl;
  return bron[categorie] || bron.algemeen;
}
function renderBewijsVoorbeelden(wp, kerntaak) {
  const bewijs = krijgBewijsVoorbeelden(wp, kerntaak);
  const label = actieveTaal === 'en' ? 'Examples of work placement evidence' : 'Voorbeelden van BPV-bewijs';
  return `
    <div class="evidence-panel">
      <strong class="evidence-title">${label}: ${bewijs.titel}</strong>
      <p>${bewijs.intro}</p>
      <ul class="evidence-list">
        ${bewijs.items.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </div>
  `;
}
function maakKorteWerkprocesToelichting(wp) {
  if (actieveTaal === 'en') {
    return 'The student carries out this work process in an appropriate practical situation. It should be clear what the student does, how carefully and guest-oriented they work, and what result this produces.';
  }
  return 'De student voert dit werkproces uit in een passende praktijksituatie. Daarbij is zichtbaar wat de student doet, hoe zorgvuldig en gastgericht dit gebeurt en welk resultaat dit oplevert.';
}
function maakStudentTaal(wp, kerntaak) {
  const titel = veld(wp, 'titel') || (actieveTaal === 'en' ? 'this work process' : 'dit werkproces');
  const kerntaakTitel = kerntaak ? veld(kerntaak, 'titel') : (actieveTaal === 'en' ? 'this core task' : 'deze kerntaak');
  const resultaat = veld(wp, 'resultaat') || (actieveTaal === 'en' ? 'The work process is carried out carefully and the result can be explained.' : 'Het werkproces is zorgvuldig uitgevoerd en het resultaat kan worden toegelicht.');

  if (actieveTaal === 'en') {
    return `In the work process "${titel}", you show during work placement that you can carry out a task that belongs to "${kerntaakTitel}". You work carefully, safely and with a guest-focused attitude. You follow the agreements of the training company and coordinate in time with colleagues or your workplace trainer. Afterwards, you can explain what you did, why you chose that approach and what the result was. Suitable evidence may include feedback, an observation, a photo, a schedule, a product from practice or a short reflection. Expected result: ${resultaat}`;
  }

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
    linkElement.innerText = t('readMore');
  } else {
    card.classList.add('expanded');
    linkElement.innerText = t('readLess');
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

  const { profiel } = getActiefDomeinEnProfiel();
  if (!profiel) return;

  const checklistUrl = new URL(`bpv-checklists/${profiel.id}.pdf`, window.location.href);
  openDocumentViewer(null, checklistUrl.href, `${t('bpvChecklist')} - ${veld(profiel, 'naam')}`);
}

function renderDossierContent() {
  const domein = kwalificatieDossierDatabase.domeinen.find(d => d.id === actiefDomeinId);
  const profiel = domein.profielen.find(p => p.id === actiefProfielId);
  const targetZone = document.getElementById('cards-render-target');
  if (!targetZone || !domein || !profiel) return;

  document.getElementById('app-subtitle').innerText = t('domainSubtitle', { domain: veld(domein, 'titel'), crebo: domein.crebo });
  updateRolInstructieTekst(actieveRol);

  let htmlOutput = '';
  const kerntaakSleutels = kwalificatieDossierDatabase.profielKerntaken[profiel.id] || [];

  // SLUITENDE IMPLEMENTATIE: Pakt nu direct de vaste opgemaakte string uit data.js
  if (actiefDomeinId !== 'generiek') {
    htmlOutput += `
      <div class="summary-card">
        <h4>${t('profileSummary')}</h4>
        <div class="summary-text-block">
          ${veld(profiel, 'samenvatting')}
        </div>
        <span class="read-more-link" onclick="handleReadMoreToggle(this)">${t('readMore')}</span>
      </div>
    `;
  } else {
    htmlOutput += `
      <div class="summary-card">
        <h4>${t('legalExplanation')}</h4>
        <div class="verantwoording-accent" style="color: #4a5568; line-height: 1.5;">
          ${veld(profiel, 'typering')}
        </div>
      </div>
    `;
  }

  if (actiefDomeinId !== 'generiek' && profiel.pdfLink && profiel.pdfLink !== "") {
    htmlOutput += `
      <div class="download-wrapper">
        <a href="${profiel.pdfLink}" class="download-pdf-btn" data-viewer-title="${actieveTaal === 'en' ? 'Qualification dossier' : 'Kwalificatiedossier'} - ${veld(profiel, 'naam')}" onclick="openDocumentViewer(event, this.href, this.dataset.viewerTitle)">
          ${t('dossierPdf')}
        </a>
        <button type="button" class="print-bpv-btn" onclick="printBPVChecklist()">
          ${t('bpvChecklist')}
        </button>
      </div>
    `;
  }


  if (kerntaakSleutels.length === 0) {
    htmlOutput += `<p style="padding:20px; background: var(--white); border:1px solid var(--albeda-gray);">${t('dataPending')}</p>`;
  } else {
    kerntaakSleutels.forEach(sleutel => {
      const kerntaak = kwalificatieDossierDatabase.kerntakenDatabase[sleutel];
      if (!kerntaak) return;

      htmlOutput += `
        <div class="card">
          <div class="card-header">
            <h3>${kerntaak.code}: ${veld(kerntaak, 'titel')}</h3>
            <span class="badge">${veld(kerntaak, 'type')}</span>
          </div>
          <div class="card-body">
            <div class="view-section docent-view">
              <div class="meta-vlak-docent">
                <p style="margin-bottom: 10px;"><strong>${t('complexity')}</strong> ${veld(kerntaak, 'complexiteit')}</p>
                <p style="margin-bottom: 10px;"><strong>${t('responsibility')}</strong> ${veld(kerntaak, 'verantwoordelijkheid')}</p>
                <strong>${t('knowledge')}</strong>
                <ul style="margin-left: 15px; margin-top: 5px;">
                  ${kerntaak.vakkennis ? kerntaak.vakkennis.map(kennis => `<li>${kennis}</li>`).join('') : `<li>${t('infoPending')}</li>`}
                </ul>
              </div>
            </div>
            ${kerntaak.werkprocessen.map(wp => `
              <div class="wp-block">
                <div class="wp-title">${wp.code} - ${veld(wp, 'titel')}</div>
                ${`<p class="wp-summary">${maakKorteWerkprocesToelichting(wp)}</p>`}
                <div class="view-section student-view">
                  <div class="student-language-card">
                    <strong>${t('concreteExplained')}</strong>
                    <p>${maakStudentTaal(wp, kerntaak)}</p>
                    ${renderBewijsVoorbeelden(wp, kerntaak)}
                  </div>
                </div>
                <div class="view-section docent-view pleider-view">
                  <p style="margin-bottom: 12px; font-size: 0.95rem; color: #4a5568; font-style: italic;">${veld(wp, 'omschrijving') || veld(wp, 'samenvatting') || t('infoPending')}</p>
                </div>
                <div class="view-section pleider-view docent-view" style="margin-bottom: 15px; background: #f0f9ff; padding: 12px; border-radius: 4px; border: 1px solid #bae6fd;">
                  <strong style="color: #0369a1; font-size: 0.85rem; text-transform: uppercase; display: block; margin-bottom: 2px;">${t('resultOnFloor')}</strong>
                  <span style="color: var(--albeda-dark); font-weight: bold; font-size: 0.95rem;">${veld(wp, 'resultaat') || t('defaultResult')}</span>
                </div>
                <div class="view-section student-view docent-view">
                  <strong style="font-size: 0.9rem; color: var(--albeda-blue); display: block; margin-bottom: 4px;">${t('expectedBehaviour')}</strong>
                  <ul class="check-list">
                    ${(actieveTaal === 'en' && wp.gedrag_en ? wp.gedrag_en : (wp.gedrag || [])).map(gedragItem => `<li>${gedragItem}</li>`).join('') || `<li>${t('defaultBehaviour')}</li>`}
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


if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    applyLanguageToStaticText();
    const footerYear = document.getElementById('footer-year');
    if (footerYear) footerYear.innerText = new Date().getFullYear();
  });
}
