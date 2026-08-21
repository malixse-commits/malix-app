(() => {
  const KEY = 'malix-cleaning-square-v2';
  const laundryTasks = [
    'Dammsug golven i dusch, tvättstuga och torkrum',
    'Torka golven i dusch, tvättstuga och torkrum',
    'Torka rent tvättmaskin och torkmaskin',
    'Plocka undan tomma duschflaskor',
    'Torka bänkar'
  ];

  const isLaundryArea = name => /(dusch|tvätt|torkrum)/i.test(String(name || ''));
  const read = () => {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); }
    catch { return {}; }
  };

  const state = read();
  state.rooms = state.rooms || {};
  state.schedule = state.schedule || {};

  // Om en äldre veckoplan pekar på ett dusch-/tvättutrymme som saknar rum,
  // skapa rummet i stället för att låta Dagens städning bli tom.
  Object.values(state.schedule).forEach(name => {
    if (isLaundryArea(name) && !state.rooms[name]) {
      state.rooms[name] = {
        standard: [...laundryTasks],
        custom: [],
        priority: laundryTasks.slice(0, 3)
      };
    }
  });

  // Dusch, tvättstuga och torkrum ska fungera som alla andra rum:
  // vanlig lista, egna tillägg och prioriterade uppgifter.
  Object.entries(state.rooms).forEach(([name, room]) => {
    if (!isLaundryArea(name)) return;
    room.standard = Array.isArray(room.standard) ? room.standard : [];
    room.custom = Array.isArray(room.custom) ? room.custom : [];
    room.priority = Array.isArray(room.priority) ? room.priority : [];

    if (!room.standard.length) room.standard = [...laundryTasks];
    if (!room.priority.length) room.priority = room.standard.slice(0, 3);
  });

  localStorage.setItem(KEY, JSON.stringify(state));
})();