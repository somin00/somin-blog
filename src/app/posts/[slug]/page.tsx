import { Metadata } from "next";
import PostContent from "../../../components/Posts/PostDetail/PostContent";
import { getPostData } from "../../../../utils/post";

type Props = {
  params: {
    slug: string;
  };
};

export const generateMetadata = async ({ params: { slug } }: Props): Promise<Metadata> => {
  const postData = await getPostData(slug);

  return {
    title: postData.title,
    description: postData.description,
  };
};

export default async function PostDetailPage({ params: { slug } }: Props) {
  const postData = await getPostData(slug);
  return <PostContent postData={postData || {}} />;
}