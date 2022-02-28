import { Room } from '../room/room';

export class Workspace {
  public id: number;
  public name: string;
  public rooms: Room[];
  constructor() { }
}