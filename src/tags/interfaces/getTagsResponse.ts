interface GetTag {
  creator: {
    nickname: string;
    uid: string;
  };
  name: string;
  sortOrder: string;
}

export default interface GetTagsResponse {
  data: GetTag[];
  meta: {
    offset?: number;
    length?: number;
    quantity: number;
  };
}
