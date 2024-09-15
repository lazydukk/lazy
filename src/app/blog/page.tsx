import type { Metadata } from "next";
import { Link } from "next-view-transitions";
import { Suspense } from "react";
import { NewsletterForm } from "~~/app/blog/newsletter-form";
import { ViewCounter } from "~~/app/blog/view-counter";
import { getBlogPosts } from "~~/blog";
import { redis } from "~~/lib/redis";

export const metadata: Metadata = {
  title: "Blog",
  description: "Writings on programming, computer science, and more.",
  openGraph: {
    images: [
      {
        url: "https://www.nexxel.dev/og/home?title=nexxel's blog",
      },
    ],
  },
};

export default function BlogPage() {
  const posts = getBlogPosts().sort(
    (a, b) =>
      new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime(),
  );

  return (
    <section className="space-y-12">
      <h1 className="text-2xl font-medium tracking-tighter">blog</h1>

      <div className="space-y-6">
        <p className="font-medium">subscribe for updates. no spam.</p>
        <NewsletterForm />
      </div>

      <div className="space-y-12">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block"
          >
            <div className="flex w-full flex-col space-y-3">
              <p className="text-lg font-medium group-hover:underline group-hover:decoration-neutral-400 group-hover:underline-offset-4 group-hover:dark:decoration-neutral-600">
                {post.metadata.title.toLowerCase()}
              </p>
              <p className="prose prose-neutral dark:prose-invert">
                {post.metadata.description.toLowerCase()}
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {new Date(post.metadata.date)
                  .toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                  .toLowerCase()}
                <Suspense>
                  {" • "}
                  <Views slug={post.slug} />
                </Suspense>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

async function Views({ slug }: { slug: string }) {
  // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
  const allViews = (await redis.get("views")) as {
    slug: string;
    views: number;
  }[];

  return <ViewCounter slug={slug} allViews={allViews} />;
}
