import { z } from 'zod';
import { ProtocolValidationError } from './errors.js';

export const AGENT_PROTOCOL_VERSION = 1;

export const ContentItemSchema = z.object({
  type: z.string(),
  text: z.string().optional(),
  data: z.string().optional(),
  mimeType: z.string().optional(),
});
export type ContentItem = z.infer<typeof ContentItemSchema>;

export const CallErrorSchema = z.object({
  code: z.enum(['TOOL_ERROR', 'TIMEOUT', 'INVALID_ARGUMENTS', 'NOT_FOUND', 'POLICY_DENIED']),
  message: z.string(),
  data: z.unknown().optional(),
});
export type CallError = z.infer<typeof CallErrorSchema>;

export const JSONSchemaObjectSchema = z
  .object({
    type: z.literal('object'),
    properties: z.record(z.unknown()).optional(),
    required: z.array(z.string()).optional(),
  })
  .passthrough();
export type JSONSchemaObject = z.infer<typeof JSONSchemaObjectSchema>;

export const AgentToolSchema = z.object({
  name: z.string(),
  description: z.string(),
  inputSchema: JSONSchemaObjectSchema,
});
export type AgentTool = z.infer<typeof AgentToolSchema>;

export const AgentCapabilitiesSchema = z.object({
  tools: z.array(AgentToolSchema),
  resources: z.array(z.unknown()).optional().default([]),
  prompts: z.array(z.unknown()).optional().default([]),
});
export type AgentCapabilities = z.infer<typeof AgentCapabilitiesSchema>;

export const AgentMetaSchema = z
  .object({
    os: z.string().optional(),
    arch: z.string().optional(),
    agentVersion: z.string().optional(),
    repoRoot: z.string().optional(),
    repoRoots: z.array(z.string()).optional(),
    features: z.record(z.boolean()).optional(),
  })
  .passthrough();
export type AgentMeta = z.infer<typeof AgentMetaSchema>;

export const AgentMessageSchema = z.object({
  type: z.string(),
  protocolVersion: z.number().optional(),
});

export const AgentRegisterMessageSchema = z.object({
  type: z.literal('register'),
  protocolVersion: z.number(),
  agentId: z.string(),
  agentName: z.string(),
  meta: AgentMetaSchema.optional(),
  capabilities: AgentCapabilitiesSchema,
});
export type AgentRegisterMessage = z.infer<typeof AgentRegisterMessageSchema>;
export type RegisterMessage = AgentRegisterMessage;

export const AgentPingMessageSchema = z.object({
  type: z.literal('ping'),
  ts: z.number(),
});
export type AgentPingMessage = z.infer<typeof AgentPingMessageSchema>;
export type PingMessage = AgentPingMessage;

export const AgentPongMessageSchema = z.object({
  type: z.literal('pong'),
  ts: z.number(),
});
export type AgentPongMessage = z.infer<typeof AgentPongMessageSchema>;
export type PongMessage = AgentPongMessage;

export const RegisteredMessageSchema = z.object({
  type: z.literal('registered'),
  protocolVersion: z.number(),
  gatewayVersion: z.string(),
});
export type RegisteredMessage = z.infer<typeof RegisteredMessageSchema>;

export const AgentCapabilitiesUpdateMessageSchema = z
  .object({
    type: z.literal('capabilities_update'),
    protocolVersion: z.number(),
    capabilities: AgentCapabilitiesSchema.optional(),
    tools: z.array(AgentToolSchema).optional(),
  })
  .transform((msg) => ({
    ...msg,
    capabilities: msg.capabilities ?? {
      tools: msg.tools ?? [],
      resources: [],
      prompts: [],
    },
  }));
export type AgentCapabilitiesUpdateMessage = z.infer<
  typeof AgentCapabilitiesUpdateMessageSchema
>;
export type CapabilitiesUpdateMessage = AgentCapabilitiesUpdateMessage;

export const AgentCallRequestSchema = z.object({
  type: z.literal('call'),
  requestId: z.string(),
  domain: z.literal('tools'),
  name: z.string(),
  arguments: z.record(z.unknown()).optional(),
  timeoutMs: z.number().int().positive().optional(),
});
export type AgentCallRequest = z.infer<typeof AgentCallRequestSchema>;
export type CallMessage = AgentCallRequest;

export const StreamChunkMessageSchema = z.object({
  type: z.literal('stream_chunk'),
  callId: z.string(),
  index: z.number().int().min(0),
  content: z.string(),
  isFinal: z.boolean(),
});
export type StreamChunkMessage = z.infer<typeof StreamChunkMessageSchema>;

export const CallResultSuccessSchema = z.object({
  type: z.literal('call_result'),
  requestId: z.string(),
  ok: z.literal(true),
  result: z.object({
    content: z.array(ContentItemSchema),
  }),
});
export type CallResultSuccess = z.infer<typeof CallResultSuccessSchema>;

export const CallResultErrorSchema = z.object({
  type: z.literal('call_result'),
  requestId: z.string(),
  ok: z.literal(false),
  error: CallErrorSchema,
});
export type CallResultError = z.infer<typeof CallResultErrorSchema>;

export const AgentCallResultSchema = z.union([CallResultSuccessSchema, CallResultErrorSchema]);
export type AgentCallResult = z.infer<typeof AgentCallResultSchema>;
export type CallResult = AgentCallResult;

export type AgentMessage =
  | AgentRegisterMessage
  | AgentPingMessage
  | AgentPongMessage
  | AgentCapabilitiesUpdateMessage
  | AgentCallResult;

export const OutgoingMessageSchema = z.union([
  StreamChunkMessageSchema,
  AgentRegisterMessageSchema,
  AgentPongMessageSchema,
  AgentCapabilitiesUpdateMessageSchema,
  AgentCallResultSchema,
]);
export type OutgoingMessage = z.infer<typeof OutgoingMessageSchema>;

export const IncomingMessageSchema = z.discriminatedUnion('type', [
  AgentPingMessageSchema,
  AgentCallRequestSchema,
  RegisteredMessageSchema,
]);
export type IncomingMessage = z.infer<typeof IncomingMessageSchema>;

export function validateAgentMessage(data: unknown): AgentMessage {
  const base = AgentMessageSchema.parse(data);

  switch (base.type) {
    case 'register':
      return AgentRegisterMessageSchema.parse(data);
    case 'ping':
      return AgentPingMessageSchema.parse(data);
    case 'pong':
      return AgentPongMessageSchema.parse(data);
    case 'capabilities_update':
      return AgentCapabilitiesUpdateMessageSchema.parse(data);
    case 'call_result':
      return AgentCallResultSchema.parse(data);
    default:
      throw new ProtocolValidationError(`Unknown agent message type: ${base.type}`, {
        type: base.type,
      });
  }
}

export function parseIncomingMessage(data: string): IncomingMessage {
  const parsed = JSON.parse(data);
  return IncomingMessageSchema.parse(parsed);
}

export function validateOutgoingMessage(msg: unknown): OutgoingMessage {
  return OutgoingMessageSchema.parse(msg);
}

export function isCallResult(msg: AgentMessage): msg is AgentCallResult {
  return msg.type === 'call_result';
}

export function isPing(msg: AgentMessage): msg is AgentPingMessage {
  return msg.type === 'ping';
}

export function isCapabilitiesUpdate(
  msg: AgentMessage
): msg is AgentCapabilitiesUpdateMessage {
  return msg.type === 'capabilities_update';
}

export function isCallMessage(msg: IncomingMessage): msg is CallMessage {
  return msg.type === 'call';
}

export function isPingMessage(msg: IncomingMessage): msg is PingMessage {
  return msg.type === 'ping';
}

export function isRegisteredMessage(msg: IncomingMessage): msg is RegisteredMessage {
  return msg.type === 'registered';
}

export function createRegisterMessage(
  agentId: string,
  agentName: string,
  repoRoots: string[],
  tools: RegisterMessage['capabilities']['tools'],
  features: Record<string, boolean>,
  agentVersion: string,
  os: string,
  arch: string
): RegisterMessage {
  return {
    type: 'register',
    protocolVersion: AGENT_PROTOCOL_VERSION,
    agentId,
    agentName,
    meta: {
      os,
      arch,
      agentVersion,
      repoRoots,
      features,
    },
    capabilities: {
      tools,
      resources: [],
      prompts: [],
    },
  };
}

export function createPongMessage(ts: number): PongMessage {
  return {
    type: 'pong',
    ts,
  };
}

export function createCallResultSuccess(
  requestId: string,
  content: ContentItem[]
): CallResultSuccess {
  return {
    type: 'call_result',
    requestId,
    ok: true,
    result: {
      content,
    },
  };
}

export function createCallResultError(
  requestId: string,
  code: CallError['code'],
  message: string
): CallResultError {
  return {
    type: 'call_result',
    requestId,
    ok: false,
    error: {
      code,
      message,
    },
  };
}

export function createCapabilitiesUpdateMessage(
  tools: CapabilitiesUpdateMessage['capabilities']['tools']
): CapabilitiesUpdateMessage {
  return {
    type: 'capabilities_update',
    protocolVersion: AGENT_PROTOCOL_VERSION,
    capabilities: {
      tools,
      resources: [],
      prompts: [],
    },
  };
}
