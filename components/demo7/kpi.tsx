export function KPI({
  title,
  value,
  hint,
}: {
  title: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-lg p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div>
        <div className="text-3xl font-semibold">{value}</div>
        {hint && <div className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1">{hint}</div>}
      </div>
    </div>
  );
}
