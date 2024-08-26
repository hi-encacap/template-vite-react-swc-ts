import { ComponentType, ReactNode } from "react";

import { userSelector } from "@app/selectors/common";
import { UserRole } from "@constants/auth";

import useSelector from "../hooks/useSelector";

interface WithRoleProps {
  roles: UserRole[];
  fallback?: ReactNode;
}

type WithRoleComponentType<P = Record<string, string>> = ComponentType<P & WithRoleProps>;

const withRole = <P extends object>(Component: WithRoleComponentType<P>): WithRoleComponentType<P> => {
  const WithRole: WithRoleComponentType<P> = ({ roles, fallback, ...props }: WithRoleProps) => {
    const user = useSelector(userSelector);

    if (!user || !roles.includes(user.role)) {
      return fallback ?? null;
    }

    return <Component fallback={fallback} roles={roles} {...(props as P)} />;
  };

  return WithRole;
};

export default withRole;
