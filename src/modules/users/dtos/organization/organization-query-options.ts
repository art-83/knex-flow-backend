import { DefaultQueryOptionsDTO } from '../../../../shared/infra/orm/dtos/default-query-options.dto';
import { Organization } from '../../infra/orm/entities/organization.entity';

interface OrganizationQueryOptions extends Organization, DefaultQueryOptionsDTO {}
export { OrganizationQueryOptions };
