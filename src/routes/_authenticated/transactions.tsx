import { useMemo } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { XIcon } from '@phosphor-icons/react';

import { api } from '@/lib/api';
import { useToastContext } from '@/contexts/ToastContext/UseToastContext';
import type { Transaction } from '@server/validators/transaction.validator';

export const Route = createFileRoute('/_authenticated/transactions')({
  component: TransactionsComponent,
});

async function getAllTransactions(): Promise<Transaction[]> {
  const res = await api.v1.transactions.$get();

  if (!res.ok) {
    throw new Error('Server error');
  }

  const data = await res.json();
  return data.data as Transaction[];
}

function TransactionsComponent() {
  const toast = useToastContext();
  const queryClient = useQueryClient();

  const {
    isPending,
    error,
    data = [],
  } = useQuery<Transaction[]>({
    queryKey: ['get-all-transactions'],
    queryFn: getAllTransactions,
  });

  const transactions = useMemo(() => data, [data]);

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await api.v1.transactions[':id{[0-9]+}'].$delete({
        param: { id: String(id) },
      });

      if (!res.ok) {
        throw new Error('Server error.');
      }
    },
    onSuccess: () => {
      toast.success('Transaction deleted.');
      queryClient.invalidateQueries({ queryKey: ['get-all-transactions'] });
    },
    onError: () => {
      toast.error('Error: Unable to delete transaction.');
    },
  });

  if (error) {
    return <div>An error has occurred: {error.message}</div>;
  }

  return (
    <div className="overflow-auto max-w-5xl m-auto">
      <table className="table">
        <caption>A list of all your transactions.</caption>
        <thead>
          <tr>
            <th>Id</th>
            <th>Date</th>
            <th>Title</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Categories</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {isPending ? (
            Array(3).fill(0).map((_, i) => (
              <tr key={i}>
                <td><div className="skeleton h-6 w-16"></div></td>
                <td><div className="skeleton h-6 w-32"></div></td>
                <td><div className="skeleton h-6 w-82"></div></td>
                <td><div className="skeleton h-6 w-32"></div></td>
                <td><div className="skeleton h-6 w-32"></div></td>
                <td><div className="skeleton h-6 w-32"></div></td>
                <td><div className="skeleton h-6 w-32"></div></td>
              </tr>
            ))
          ) : (
            transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-base-300">
                <td>{transaction.id}</td>
                <td>{transaction.date}</td>
                <td>{transaction.title}</td>
                <td>${transaction.amount}</td>
                <td>
                  <div
                    className={`badge badge-soft ${transaction.type === 'earning' ? 'badge-success' : 'badge-error'
                      }`}
                  >
                    {transaction.type}
                  </div>
                </td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {transaction.categories.map((c) => (
                      <span key={c.id} className="badge badge-sm">
                        {c.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <div className="flex gap-x-4">
                    <button className="btn btn-soft btn-xs btn-warning">Update</button>
                    <button
                      className="btn btn-soft btn-xs btn-circle btn-error"
                      disabled={deleteMutation.isPending}
                      onClick={() => deleteMutation.mutate(transaction.id)}
                    >
                      <XIcon size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {!isPending && transactions.length < 1 && (
        <h3 className="text-xl mt-8 text-center text-warning">
          There are no transactions. Add transactions to view them here.
        </h3>
      )}
    </div>
  );
}
