BEGIN;

CREATE SCHEMA boomy_assistant;
REVOKE ALL ON SCHEMA boomy_assistant FROM PUBLIC;

CREATE TABLE boomy_assistant.control (
  key text PRIMARY KEY,
  version uuid NOT NULL DEFAULT gen_random_uuid(),
  state jsonb NOT NULL,
  expires_at timestamptz,
  CHECK ((key = 'spend') = (expires_at IS NULL))
);

CREATE INDEX control_expiry ON boomy_assistant.control (expires_at) WHERE expires_at IS NOT NULL;

INSERT INTO boomy_assistant.control (key, state)
VALUES ('spend', '{"totals":{},"holds":{}}');

COMMIT;
