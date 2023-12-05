export type Post = {
  [key: string]: string;
};

export type Posts = Post[];

export type ContactContent = {
  id?: string;
  email: string;
  name: string;
  message: string;
};

export type ResponseJsonType = {
  message: string;
  data?: ContactContent;
};
