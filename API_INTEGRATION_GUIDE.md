# MigoX • Real API & Backend Integration Architecture

This document provides step-by-step guidance on connecting the **MigoX** frontend to real-world continuous glucose monitors (CGM), FHIR/HL7 health APIs, and backend telemetry databases.

---

## 1. Architecture Overview

```
 [Dexcom / Abbott Libre / Medtronic CGM]
                   │
                   ▼ (Bluetooth Low Energy or Vendor Cloud API)
       [MigoX Telemetry Gateway / WebSocket]
                   │
                   ▼ (JSON / Encrypted SSE)
        [Zustand Health Store (Client)]
                   │
     ┌─────────────┴─────────────┐
     ▼                           ▼
[Predictive Engine]     [Dynamic Glassmorphic UI]
(Sonification + ML)     (60-120fps SVG + Framer Motion)
```

---

## 2. Replacing Mock Data with Real Endpoints

Currently, readings and summaries are managed in `src/store/useHealthStore.ts`. To connect a real REST or GraphQL API:

### A. Define an API Client (`src/services/api.ts`)
```typescript
import axios from 'axios';
import { GlucoseReading, DailySummary } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.migox.health/v1';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('migox_token')}`,
  },
});

export const healthApi = {
  getLatestTelemetry: async (): Promise<GlucoseReading[]> => {
    const { data } = await apiClient.get<GlucoseReading[]>('/telemetry/recent');
    return data;
  },

  logBiomarker: async (payload: Partial<GlucoseReading>): Promise<GlucoseReading> => {
    const { data } = await apiClient.post<GlucoseReading>('/telemetry/log', payload);
    return data;
  },

  getDailySummary: async (dateStr: string): Promise<DailySummary> => {
    const { data } = await apiClient.get<DailySummary>(`/telemetry/summary/${dateStr}`);
    return data;
  },
};
```

---

## 3. Real-Time Streaming via WebSockets / Server-Sent Events (SSE)

For continuous 5-minute CGM readings from devices like Dexcom G7 or Abbott FreeStyle Libre 3:

```typescript
// src/services/telemetrySocket.ts
import { useHealthStore } from '../store/useHealthStore';
import { soundFx } from '../utils/sound';

export function initializeTelemetrySocket(userId: string) {
  const ws = new WebSocket(`wss://stream.migox.health/cgm/${userId}`);

  ws.onmessage = (event) => {
    const packet = JSON.parse(event.data);
    if (packet.type === 'NEW_READING') {
      useHealthStore.getState().addReading({
        value: packet.value,
        trend: packet.trend,
        heartRate: packet.heartRate,
        note: packet.note,
      });

      // Play soft real-time sonification
      soundFx.playGlucoseTone(packet.value);
    }
  };

  ws.onerror = (err) => {
    console.warn('Telemetry stream fallback to offline cache', err);
    useHealthStore.getState().toggleOffline();
  };

  return () => ws.close();
}
```

---

## 4. Bluetooth Web API (Direct Sensor Pairing)

For hardware devices supporting Web Bluetooth API (e.g., custom BLE peripherals):

```typescript
export async function pairBluetoothSensor() {
  const device = await navigator.bluetooth.requestDevice({
    filters: [{ services: ['glucose'] }],
  });

  const server = await device.gatt?.connect();
  const service = await server?.getPrimaryService('glucose');
  const characteristic = await service?.getCharacteristic('glucose_measurement');

  await characteristic?.startNotifications();
  characteristic?.addEventListener('characteristicvaluechanged', (e: Event) => {
    const value = (e.target as any).value;
    const mgDl = value.getUint16(1, /*littleEndian=*/true);
    useHealthStore.getState().addReading({ value: mgDl });
  });
}
```

---

## 5. Security & HIPAA/GDPR Compliance

1. **End-to-End Encryption**: Encrypt PHI (Protected Health Information) in transit via TLS 1.3 and at rest with AES-256-GCM.
2. **Local Anonymization**: Avatar seeds and identifiers are isolated from biometric payloads.
3. **Offline Vault**: Stored offline records in IndexedDB are protected using Web Crypto API (`window.crypto.subtle`).
