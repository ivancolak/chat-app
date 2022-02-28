import { Room } from '../room/room';
import { User } from '../user/user';

export class Message {
  id: number;
  content: string;
  date: string;
  room: Room;
  user: User;
  userId: string;
  roomId: number;
}
