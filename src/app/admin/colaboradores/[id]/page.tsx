import HistoryPage from "../../HistoryPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <HistoryPage id={id} />;
}