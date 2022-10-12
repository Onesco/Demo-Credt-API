export interface IwalletFilter {
  id?: number;
  user_id?: number;
}

export interface IUser {
  id?: string;
  user_name: string;
  email: string;
  created_at?: Date;
  updated_at?: Date | null;
  role: string;
}
