import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async createUser(data: Partial<User>) {
        return await this.userModel.create(data);
    }

    async findByEmail(email: string) {
        return await this.userModel.findOne({ email });
    }

    async findById(id: string) {
        return await this.userModel.findById(id).select('-password');
    }
}
