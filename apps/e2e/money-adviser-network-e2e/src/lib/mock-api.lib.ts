import express = require('express');
import { Request, Response } from 'express';
import { once } from 'node:events';
import { Server as HttpServer } from 'node:http';
import { promisify } from 'node:util';
import {
  IBookingSlot,
  limitedSlotAvailability,
  mixedBookingSlots,
  noSlotAvailability,
  noSlots,
} from '@data/mock-data';
import {
  appointmentResponses,
  TAppointmentResponse,
} from '@data/mock-responses';

export type TBookingSlotOption =
  | 'mixed'
  | 'limited-availability'
  | 'no-availability'
  | 'empty-array';

export type TAppointmentResponseOption =
  | 'success'
  | 'out-of-hours'
  | 'no-slots-available'
  | 'capacity-full';

let server: HttpServer | undefined;

/**
 * Currently set mocks.
 */
let currBookingSlotMock: readonly IBookingSlot[] = mixedBookingSlots;
let currAppResponseMock: TAppointmentResponse = appointmentResponses.success;

/**
 * App config.
 */
const app = express();
app.disable('x-powered-by');
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  console.info(`[mock-api] 📡  /health called`);
  res.json({ ok: true });
});

/**
 * Ensures the same booking slots are always shown.
 */
app.get('/GetBookingSlots', (_req: Request, res: Response) => {
  console.info(`[mock-api] 📡  /GetBookingSlots called`);
  res.json(currBookingSlotMock);
});

/**
 * Always make sure business closure status is false.
 */
app.get('/GetBusinessClosureStatus', (_req: Request, res: Response) => {
  console.info(`[mock-api] 📡  /GetBusinessClosureStatus called`);
  const formattedDate = new Date().toLocaleDateString('en-GB');
  res.json({ success: true, date: formattedDate, closed: false });
});

/**
 * Ensures that all referrers are validated.
 */
app.post('/ValidateReferrer', (_req: Request, res: Response) => {
  console.info(`[mock-api] 📡  /ValidateReferrer called`);
  res.json({
    success: true,
    message: 'mock-referrer',
    correlationId: 'mock-correlation-id',
  });
});

/**
 * Ensures booking appointments is always successful.
 */
app.post('/BookAppointment', (_req: Request, res: Response) => {
  console.info(`[mock-api] 📡  /BookAppointment called`);
  res.status(currAppResponseMock.code).send(currAppResponseMock.message);
});

/**
 * To be used in a test to toggle mock functionality for booking slots.
 */
app.patch('/mock/config/toggle-slots', (_req: Request, res: Response) => {
  console.info(`[mock-api] 📡  ../toggle-slots called`);
  const slotOption: TBookingSlotOption = _req.body.value;

  switch (slotOption) {
    case 'mixed':
      currBookingSlotMock = mixedBookingSlots;
      console.info(`[mock-api] 📡  /GetBookingSlots now mixedBookingSlots`);
      break;
    case 'no-availability':
      currBookingSlotMock = noSlotAvailability;
      console.info(`[mock-api] 📡  /GetBookingSlots now noSlotAvailability`);
      break;
    case 'empty-array':
      currBookingSlotMock = noSlots;
      console.info(`[mock-api] 📡  /GetBookingSlots now noSlots`);
      break;
    case 'limited-availability':
      currBookingSlotMock = limitedSlotAvailability;
      console.info(
        `[mock-api] 📡  /GetBookingSlots now limitedSlotAvailability`,
      );
      break;
    default:
      throw new Error(
        `[mock-api] ❌  ../toggle-slots Invalid booking slot option: ${slotOption}`,
      );
  }
  res.sendStatus(200);
});

/**
 * To be used in a test to toggle mock functionality for submitting appointments.
 */
app.patch('/mock/config/toggle-appointment', (_req: Request, res: Response) => {
  console.info(`[mock-api] 📡  ../toggle-appointment called`);
  const appointmentOption: TAppointmentResponseOption = _req.body.value;

  switch (appointmentOption) {
    case 'success':
      currAppResponseMock = appointmentResponses.success;
      console.info(`[mock-api] 📡  /BookAppointment now success`);
      break;
    case 'out-of-hours':
      currAppResponseMock = appointmentResponses.outOfHours;
      console.info(`[mock-api] 📡  /BookAppointment now outOfHours`);
      break;
    case 'no-slots-available':
      currAppResponseMock = appointmentResponses.noSlotsAvailable;
      console.info(`[mock-api] 📡  /BookAppointment now noSlotsAvailable`);
      break;
    case 'capacity-full':
      currAppResponseMock = appointmentResponses.capacityFull;
      console.info(`[mock-api] 📡  /BookAppointment now capacityFull`);
      break;
    default:
      throw new Error(
        `[mock-api] ❌  ../toggle-appointment Invalid appointment option: ${appointmentOption}`,
      );
  }
  res.sendStatus(200);
});

app.patch('/mock/config/reset', (_req: Request, res: Response) => {
  console.info(`[mock-api] 📡  ../reset called`);
  currBookingSlotMock = mixedBookingSlots;
  currAppResponseMock = appointmentResponses.success;
  res.sendStatus(200);
});

/**
 * Create a mock server, choosing a port itself.
 *
 * @returns The mock HTTP server created.
 */
export async function startMockApi(port: number): Promise<HttpServer> {
  if (server) {
    return server;
  }

  server = app.listen(port, '127.0.0.1');
  await once(server, 'listening');

  try {
    console.info(`[mock-api] 💡  Listening on port ${port}`);
    return server;
  } catch (error) {
    console.error(
      `[mock-api] ❌  Failed to start on port ${port}:`,
      (error as Error).message,
    );
    throw error;
  }
}

export async function stopMockApi(): Promise<void> {
  if (!server) {
    return;
  }

  await promisify(server.close.bind(server))();
  server = undefined;
}
