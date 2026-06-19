-- Migração: separar banner e ícone do evento
-- Execute no Postgres se a tabela ainda usa file_id

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'file_id'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'banner_file_id'
  ) THEN
    ALTER TABLE events RENAME COLUMN file_id TO banner_file_id;
  END IF;
END $$;

ALTER TABLE events
  ADD COLUMN IF NOT EXISTS icon_file_id uuid NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'FK_events_icon_file_id'
  ) THEN
    ALTER TABLE events
      ADD CONSTRAINT "FK_events_icon_file_id"
      FOREIGN KEY (icon_file_id) REFERENCES files(id)
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
