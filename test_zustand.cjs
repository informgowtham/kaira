const { createStore } = require('zustand/vanilla');

const store = createStore((set) => ({
  loading: false,
  error: null,
  doThing: async () => {
    set({ loading: true });
    try {
      throw new Error('Boom');
    } catch (e) {
      set({ error: e.message });
      throw e;
    } finally {
      set({ loading: false });
    }
  }
}));

store.subscribe((state) => console.log('State:', state));
console.log('Initial:', store.getState());
store.getState().doThing().catch((e) => console.log('Caught outside:', e.message));
