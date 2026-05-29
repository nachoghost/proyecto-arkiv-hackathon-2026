import {
  createPublicClient,
  createWalletClient,
  http,
  type Hex,
} from "@arkiv-network/sdk";
import type { Entity } from "@arkiv-network/sdk/types";
import { privateKeyToAccount } from "@arkiv-network/sdk/accounts";
import { braga } from "@arkiv-network/sdk/chains";
import { eq, and } from "@arkiv-network/sdk/query";
import { jsonToPayload } from "@arkiv-network/sdk/utils";

import {
  DEFAULT_EXPIRES_IN_SECONDS,
  ENTITY_TYPE_CLINICAL,
  EVENT_STATUS_ACTIVE,
} from "./constants";
import { normalizePrivateKey } from "./private-key";
import type { ClinicalEventPayload, ClinicalEventRecord } from "./types";

export function getPublicClient() {
  return createPublicClient({
    chain: braga,
    transport: http(),
  });
}

export function getWalletClient() {
  const key = normalizePrivateKey(process.env.PRIVATE_KEY);
  if (!key) {
    throw new Error(
      "PRIVATE_KEY no configurada o inválida (64 hex, con o sin 0x). Copiá .env.example a .env y pedí GLM en el faucet de Braga.",
    );
  }
  const account = privateKeyToAccount(key);
  return createWalletClient({
    chain: braga,
    transport: http(),
    account,
  });
}

function attrMap(entity: Entity) {
  return Object.fromEntries(
    entity.attributes.map((a) => [a.key, String(a.value)]),
  ) as Record<string, string>;
}

export function entityToClinicalRecord(
  entity: Entity,
): ClinicalEventRecord | null {
  const attrs = attrMap(entity);
  if (attrs.entityType !== ENTITY_TYPE_CLINICAL) return null;

  let payload: ClinicalEventPayload;
  try {
    const text =
      entity.payload !== undefined
        ? new TextDecoder().decode(entity.payload)
        : "{}";
    payload = JSON.parse(text) as ClinicalEventPayload;
  } catch {
    return null;
  }

  return {
    ...payload,
    entityKey: entity.key,
    creator: entity.creator,
  };
}

export async function queryClinicalEvents(
  patientId: string,
): Promise<ClinicalEventRecord[]> {
  const client = getPublicClient();
  const result = await client
    .buildQuery()
    .where(
      and([
        eq("entityType", ENTITY_TYPE_CLINICAL),
        eq("patientId", patientId),
        eq("status", EVENT_STATUS_ACTIVE),
      ]),
    )
    .withPayload(true)
    .withMetadata(true)
    .withAttributes(true)
    .limit(100)
    .fetch();

  const records = result.entities
    .map((e) => entityToClinicalRecord(e))
    .filter((r): r is ClinicalEventRecord => r !== null);

  records.sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return records;
}

export async function createClinicalEvent(
  payload: ClinicalEventPayload,
): Promise<{ entityKey: Hex; txHash: string }> {
  const wallet = getWalletClient();
  const { entityKey, txHash } = await wallet.createEntity({
    payload: jsonToPayload(payload),
    contentType: "application/json",
    attributes: [
      { key: "entityType", value: ENTITY_TYPE_CLINICAL },
      { key: "patientId", value: payload.patientId },
      { key: "hospitalId", value: payload.hospitalId },
      { key: "eventType", value: payload.eventType },
      { key: "status", value: EVENT_STATUS_ACTIVE },
    ],
    expiresIn: DEFAULT_EXPIRES_IN_SECONDS,
  });

  return { entityKey, txHash };
}
