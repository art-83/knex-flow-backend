import { File } from '../../../../modules/files/infra/orm/entities/file.entity';
import { Address } from '../../../../modules/events/infra/orm/entities/address.entity';
import { Batch } from '../../../../modules/events/infra/orm/entities/batch.entity';
import { Event } from '../../../../modules/events/infra/orm/entities/event.entity';
import { EventActivity } from '../../../../modules/events/infra/orm/entities/event-activity.entity';
import { EventActivityInvited } from '../../../../modules/events/infra/orm/entities/event-activity-invited.entity';
import { EventActivityPresence } from '../../../../modules/events/infra/orm/entities/event-activity-presence.entity';
import { Order } from '../../../../modules/events/infra/orm/entities/order.entity';
import { Ticket } from '../../../../modules/events/infra/orm/entities/ticket.entity';
import { CardInformation } from '../../../../modules/payments/infra/orm/entities/card-information.entity';
import { Payment } from '../../../../modules/payments/infra/orm/entities/payment.entity';
import { Organization } from '../../../../modules/users/infra/orm/entities/organization.entity';
import { OrganizationRole } from '../../../../modules/users/infra/orm/entities/organization-role.entity';
import { OrganizationRolePermission } from '../../../../modules/users/infra/orm/entities/organization-role-permission.entity';
import { Permission } from '../../../../modules/users/infra/orm/entities/permission.entity';
import { User } from '../../../../modules/users/infra/orm/entities/user.entity';
import { UserOrganization } from '../../../../modules/users/infra/orm/entities/user-organization.entity';
import { UserPermission } from '../../../../modules/users/infra/orm/entities/user-permission.entity';

const appEntities = [
  User,
  Organization,
  UserOrganization,
  OrganizationRole,
  Permission,
  OrganizationRolePermission,
  UserPermission,
  Event,
  Address,
  Batch,
  EventActivity,
  EventActivityInvited,
  EventActivityPresence,
  Order,
  Ticket,
  Payment,
  CardInformation,
  File,
];
export { appEntities };
