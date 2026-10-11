import { redirect } from "next/navigation";

export const metadata = {
  title: "RSS 2.0 Syndication Feed | NewsFlow",
};

export default function RssFeedPage() {
  redirect("/rss.xml");
}

