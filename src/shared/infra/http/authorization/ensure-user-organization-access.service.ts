import { inject, injectable } from 'tsyringe';
import { IUserOrganizationRepositoryProvider } from '../../../../modules/users/infra/orm/repositories/providers/user-organization-repository.provider';
import { AppError } from '../errors/app-error';

@injectable()
class EnsureUserOrganizationAccessService {
  constructor(
    @inject('UserOrganizationRepositoryProvider')
    private userOrganizationRepository: IUserOrganizationRepositoryProvider,
  ) {}

  /**
   * @param membershipContext `actor`: authenticated user must belong to the org (403).
   *   `subject`: another user must belong to the org, e.g. grant target (400).
   */
  public async execute(
    user_id: string,
    organization_id: string,
    membershipContext: 'actor' | 'subject' = 'actor',
  ): Promise<void> {
    const membership = (
      await this.userOrganizationRepository.find({
        user_id,
        organization_id,
      })
    ).at(0);

    if (!membership) {
      if (membershipContext === 'subject') {
        throw new AppError(
          400,
          'Target user does not belong to this organization.',
          'Usuario alvo nao pertence a esta organizacao.',
        );
      }

      throw new AppError(
        403,
        'You do not have access to this organization.',
        'Voce nao tem acesso a esta organizacao.',
      );
    }
  }
}
export { EnsureUserOrganizationAccessService };
