import { DefaultQueryOptionsDTO } from '../../../../../../shared/dtos/incoming/http/query/default-query-options.dto';
import { Permission } from '../../../../infra/orm/entities/permission.entity';

interface PermissionQueryOptionsDTO extends Permission, DefaultQueryOptionsDTO {}
export { PermissionQueryOptionsDTO };
