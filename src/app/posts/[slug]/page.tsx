import { Metadata } from "next";
import PostContent from "@/app/components/Posts/PostDetail/PostContent";
import { getAllPost, getPostData } from "@/app/utils/post";

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

export async function generateStaticParams() {
  const posts = await getAllPost();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
