import { inject, injectable } from 'tsyringe';
import { EventQueryOptions } from '../../dtos/event/event-query-options';
import { IEventRepositoryProvider } from '../../infra/orm/repositories/providers/event-repository.provider';
import { IEventActivityRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-repository.provider';
import { IEventActivityInvitedRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-invited-repository.provider';
import { ITicketRepositoryProvider } from '../../infra/orm/repositories/providers/ticket-repository.provider';
import { EventActivityQueryOptions } from '../../dtos/event-activity/event-activity-query-options';
import { EventActivityInvitedQueryOptions } from '../../dtos/event-activity-invited/event-activity-invited-query-options';
import { TicketQueryOptions } from '../../dtos/ticket/ticket-query-options';
import { EventActivity } from '../../infra/orm/entities/event-activity.entity';
import { EventActivityInvited } from '../../infra/orm/entities/event-activity-invited.entity';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { IUserOrganizationRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-organization-repository.provider';
import { IPermissionRepositoryProvider } from '../../../users/infra/orm/repositories/providers/permission-repository.provider';
import { IUserPermissionRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-permission-repository.provider';
import { PermissionDescriptionEnum } from '../../../users/infra/orm/enums/permission-description.enum';

@injectable()
class FindEventsService {
  constructor(
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
    @inject('EventActivityRepositoryProvider')
    private eventActivityRepository: IEventActivityRepositoryProvider,
    @inject('EventActivityInvitedRepositoryProvider')
    private eventActivityInvitedRepository: IEventActivityInvitedRepositoryProvider,
    @inject('TicketRepositoryProvider')
    private ticketRepository: ITicketRepositoryProvider,
    @inject('UserOrganizationRepositoryProvider')
    private userOrganizationRepository: IUserOrganizationRepositoryProvider,
    @inject('PermissionRepositoryProvider')
    private permissionRepository: IPermissionRepositoryProvider,
    @inject('UserPermissionRepositoryProvider')
    private userPermissionRepository: IUserPermissionRepositoryProvider,
  ) {}

  public async execute(user_id: string, options: Partial<EventQueryOptions>) {
    if (!options.organization_id) {
      throw new AppError(400, 'organization_id is required.', 'organization_id e obrigatorio.');
    }

    const userOrganization = (
      await this.userOrganizationRepository.find({ user_id, organization_id: options.organization_id })
    ).at(0);

    if (!userOrganization) {
      throw new AppError(
        403,
        'You do not have access to this organization.',
        'Voce nao tem acesso a esta organizacao.',
      );
    }

    const requiredPermission = (
      await this.permissionRepository.find({ description: PermissionDescriptionEnum.EVENTS_READ })
    ).at(0);

    if (!requiredPermission) {
      throw new AppError(404, 'Permission not found.', 'Permissao nao encontrada.');
    }

    const permissionGrant = (
      await this.userPermissionRepository.find({
        user_id,
        organization_id: options.organization_id,
        permission_id: requiredPermission.id,
      })
    ).at(0);

    if (!permissionGrant) {
      throw new AppError(
        403,
        'You do not have permission to perform this action.',
        'Voce nao tem permissao para realizar esta acao.',
      );
    }

    const events = await this.eventRepository.find(options);

    if (!events.length) {
      return { message: 'Events found successfully.', data: [] };
    }

    const eventIds = events.map(event => event.id);

    const [activitiesByEvent, invitedByEvent, ticketsByEvent] = await Promise.all([
      Promise.all(
        eventIds.map(event_id => this.eventActivityRepository.find({ event_id } as Partial<EventActivityQueryOptions>)),
      ),
      Promise.all(
        eventIds.map(event_id =>
          this.eventActivityInvitedRepository.find({ event_id } as Partial<EventActivityInvitedQueryOptions>),
        ),
      ),
      Promise.all(
        eventIds.map(event_id =>
          this.ticketRepository.find({ event_id, order_is_null: true } as Partial<TicketQueryOptions>),
        ),
      ),
    ]);

    const response = events.map((event, index) => {
      const activities = activitiesByEvent[index] ?? [];
      const invited = invitedByEvent[index] ?? [];
      const availableTickets = ticketsByEvent[index] ?? [];

      return {
        id: event.id,
        name: event.name,
        description: event.description,
        start_date: event.start_date,
        end_date: event.end_date,
        modality: event.modality,
        organization: {
          id: event.organization.id,
          name: event.organization.name,
        },
        available_tickets_count: availableTickets.length,
        activities: activities.map(activity => this.mapActivity(activity)),
        invited: invited.map(item => this.mapInvited(item)),
      };
    });

    return { message: 'Events found successfully.', data: response };
  }

  private mapActivity(activity: EventActivity) {
    return {
      id: activity.id,
      hours_to_retrieve: activity.hours_to_retrieve,
      max_participants: activity.max_participants,
      start_date: activity.start_date,
      end_date: activity.end_date,
    };
  }

  private mapInvited(invited: EventActivityInvited) {
    return {
      id: invited.id,
      event_activity_id: invited.event_activity.id,
      name: invited.name,
      institution: invited.institution,
      profession: invited.profession,
      user_id: invited.user?.id ?? null,
    };
  }
}
export { FindEventsService };
