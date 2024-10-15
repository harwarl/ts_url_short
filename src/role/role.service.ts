import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Role, Roles } from './entities/role.entity';
import { Repository } from 'typeorm';
import { predefinedRoles, REPOSITORY } from 'src/utils/constants';

@Injectable()
export class RoleService implements OnModuleInit {
  constructor(
    @Inject(REPOSITORY.ROLE) private roleRepository: Repository<Role>,
  ) {}

  async onModuleInit() {
    await this.seedRoles();
  }

  private async seedRoles() {
    for (let role of predefinedRoles) {
      const roleExists = await this.roleRepository.query(
        `SELECT * FROM roles WHERE name=?`,
        [role],
      );
      if (roleExists.length <= 0) {
        await this.roleRepository.query(
          `INSERT INTO roles VALUES (DEFAULT, ?)`,
          [role],
        );
        console.log(`Role '${role}' has been added.`);
      } else {
        console.log(`Role '${role}' already exists.`);
      }
    }
  }
}
