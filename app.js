// Functie om de weergave aan te passen op basis van de gekozen doelgroep
function switchRole(role, buttonElement) {
  // 1. Update actieve knop styling
  const buttons = document.querySelectorAll('.role-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  buttonElement.classList.add('active');

  // 2. Wissel de class op de main container voor CSS-filtering
  const container = document.getElementById('app-container');
  container.className = role + '-view';

  // 3. Update de introductietekst passend bij de belevingswereld van de doelgroep
  const introText = document.getElementById('intro-text');
  if (role === 'student') {
    introText.innerHTML = `<strong>Invalshoek: Jouw Gedrag & Journey</strong><br>Hieronder zie je precies wat je moet doen en laten zien in het bedrijf om succesvol te worden. Focus op het gedrag!`;
  } else if (role === 'pleider') {
    introText.innerHTML = `<strong>Invalshoek: Resultaat op de Werkvloer</strong><br>Beste praktijkopleider, dit overzicht toont u direct de Kerntaken, Werkprocessen en het op te leveren <em>Resultaat</em> per onderdeel om de student effectief te begeleiden.`;
  } else if (role === 'docent') {
    introText.innerHTML = `<strong>Invalshoek: Onderwijskundige Structuur & Vakkennis</strong><br>Collega-docent, dit is de volledige analytische weergave inclusief complexiteit, verantwoordelijkheid en de formele vakkennis- en vaardighedenmatrix.`;
  }
}

// Functie die de data uit data.js rendert in de HTML
function renderDossier() {
  const grid = document.getElementById('content-grid');
  let html = '';

  kwalificatieDossier.kerntaken.forEach(taak => {
    html += `
      <div class="card">
        <div class="card-header">
          <h2>${taak.id}: ${taak.titel}</h2>
          <span class="badge">${taak.type}</span>
        </div>
        <div class="card-body">
          
          <!-- Docenten Content: Structuur & Complexiteit -->
          <div class="meta-section">
            <div class="meta-vlak">
              <strong>Complexiteit:</strong> ${taak.complexiteit}<br><br>
              <strong>Verantwoordelijkheid:</strong> ${taak.verantwoordelijkheid}
            </div>
          </div>

          <!-- Lus door de werkprocessen -->
          ${taak.werkprocessen.map(wp => `
            <div class="wp-block">
              <div class="wp-title"><span>${wp.id}</span> ${wp.titel}</div>
              
              <!-- Docent & Praktijkopleider zien omschrijving -->
              <div class="desc-section">
                <p style="margin-bottom: 10px; font-size:0.95rem; color:#555;">${wp.omschrijving}</p>
              </div>

              <!-- Praktijkopleider ziet direct het resultaat -->
              <div class="result-section" style="margin-bottom: 10px;">
                <strong>Verwacht Resultaat:</strong> <span style="color: var(--albeda-blue); font-weight:500;">${wp.resultaat}</span>
              </div>

              <!-- Student ziet direct het gedrag -->
              <div class="behavior-section">
                <strong style="font-size:0.9rem; color: var(--albeda-orange);">Hoe laat je dit zien? (Gedrag):</strong>
                <ul class="check-list" style="margin-top:5px;">
                  ${wp.gedrag.map(g => `<li>${g}</li>`).join('')}
                </ul>
              </div>

              <!-- Competentie tags voor student en docent -->
              <div class="tag-container">
                ${wp.competenties.map(comp => `<span class="tag">${comp}</span>`).join('')}
              </div>
            </div>
          `).join('')}

        </div>
      </div>
    `;
  });

  grid.innerHTML = html;
}

// Start het renderen zodra de pagina geladen is
window.onload = renderDossier;