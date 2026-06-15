export default function InterviewPage({
  params,
}: {
  params: { companyId: string }
}) {
  return <div>{params.companyId}</div>
}
