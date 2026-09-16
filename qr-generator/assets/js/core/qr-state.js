import { DEFAULT_DESIGN, PROJECT_SCHEMA_VERSION } from '../constants.js';
import { randomId } from '../utils/random-id.js';

/**
 * Central mutable QR project state with lightweight pub/sub.
 */
export function createQrState(initial = {}) {
  const state = {
    id: initial.id || randomId('project'),
    name: initial.name || 'Untitled design',
    type: initial.type || 'url',
    payload: '',
    fields: { ...(initial.fields || {}) },
    design: { ...DEFAULT_DESIGN, ...(initial.design || {}) },
    meta: {
      createdAt: initial.meta?.createdAt || new Date().toISOString(),
      updatedAt: initial.meta?.updatedAt || new Date().toISOString(),
      schemaVersion: PROJECT_SCHEMA_VERSION,
    },
    status: {
      valid: false,
      error: null,
      warning: null,
      tip: null,
      empty: true,
    },
  };

  const listeners = new Set();

  function notify(reason = 'update') {
    state.meta.updatedAt = new Date().toISOString();
    for (const fn of listeners) fn(getSnapshot(), reason);
  }

  function getSnapshot() {
    return {
      id: state.id,
      name: state.name,
      type: state.type,
      payload: state.payload,
      fields: { ...state.fields },
      design: { ...state.design },
      meta: { ...state.meta },
      status: { ...state.status },
    };
  }

  return {
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    get() {
      return getSnapshot();
    },
    setType(type) {
      state.type = type;
      notify('type');
    },
    setName(name) {
      state.name = String(name || 'Untitled design').slice(0, 80);
      notify('name');
    },
    setFields(fields) {
      state.fields = { ...fields };
      notify('fields');
    },
    patchFields(partial) {
      state.fields = { ...state.fields, ...partial };
      notify('fields');
    },
    setPayload(payload, status = {}) {
      state.payload = payload || '';
      state.status = {
        valid: Boolean(status.valid),
        error: status.error || null,
        warning: status.warning || null,
        tip: status.tip || null,
        empty: status.empty ?? !payload,
      };
      notify('payload');
    },
    setDesign(partial) {
      state.design = { ...state.design, ...partial };
      notify('design');
    },
    replace(project) {
      Object.assign(state, {
        id: project.id || state.id,
        name: project.name || state.name,
        type: project.type || state.type,
        payload: project.payload || '',
        fields: { ...(project.fields || {}) },
        design: { ...DEFAULT_DESIGN, ...(project.design || {}) },
        meta: {
          createdAt: project.meta?.createdAt || state.meta.createdAt,
          updatedAt: new Date().toISOString(),
          schemaVersion: PROJECT_SCHEMA_VERSION,
        },
        status: project.status || state.status,
      });
      notify('replace');
    },
    toProject() {
      const snap = getSnapshot();
      return {
        schemaVersion: PROJECT_SCHEMA_VERSION,
        id: snap.id,
        name: snap.name,
        type: snap.type,
        fields: snap.fields,
        design: {
          ...snap.design,
          // Keep logo data URL for local restore; export module may strip optionally
        },
        meta: snap.meta,
      };
    },
  };
}
