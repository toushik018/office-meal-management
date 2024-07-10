import { UserRole, UserStatus } from "@prisma/client";

export interface UserInput {
    searchTerm?: string;
    username?: string;
    email?: string;
    role?: string;
    status?: UserStatus;
}


export const userFilterableFields = ['searchTerm', 'username', 'email', 'role', 'status'];


export interface IUpdateUserRole {
    userId: string;
    newRole: UserRole;
}


export interface IUpdateUserStatus {
    userId: string;
    status: UserStatus;
}
