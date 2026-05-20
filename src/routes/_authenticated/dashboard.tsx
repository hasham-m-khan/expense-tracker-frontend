import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: Dashboard,
});

type OverallStatus = {
  totalExpenses: number;
  totalEarnings: number;
  totalSavings: number;
};

async function getOverallStatus(): Promise<OverallStatus> {
  const res = await api.v1.transactions['overall-status'].$get();

  if (!res.ok) {
    throw new Error('Server error');
  }

  const json = await res.json();
  return json.data as OverallStatus;
}

function Dashboard() {
  const { isPending, error, data } = useQuery<OverallStatus>({
    queryKey: ['overall-status'],
    queryFn: getOverallStatus,
  });

  if (error) return <div>An error has occurred: {error.message}</div>;

  return (
    <div className="flex justify-center gap-x-2">
      <div className="flex flex-col gap-y-2">
        <div className="card card-xl card-border border-base-300 bg-base-100 w-[350px] mx-auto">
          <div className="card-body">
            <div className="card-title text-3xl font-bold">Total Spent</div>
            <div className="text-md text-gray-400">
              <span>The total amount you've spent</span>
            </div>
            {isPending ? (
              <div><span className="loading loading-dots loading-md"></span></div>
            ) : (
              <div className="mt-4 text-2xl">${data!.totalExpenses.toFixed(2)}</div>
            )}
          </div>
        </div>

        <div className="card card-xl card-border border-base-300 bg-base-100 w-[350px] mx-auto">
          <div className="card-body">
            <div className="card-title text-3xl font-bold">Total Earnings</div>
            <div className="text-md text-gray-400">
              <span>The total amount you've earned</span>
            </div>
            {isPending ? (
              <div><span className="loading loading-dots loading-md"></span></div>
            ) : (
              <div className="mt-4 text-2xl">${data!.totalEarnings.toFixed(2)}</div>
            )}
          </div>
        </div>
      </div>

      <div className="card card-xl card-border border-base-300 bg-base-100 w-[350px]">
        <div className="card-body">
          <div className="card-title text-4xl font-bold">Total Savings</div>
          <div className="text-md text-gray-400">
            <span>The total amount you've saved</span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            {isPending ? (
              <div><span className="loading loading-dots loading-md"></span></div>
            ) : (
              <div className="text-6xl font-bold">
                <h2
                  className={
                    Math.sign(data!.totalSavings) === 1
                      ? 'text-success'
                      : Math.sign(data!.totalSavings) === -1
                        ? 'text-error'
                        : 'text-warning'
                  }
                >
                  ${data!.totalSavings.toFixed(2)}
                </h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
