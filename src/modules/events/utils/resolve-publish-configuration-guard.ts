import { OrganizationConfigurationDTO } from '../../users/dtos/internal/domain/organization-configuration.dto';

type PublishGuardFlag = Extract<keyof OrganizationConfigurationDTO, `can_${string}_after_publish`>;

function resolvePublishConfigurationGuard(
  configuration: OrganizationConfigurationDTO | undefined,
  flag: PublishGuardFlag,
  defaultValue: boolean,
): boolean {
  if (!configuration) {
    return defaultValue;
  }

  const value = configuration[flag];

  if (value === undefined) {
    return defaultValue;
  }

  return value;
}
export { resolvePublishConfigurationGuard };
