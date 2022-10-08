/* eslint-disable prettier/prettier */
import { Injectable, HttpCode, HttpException, HttpStatus, ForbiddenException} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from '../../database/database.service';
import { hashUtils } from "../../utils/utils.lib";

export interface User {
  id: number;
  user_name: string;
  created_at: string;
  update_at: string;
}

@Injectable()
export class UserService {
  constructor(private databaseService: DatabaseService){};
  knex = this.databaseService.getDbHandler();

  @HttpCode(201)
  async create(createUserDto: CreateUserDto) {
    const {first_name, last_name, email, password} = createUserDto
    try {
      const user = await this.knex('users').where({email}).first();
      if(user && user.id){
        return new ForbiddenException(
          {
            status: HttpStatus.FORBIDDEN,
            error: `user already exist with this ${email}` 
          }
        );
      };
      const hashedPassword = hashUtils.hash(password);
      const user_name = `${first_name} ${last_name}`.toLocaleUpperCase()
      await this.knex.table('users').insert({ user_name, email, password: hashedPassword});
    } catch (error) {
      console.log(error)
      return new HttpException({
        error:`server error: ${error}`,
      status: 500
      }, 500)
    }
    return `user ${email} created`;
  }

  async findAll() {
    const users = await this.knex('users');
    return { users };
  }

  async findOne(id: number) {
    const user = await this.knex('users').where({id}).first();
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
