"use client";

import { useEffect, useState } from "react";
import api from "@/hooks/useAxios";

interface Props {
  clientId: string;
  siteId: string;
  jobId: string;
  startDate: string;
  endDate: string;
}

const TurnAroundExecSummary = ({
  clientId,
  siteId,
  jobId,
  startDate,
  endDate,
}: Props) => {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await api.get(
        "/turnaroudexecution/getTurnAroundExecutionSummary/",
        {
          params: { clientId, siteId, jobId, startDate, endDate },
        }
      );

      console.log(res.data.data.summary);

      setSummary(res.data?.data?.summary || null);
    } catch (error) {
      console.error("Turnaround summary error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clientId && siteId && jobId && startDate && endDate) {
      fetchData();
    }
  }, [clientId, siteId, jobId, startDate, endDate]);

  if (loading)
    return <p className="text-center py-5 text-gray-500">Loading summary...</p>;

  if (!summary)
    return <p className="text-center py-5 text-gray-500">No records found</p>;

  return (
    <div className="mt-5 bg-white p-5 rounded-2xl shadow-sm">
      <h2 className="text-lg font-bold mb-3">Turnaround Execution Summary</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Direct Earned MHRS */}
        <div className="mt-6">
          <h3 className="font-bold text-lg mb-3">Direct Earned MHRS</h3>

          <div className=" rounded-xl overflow-hidden">
            

            {Object.entries(summary.directEarnedSummary).map(
              ([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-2 p-3 border-b last:border-none border-gray-300"
                >
                  <div className="text-gray-600 font-semibold text-[14px]">{label}</div>
                  <div className="text-right text-gray-600 text-[14px]">{value}</div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Percent Complete */}
        <div className="mt-6">
          <h3 className="font-bold text-lg mb-3">% Complete</h3>

          <div className=" rounded-xl overflow-hidden">
            

            {Object.entries(summary.percentCompleteSummary).map(
              ([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-2 p-3 border-b last:border-none border-gray-300"
                >
                  <div className="text-gray-600 font-semibold text-[14px]">{label}</div>
                  <div className="text-right text-gray-600 text-[14px]">{value}%</div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TurnAroundExecSummary;
