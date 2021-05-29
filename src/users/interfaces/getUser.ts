export interface GetTags {
  id: string;
  name: string;
  sortOrder: string;
}
export interface GetUser {
  email: string;
  nickname: string;
  tags: GetTags[];
}
