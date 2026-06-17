-- Bootstrap SQL para piloto (action-plan 17/06)
-- Substitua :user_id e :organization_name antes de executar.
-- Permissões devem existir na tabela `permissions` (SyncPermissionsService na subida do servidor).

-- 1. Organização
INSERT INTO organizations (id, name, configuration, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  :organization_name,
  NULL,
  NOW(),
  NOW()
)
RETURNING id;

-- Guarde o id retornado como :organization_id

-- 2. Membership
INSERT INTO user_organizations (id, user_id, organization_id, created_at, updated_at)
VALUES (gen_random_uuid(), :user_id, :organization_id, NOW(), NOW());

-- 3. Permissões mínimas do organizador
INSERT INTO user_permissions (id, user_id, organization_id, permission_id, created_at, updated_at)
SELECT gen_random_uuid(), :user_id, :organization_id, p.id, NOW(), NOW()
FROM permissions p
WHERE p.description IN (
  'events:read',
  'events:manage',
  'activities:read',
  'activities:manage',
  'batches:read',
  'batches:manage',
  'team:read',
  'team:manage'
)
AND p.deleted_at IS NULL;
