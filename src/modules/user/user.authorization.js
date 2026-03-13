import { roleenum } from "../../config/models/user.model.js";

export const endPoint = {
  profile: [roleenum.admin, roleenum.user],
  restoreAccount: [roleenum.admin],
  deleteAccount: [roleenum.admin],
};
