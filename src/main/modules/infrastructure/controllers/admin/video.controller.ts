import { Controller } from "@nestjs/common";
import { Roles } from "@polyflix/x-utils";
import { Role } from "@polyflix/x-utils/dist/types/roles.enum";

@Controller()
@Roles(Role.Admin)
export class AdminVideoController {}
