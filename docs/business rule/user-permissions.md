# Permissoes de usuario

## Visao geral

O modelo de autorizacao separa tres responsabilidades:

- `Permission` — catalogo global de acoes do sistema (ex.: `event:create`, `batch:read`).
- `OrganizationRole` + `OrganizationRolePermission` — **template** de permissoes configuravel por organizacao (preset reutilizavel).
- `UserPermission` — **fonte da verdade em runtime**: o que cada usuario pode fazer **dentro de uma organizacao especifica**.

Na API protegida, a checagem de acesso consulta `user_permissions`. Tabelas de role definem presets para popular ou atualizar esses grants; **nao autorizam sozinhas** enquanto nao existir a linha correspondente em `user_permissions`.

## Problema que o modelo resolve

No sistema anterior, um mesmo humano precisava de **duas contas** para atuar no mesmo ecossistema com capacidades diferentes (ex.: operar um evento em um perfil e administrar outro contexto em outro).

O desenho atual permite:

- **Uma conta** (`User`) para a pessoa.
- **Varios contextos organizacionais** (`UserOrganization`): a mesma pessoa na Org A e na Org B sem misturar permissoes.
- **Presets por organizacao** (`OrganizationRole`): cada tenant define seus proprios papeis (Admin, Operacao, Financeiro, etc.) sem afetar outras orgs.
- **Customizacao individual**: grants avulsos em `user_permissions` sem alterar o template do role.

Isolamento multi-tenant e garantido pelo escopo `organization_id` em membership e em todo grant efetivo.

## Entidades e papeis

| Entidade                        | Papel                                                                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `permissions`                   | Lista canonica de acoes; descricoes alinhadas a `PermissionDescriptionEnum`; sincronizada no boot via `SyncPermissionsService`. |
| `organization_roles`            | Papel nomeado **por organizacao** (ex.: "Admin da Org X"). Unicidade `(organization, name)`.                                    |
| `organization_role_permissions` | Quais permissoes do catalogo compoem aquele papel **naquela org**. Unicidade `(organizationRole, permission)`.                  |
| `user_organizations`            | Vinculo usuario ↔ organizacao (membership). Sem membership, nao ha contexto valido para agir na org.                            |
| `user_permissions`              | Grant efetivo: usuario + organizacao + permissao. Unicidade `(user, organization, permission)`.                                 |

## Template vs. efetivo

```text
Organization
  └── OrganizationRole ("Admin")
        └── OrganizationRolePermission[]     ← TEMPLATE (preset)

              │  aplicar role / convite / fluxo de gestao
              ▼
User
  └── UserPermission[] (organization_id = X)  ← EFETIVO (runtime)

              │  EnsureUserHasPermission / EnsureUserCanActOnOrganization
              ▼
        permitido ou 403
```

### Organization role (template)

- Serve para **guardar um conjunto reutilizavel** de permissoes por organizacao.
- Ex.: na Org X, o role "Admin" inclui `event:create`, `batch:read`, `user_permission:create`, etc.
- Alterar o template **nao altera automaticamente** os usuarios que ja receberam aquele preset; isso exige um fluxo explicito de reaplicar ou sincronizar grants (a implementar ou documentar no produto).

### User permission (efetivo)

- Toda acao protegida valida existencia de linha em `user_permissions` para `(user_id, organization_id, permission)`.
- Pode originar-se de:
  1. **Materializacao a partir de um role** — copiar `organization_role_permissions` para `user_permissions` ao atribuir o papel.
  2. **Grant personalizado** — admin concede permissao avulsa a uma pessoa (`CreateUserPermissionService`), sem mudar o template do role.

Ambos os casos convergem na mesma tabela; o runtime nao distingue origem na checagem atual.

## Fluxo de autorizacao em runtime

Ordem tipica nos services de dominio:

1. `EnsureUserOrganizationAccess` — usuario pertence a `organization_id` (via `user_organizations`).
2. `EnsureUserHasPermission` — existe grant em `user_permissions` para a `Permission` exigida naquela org.

`EnsureUserCanActOnOrganization` encapsula os dois passos acima.

Implicacao para desenvolvimento: **criar ou editar `organization_role_permission` nao libera endpoint** para ninguem ate que as linhas correspondentes existam em `user_permissions` (manualmente ou via fluxo de aplicar role).

## Justificativas de modelagem

### Por que `user_permissions` e a fonte da verdade em runtime?

- **Simplicidade na API**: um unico lugar para consultar em todo endpoint protegido.
- **Customizacao por pessoa**: template do role + excecoes na mesma tabela efetiva, sem resolver grafo role → permission em cada request.
- **Performance previsivel**: consulta direta por `(user_id, organization_id, permission_id)` com indice/unique constraint.
- **Auditoria operacional**: lista exata do que aquele usuario pode fazer na org, independente de como foi concedido.

### Por que manter `organization_role` e `organization_role_permission`?

- **Evitar configurar dezenas de permissoes usuario a usuario** em toda contratacao ou convite.
- **Presets por tenant**: Org A define "Operacao" diferente da Org B; roles nao sao globais do sistema.
- **Evolucao do produto**: novos tipos de evento e novas acoes no enum podem ser agrupadas em roles sem redesenhar o modelo.
- **UX de gestao**: tela de "montar papel" separada de "o que esta pessoa pode fazer hoje".

### Por que nao resolver role diretamente no guard?

O produto exige **permissoes personalizadas individuais** alem do preset. Materializar em `user_permissions` unifica template e custom no mesmo mecanismo de checagem, evitando regra dupla (role OR grant) em cada service.

### Por que escopo por `organization_id`?

- Mesmo usuario, permissoes diferentes em orgs diferentes.
- Impossibilita vazamento de capacidade administrativa de um cliente para outro.
- Alinha com eventos, lotes e demais recursos ja pertencentes a uma organizacao.

### Por que catalogo global `permissions` + enum?

- Descricoes estaveis (`event:create`, etc.) usadas no codigo (`PermissionDescriptionEnum`).
- Sync no boot garante que o banco reflita o enum sem migration manual para cada permissao nova.
- Roles e grants referenciam o mesmo catalogo, evitando strings soltas.

## Exemplo pratico

**Org X** define o role **Admin** com permissoes Y (via `organization_role_permissions`).

1. Admin da org convida **Maria** e aplica o role Admin (fluxo de produto).
2. Sistema le Y e cria linhas em `user_permissions` para `(Maria, Org X, *)`, respeitando unicidade.
3. Maria passa a passar em `EnsureUserHasPermission` para as acoes de Y na Org X.
4. Admin concede a Maria, ainda na Org X, `event:delete` avulso — nova linha em `user_permissions` sem alterar o template Admin.
5. Na **Org Z**, Maria pode ter outro conjunto de `user_permissions` (ou nenhum), sem interferencia da Org X.

## Regras e restricoes

| Regra                  | Detalhe                                                                                                                      |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Unicidade de grant     | Um usuario nao pode ter duas linhas para a mesma permissao na mesma org (`@Unique(['user', 'organization', 'permission'])`). |
| Membership obrigatoria | Target de grant deve pertencer a org (`EnsureUserOrganizationAccess` com contexto `subject`).                                |
| Quem concede           | Actor precisa de `user_permission:create` (ou permissao equivalente) na mesma org para criar grants.                         |
| Soft delete            | Entidades usam `deleted_at`; grants revogados devem seguir o padrao do modulo (delete logico).                               |
| Role fora da org       | `organization_role` e permissoes do role sao sempre filtrados por `organization_id` do contexto da requisicao.               |

## Referencias no codigo

- Entidade efetiva: `src/modules/users/infra/orm/entities/user-permission.entity.ts`
- Template de role: `organization-role.entity.ts`, `organization-role-permission.entity.ts`
- Checagem runtime: `src/shared/infra/http/authorization/ensure-user-has-permission.service.ts`
- Enum de acoes: `src/modules/users/enums/permission-description.enum.ts`
- Sync do catalogo: `src/modules/users/services/permissions/sync-permissions.service.ts`
