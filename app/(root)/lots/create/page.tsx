import { Metadata } from "next";

import Create from "@/components/section/lots/Create";

import getUserInfo from "@/hooks/getUserInfo";

export const metadata: Metadata = {
  title: "Create a Lot",
  description: "Create a new auction lot to sell your items",
};

export default async function CreateBidPage() {
  const user = await getUserInfo();

  if (!user) {
    return <p>You need to be logged in to view this page</p>;
  }
  return <Create user={user} />;
}
