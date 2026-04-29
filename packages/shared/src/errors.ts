export class HelixError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'HelixError';
  }
}

export class ProtocolValidationError extends HelixError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'PROTOCOL_VALIDATION_FAILED', context);
    this.name = 'ProtocolValidationError';
  }
}

export class ToolNotFoundError extends HelixError {
  constructor(toolName: string) {
    super(`Tool not found: ${toolName}`, 'TOOL_NOT_FOUND', { toolName });
    this.name = 'ToolNotFoundError';
  }
}

export class ToolExecutionError extends HelixError {
  constructor(toolName: string, cause: unknown, durationMs?: number) {
    super(`Tool execution failed: ${toolName}: ${String(cause)}`, 'TOOL_EXECUTION_FAILED', {
      toolName,
      cause: String(cause),
      durationMs,
    });
    this.name = 'ToolExecutionError';
  }
}

export class ToolValidationError extends HelixError {
  constructor(toolName: string, issues: string[]) {
    super(`Invalid args for ${toolName}: ${issues.join(', ')}`, 'TOOL_VALIDATION_FAILED', {
      toolName,
      issues,
    });
    this.name = 'ToolValidationError';
  }
}

export class AgentNotFoundError extends HelixError {
  constructor(agentId: string) {
    super(`Agent not connected: ${agentId}`, 'AGENT_NOT_FOUND', { agentId });
    this.name = 'AgentNotFoundError';
  }
}

export class CircuitOpenError extends HelixError {
  constructor(agentId: string) {
    super(`Circuit open for agent: ${agentId}`, 'CIRCUIT_OPEN', { agentId });
    this.name = 'CircuitOpenError';
  }
}

export class AuthError extends HelixError {
  constructor(reason: string) {
    super(`Auth failed: ${reason}`, 'AUTH_FAILED', { reason });
    this.name = 'AuthError';
  }
}
