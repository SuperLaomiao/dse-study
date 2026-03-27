export interface AccountActionState {
  status: "idle" | "error" | "success";
  message: string;
}

export const idleAccountActionState: AccountActionState = {
  status: "idle",
  message: ""
};

export interface ProfileActionState {
  status: "idle" | "error" | "success";
  message: string;
}

export const idleProfileActionState: ProfileActionState = {
  status: "idle",
  message: ""
};
