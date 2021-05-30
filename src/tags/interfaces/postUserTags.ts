interface UserTags {
  id: number;
  name: string;
  sortOrder: string;
}
export default interface PostUserTags {
  tags: UserTags[];
}
