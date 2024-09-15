import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MDX } from "~~/app/blog/[slug]/mdx";
import { ViewCounter } from "~~/app/blog/view-counter";
import { getBlogPostBySlug } from "~~/blog";
import { redis } from "~~/lib/redis";

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  const post = getBlogPostBySlug(params.slug);
  if (!post) {
    return;
  }

  const publishedTime = formatDate(post.metadata.date);

  return {
    title: post.metadata.title,
    description: post.metadata.description,
    openGraph: {
      title: post.metadata.title,
      description: post.metadata.description,
      publishedTime,
      type: "article",
      url: `https://www.nexxel.dev/blog/${post.slug}`,
      images: [
        {
          url: `https://www.nexxel.dev/og/blog?title=${post.metadata.title}&top=${publishedTime}`,
        },
      ],
    },
    twitter: {
      title: post.metadata.title,
      description: post.metadata.description,
      card: "summary_large_image",
      creator: "@nexxeln",
      images: [
        `https://www.nexxel.dev/og/blog?title=${post.metadata.title}&top=${publishedTime}`,
      ],
    },
  };
}

export default function Post({ params }: { params: { slug: string } }) {
  const post = getBlogPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.date,
            dateModified: post.metadata.date,
            description: post.metadata.description,
            image: `https://nexxel.dev/og/blog?title=${post.metadata.title}&top=${formatDate(
              post.metadata.date,
            )}`,
            url: `https://nexxel.dev/blog/${post.slug}`,
            author: {
              "@type": "Person",
              name: "Shoubhit Dash",
            },
          }),
        }}
      />

      <h1 className="title mb-2 max-w-[650px] text-3xl font-medium tracking-tighter">
        {post.metadata.title}
      </h1>
      <div className="mb-8 flex max-w-[650px] items-center justify-between text-sm">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {formatDate(post.metadata.date)}
        </p>
        <Suspense>
          <Views slug={post.slug} />
        </Suspense>
      </div>

      <article className="prose prose-neutral dark:prose-invert">
        <MDX source={post.content} />
      </article>
    </section>
  );
}

async function Views({ slug }: { slug: string }) {
  // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
  const viewsData = (await redis.get("views")) as {
    slug: string;
    views: number;
  }[];

  const postViews = viewsData.find((view) => view.slug === slug);
  if (postViews) {
    postViews.views += 1;
  } else {
    viewsData.push({ slug, views: 1 });
  }

  await redis.set("views", JSON.stringify(viewsData));

  return <ViewCounter slug={slug} allViews={viewsData} />;
}
