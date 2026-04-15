import DefaultQueryOptionsDTO from '../../../../shared/infra/orm/dtos/default-query-options.dto';
import { Permission } from '../../infra/orm/entities/permission.entity';

interface PermissionQueryOptions extends Permission, DefaultQueryOptionsDTO {}

export default PermissionQueryOptions;
