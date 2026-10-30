const demoData = {
  meta: {
    synthetic: true,
    environment: 'portfolio-local',
    generatedLabel: 'Cenário demonstrativo · 14:32',
  },
  screens: [
    { id: 'demo-centro-vitrine', name: 'Centro · Vitrine', group: 'Loja Centro', status: 'online', playback: 'playing', media: 'Campanha Horizonte', updatedMinutes: 0, storage: 72 },
    { id: 'demo-centro-caixa', name: 'Centro · Caixa', group: 'Loja Centro', status: 'online', playback: 'playing', media: 'Novidades da semana', updatedMinutes: 1, storage: 64 },
    { id: 'demo-norte-vitrine', name: 'Norte · Vitrine', group: 'Loja Norte', status: 'online', playback: 'playing', media: 'Campanha Horizonte', updatedMinutes: 0, storage: 81 },
    { id: 'demo-norte-espera', name: 'Norte · Espera', group: 'Loja Norte', status: 'online', playback: 'syncing', media: 'Sincronizando 3 itens', updatedMinutes: 2, storage: 58 },
    { id: 'demo-sul-menu', name: 'Sul · Menu', group: 'Loja Sul', status: 'online', playback: 'playing', media: 'Menu sazonal', updatedMinutes: 1, storage: 69 },
    { id: 'demo-sul-entrada', name: 'Sul · Entrada', group: 'Loja Sul', status: 'attention', playback: 'idle', media: 'Sem resposta há 18 min', updatedMinutes: 18, storage: 41 },
  ],
  schedules: [
    { id: 'demo-schedule-1', name: 'Campanha Horizonte', window: 'Hoje · 08:00–18:00', screens: 3, state: 'active' },
    { id: 'demo-schedule-2', name: 'Menu sazonal', window: 'Seg–Sex · 11:00–15:00', screens: 1, state: 'active' },
    { id: 'demo-schedule-3', name: 'Novidades da semana', window: 'Amanhã · 09:00', screens: 2, state: 'scheduled' },
  ],
  activity: [62, 70, 68, 74, 82, 79, 88, 91, 87, 93, 90, 96],
  alerts: [
    { level: 'attention', title: 'Tela sem resposta', detail: 'Sul · Entrada · há 18 minutos' },
    { level: 'info', title: 'Sincronização em andamento', detail: 'Norte · Espera · 3 itens restantes' },
  ],
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { demoData };
}
if (typeof window !== 'undefined') {
  window.demoData = demoData;
}
