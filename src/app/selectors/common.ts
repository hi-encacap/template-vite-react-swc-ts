import { createSelector } from "@reduxjs/toolkit";

import { UserRole } from "@constants/auth";
import { IConfig, INormalizedConfig } from "@interfaces/common";
import { RootState } from "@interfaces/redux";

export const userSelector = createSelector(
  (state: RootState) => state.common,
  (common) => common.user,
);

export const userRoleSelector = createSelector(userSelector, (user) => {
  let isAdmin = false;
  let isUser = false;

  if (!user) {
    return { isAdmin, isUser };
  }

  switch (user.role) {
    case UserRole.ADMIN:
      isAdmin = true;
      break;
    default:
      isUser = true;
  }

  return { isAdmin, isUser };
});

export const configSelector = createSelector(
  (state: RootState) => state.common,
  (common) => {
    const { config } = common;

    if (!config) {
      return {} as INormalizedConfig;
    }

    return config.reduce((acc: INormalizedConfig, item: IConfig) => {
      acc[item.key] = item.value;
      return acc;
    }, {} as INormalizedConfig);
  },
);
