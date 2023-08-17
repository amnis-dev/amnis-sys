/* eslint-disable no-shadow */
import type { EntityState } from '@reduxjs/toolkit';
import type { UID, UIDv2 } from '../../core/index.js';

/**
 * Agent key type.
 */
export type AgentKey = 'agent';

/**
 * @pattern ^agent:[A-Za-z0-9_-]{21}$
 */
export type AgentID = UIDv2<AgentKey>;

/**
 * Types of agents.
 */
export type AgentType = 'default' | 'local' | 'webauthn' | 'mock';

/**
 * An agent for identification. This type is used to generate credentials for
 * authentication.
 */
export interface Agent {
  /**
   * Unique identifier.
   */
  $id: AgentID;

  /**
   * Name of the agent.
   */
  name: string;

  /**
   * Device name.
   */
  device: string;

  /**
   * Type of the agent.
   */
  type: AgentType;

  /**
   * The agent's public key.
   */
  publicKey: string;

  /**
   * Credential ID associated with this agent.
   */
  $credential: UID<Credential>;

  /**
   * The agent's private key (usually only available on the authentication device).
   * This is only used for local agents that are accompanied with a password.
   */
  privateKey?: string;
}

/**
 * Creation Type for an Agent.
 */
export type AgentCreator = Omit<Agent, '$id' | '$credential'> & { $credential?: UID<Credential> };

/**
 * Agent collection meta data.
 */
export type AgentMeta = {
  active: AgentID | null;
};

/**
 * The Slice State.
 */
export type AgentSlice = AgentMeta & EntityState<Agent, AgentID>;
