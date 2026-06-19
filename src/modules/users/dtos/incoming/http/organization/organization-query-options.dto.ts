import { DefaultQueryOptionsDTO } from '../../../../../../shared/dtos/incoming/http/query/default-query-options.dto';
import { Organization } from '../../../../infra/orm/entities/organization.entity';

interface OrganizationQueryOptionsDTO extends Organization, DefaultQueryOptionsDTO {}
export { OrganizationQueryOptionsDTO };
