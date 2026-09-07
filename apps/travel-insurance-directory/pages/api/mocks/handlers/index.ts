import { entraHandlers } from './entra';
import { fcaHandlers } from './fca';
import { notifyHandlers } from './notify';

export const handlers = [...entraHandlers, ...fcaHandlers, ...notifyHandlers];
