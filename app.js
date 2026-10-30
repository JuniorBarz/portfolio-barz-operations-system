function normalize(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .toLowerCase();
}

function calculateMetrics(screens) {
  const total = screens.length;
  const attention = screens.filter((screen) => screen.status === 'attention').length;
  const online = total - attention;
  const playing = screens.filter((screen) => screen.playback === 'playing').length;
  return {
    total,
    online,
    attention,
    playing,
    onlineRate: total === 0 ? 0 : Math.round((online / total) * 100),
  };
}

function filterScreens(screens, status, query) {
  const normalizedQuery = normalize(query);
  return screens.filter((screen) => {
    const statusMatches =
      status === 'all' ||
      (status === 'online' && screen.status === 'online') ||
      (status === 'attention' && screen.status === 'attention');
    const searchable = normalize(`${screen.name} ${screen.group} ${screen.media}`);
    return statusMatches && searchable.includes(normalizedQuery);
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function initializeDashboard(data, documentRef = document) {
  const state = { status: 'all', query: '', schedules: [...data.schedules] };
  const metrics = calculateMetrics(data.screens);
  const number = new Intl.NumberFormat('pt-BR');

  documentRef.querySelector('[data-metric="screens"]').textContent = number.format(metrics.total);
  documentRef.querySelector('[data-metric="online"]').textContent = `${metrics.onlineRate}%`;
  documentRef.querySelector('[data-metric="playing"]').textContent = number.format(metrics.playing);
  documentRef.querySelector('[data-metric="attention"]').textContent = number.format(metrics.attention);
  documentRef.querySelector('[data-environment]').textContent = data.meta.generatedLabel;

  const tableBody = documentRef.querySelector('[data-screen-rows]');
  const emptyState = documentRef.querySelector('[data-empty-state]');
  const countLabel = documentRef.querySelector('[data-screen-count]');
  const scheduleList = documentRef.querySelector('[data-schedule-list]');
  const liveRegion = documentRef.querySelector('[data-live-region]');

  const renderScreens = () => {
    const screens = filterScreens(data.screens, state.status, state.query);
    tableBody.innerHTML = screens
      .map((screen) => {
        const isAttention = screen.status === 'attention';
        const playbackLabel = screen.playback === 'playing' ? 'Em reprodução' : screen.playback === 'syncing' ? 'Sincronizando' : 'Em espera';
        const updateLabel = screen.updatedMinutes === 0 ? 'agora' : `há ${screen.updatedMinutes} min`;
        return `
          <tr>
            <td><span class="screen-name">${escapeHtml(screen.name)}</span><span class="screen-group">${escapeHtml(screen.group)}</span></td>
            <td><span class="status-chip ${isAttention ? 'status-attention' : 'status-online'}"><span aria-hidden="true"></span>${isAttention ? 'Atenção' : 'Online'}</span></td>
            <td><span class="playback-state">${escapeHtml(playbackLabel)}</span><span class="media-name">${escapeHtml(screen.media)}</span></td>
            <td><div class="storage"><span>${screen.storage}% livre</span><span class="storage-track" aria-hidden="true"><span style="width:${screen.storage}%"></span></span></div></td>
            <td><time>${escapeHtml(updateLabel)}</time></td>
            <td><button class="icon-button" type="button" aria-label="Abrir detalhes de ${escapeHtml(screen.name)}" data-demo-action="details">•••</button></td>
          </tr>`;
      })
      .join('');
    emptyState.hidden = screens.length !== 0;
    countLabel.textContent = `${screens.length} de ${data.screens.length} telas`;
  };

  const renderSchedules = () => {
    scheduleList.innerHTML = state.schedules
      .map((schedule) => `
        <li>
          <span class="schedule-marker ${schedule.state}" aria-hidden="true"></span>
          <span><strong>${escapeHtml(schedule.name)}</strong><small>${escapeHtml(schedule.window)} · ${schedule.screens} ${schedule.screens === 1 ? 'tela' : 'telas'}</small></span>
          <span class="schedule-state">${schedule.state === 'active' ? 'Ativa' : 'Agendada'}</span>
        </li>`)
      .join('');
  };

  const renderChart = () => {
    const bars = documentRef.querySelector('[data-activity-bars]');
    bars.innerHTML = data.activity
      .map((value, index) => `<span style="height:${value}%" aria-label="Intervalo ${index + 1}: ${value}% de atividade"><i>${value}%</i></span>`)
      .join('');
  };

  const announce = (message) => {
    liveRegion.textContent = '';
    window.setTimeout(() => { liveRegion.textContent = message; }, 20);
  };

  documentRef.querySelector('[data-search]').addEventListener('input', (event) => {
    state.query = event.target.value;
    renderScreens();
  });

  documentRef.querySelectorAll('[data-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      documentRef.querySelectorAll('[data-filter]').forEach((item) => item.setAttribute('aria-pressed', 'false'));
      button.setAttribute('aria-pressed', 'true');
      state.status = button.dataset.filter;
      renderScreens();
    });
  });

  documentRef.querySelectorAll('[data-nav-target]').forEach((button) => {
    button.addEventListener('click', () => {
      documentRef.querySelectorAll('[data-nav-target]').forEach((item) => item.removeAttribute('aria-current'));
      button.setAttribute('aria-current', 'page');
      documentRef.querySelector(button.dataset.navTarget)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  documentRef.addEventListener('click', (event) => {
    if (event.target.closest('[data-demo-action="details"]')) {
      announce('Detalhes simulados: nenhuma consulta externa foi realizada.');
    }
  });

  const dialog = documentRef.querySelector('[data-schedule-dialog]');
  documentRef.querySelector('[data-open-schedule]').addEventListener('click', () => dialog.showModal());
  documentRef.querySelector('[data-close-schedule]').addEventListener('click', () => dialog.close());
  documentRef.querySelector('[data-schedule-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    state.schedules.unshift({
      id: `demo-schedule-${state.schedules.length + 1}`,
      name: String(form.get('name') || 'Nova programação'),
      window: String(form.get('window') || 'A definir'),
      screens: 1,
      state: 'scheduled',
    });
    renderSchedules();
    dialog.close();
    event.currentTarget.reset();
    announce('Programação adicionada somente à memória desta demonstração.');
  });

  renderScreens();
  renderSchedules();
  renderChart();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calculateMetrics, filterScreens, initializeDashboard };
}

if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => initializeDashboard(window.demoData, document));
}
