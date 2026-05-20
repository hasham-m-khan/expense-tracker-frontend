import { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToastContext } from '@/contexts/ToastContext/UseToastContext';
import { IoClose } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import MultiSelectCombobox from '@/components/ComboBox';
import { api } from '@lib/api';

export const Route = createFileRoute("/_authenticated/create-transaction")({
  component: CreateTransactionComponent,
});

interface Category {
  id: number,
  name: string,
}

async function getCategories(): Promise<Category[]> {
  const res = await api.v1.categories.$get();

  if (!res.ok) {
    throw new Error("server error");
  }

  const data = await res.json();
  return data.data as Category[];
}

async function addCategories(categoriesStrings: string[]): Promise<Category[]> {
  const res = await api.v1.categories.$post(
    {
      json: { categories: categoriesStrings },
    });

  if (!res.ok) {
    throw new Error("server error");
  }

  const data = await res.json();
  return data.data as Category[];
}

function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function CreateTransactionComponent() {
  const toast = useToastContext();
  const queryClient = useQueryClient();

  const [updatedCategories, setUpdatedCategories] = useState<Category[]>([]);
  const [newCategoriesInput, setNewCategoriesInput] = useState('');

  const {
    isPending: isCategoriesPending,
    error: categoriesError,
    data: categoriesData,
  } = useQuery<Category[]>({
    queryKey: ['get-categories'],
    queryFn: getCategories,
  });

  useEffect(() => {
    if (categoriesData) {
      setUpdatedCategories(categoriesData);
    }
  }, [categoriesData]);

  const addCategoriesMutation = useMutation({
    mutationFn: addCategories,
    onSuccess: (newCategories) => {
      setUpdatedCategories(newCategories);
      setNewCategoriesInput('');
      queryClient.invalidateQueries({ queryKey: ['get-categories'] });
      toast.success('Categories added successfully');
    },
    onError: () => {
      toast.error('Failed to add categories')
    }
  });

  const form = useForm({
    defaultValues: {
      date: getCurrentDate(),
      title: '',
      amount: 1,
      type: 'expense' as 'expense' | 'earning',
      categories: [] as Category[],
    },
    onSubmit: async ({ value }) => {
      const res = await api.v1.transactions.$post({ json: value });

      if (!res.ok) {
        toast.error("Server error...")
        throw new Error("Server error...");
      }

      toast.success("Transaction added successfully.")
      form.reset();
    },
  });

  function handleAddCategories(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const parsedCategories = newCategoriesInput
      .split(',')
      .map((c) => c.trim().toLowerCase())
      .filter(Boolean);

    if (parsedCategories.length === 0) {
      toast.error('Enter at least one category.');
      return;
    }

    addCategoriesMutation.mutate(parsedCategories);
  }

  function removeUpdatedCategory(category: Category) {
    setUpdatedCategories((prev) => prev.filter((cat) => cat.id !== category.id));
  }

  return (
    <div>
      <div className="card card-sm card-border border-base-300 bg-base-100 max-w-2/3 mx-auto mb-4">
        <div className="card-body gap-4">
          <h2 className="card-title text-3xl mb-4">Create Transaction</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void form.handleSubmit();
            }}
          >
            <form.Field
              name="date"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return 'A value is required';

                  const selectedDate = new Date(value);
                  if (isNaN(selectedDate.getTime())) return 'Please enter a valid date';

                  const year2000 = new Date('2000-01-01');
                  if (selectedDate <= year2000) {
                    return 'Date must be after January 1, 2000';
                  }

                  return undefined;
                },
              }}
              children={(field) => (
                <div>
                  <label htmlFor={field.name} className={`input w-1/1${!field.state.meta.isValid ? " input-error" : ""}`}>
                    <span className="label capitalize">{field.name}</span>
                    <input
                      type="date"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      min="2000-01-01"
                      max="3000-12-31"
                      className="w-full"
                    />
                  </label>
                  <div className={`text-error pt-2 pb-4 ${!field.state.meta.isValid ? "" : " invisible"}`}>
                    {field.state.meta.isValid ? "\u00A0" : field.state.meta.errors.join(', ')}
                  </div>
                </div>
              )}
            />

            <form.Field
              name="title"
              validators={{
                onChange: ({ value }) =>
                  !value
                    ? 'A value is required'
                    : value.length < 3 || value.length > 128
                      ? 'Must be between 3 and 128 characters'
                      : undefined,
              }}
              children={(field) => (
                <div>
                  <label htmlFor={field.name} className={`input w-full${!field.state.meta.isValid ? " input-error" : ""}`}>
                    <span className="label capitalize">{field.name}</span>
                    <input type="text"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="The title of your transaction..."
                    />
                  </label>
                  <div className={`text-error pt-2 pb-4${!field.state.meta.isValid ? "" : " invisible"}`}>{
                    field.state.meta.isValid ? "&nbsp;" : field.state.meta.errors.join(',')}
                  </div>
                </div>
              )}
            />

            <form.Field
              name="amount"
              validators={{
                onChange: ({ value }) =>
                  !value
                    ? 'A value is required'
                    : value <= 0
                      ? 'Must be greater than 0'
                      : undefined,
              }}
              children={(field) => (
                <div>
                  <label htmlFor={field.name} className={`input w-full}`}>
                    <span className="label capitalize">{field.name}</span>
                    <input type="number"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(+e.target.value)}
                      placeholder="The amount for your transaction..."
                    />
                  </label>
                  <div className={`text-error pt-2 pb-4${!field.state.meta.isValid ? "" : " invisible"}`}>{
                    field.state.meta.isValid ? "&nbsp;" : field.state.meta.errors.join(',')}
                  </div>
                </div>
              )}
            />

            <form.Field
              name="type"
              children={(field) => (
                <div>
                  <label className="select">
                    <span className="label">Transaction type</span>
                    <select
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value as 'expense' | 'earning')}
                    >
                      <option disabled={true}>Select transaction type</option>
                      <option value="expense">Expense</option>
                      <option value="earning">Earning</option>
                    </select>
                  </label>
                </div>
              )}
            />

            <form.Field
              name="categories"
              children={(field) => (
                <div>
                  {!isCategoriesPending && (
                    <MultiSelectCombobox
                      items={updatedCategories as Category[]}
                      id={+field.name}
                      name={field.name}
                      selectedItems={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(items) => field.handleChange(items)}
                      className="py-11"
                    />
                  )}
                </div>
              )}
            />

            <div className="card-actions justify-end">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <>
                    <button
                      type="reset"
                      className='btn'
                      onClick={(e) => {
                        e.preventDefault()
                        form.reset()
                      }}
                    >
                      Reset
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={!canSubmit}>
                      {isSubmitting ? '...' : 'Create'}
                    </button>
                  </>
                )}
              />
            </div>
          </form>
        </div>
      </div>

      {/* CATEGORIES FORM */}
      <div className="card card-sm card-border border-base-300 bg-base-100 max-w-2/3 mx-auto">
        <div className="card-body p-4">
          <h2 className="card-title text-2xl mb-4">Create Categories</h2>
          <form className="flex gap-x-2" onSubmit={handleAddCategories}>
            <div className="flex flex-col">
              <label className="input input-sm">
                <span className="label">Add Category</span>
                <input
                  type="text"
                  value={newCategoriesInput}
                  onChange={(e) => setNewCategoriesInput(e.target.value)}
                  className=""
                />
              </label>
              <span className="text-xs text-neutral-content ml-2 mt-1">
                Each category must be separated by a comma.
              </span>
            </div>

            <div className="row">
              <button
                type="submit"
                className="btn btn-sm btn-primary"
              >
                Add <FaPlus size={10} />
              </button>
            </div>
          </form>

          <div className="card mt-4">
            <h3 className="card-title">Available Categories</h3>
            <div className="card-body border border-base-300 rounded rounded-2xl">
              <div className="badge-container flex flex-wrap gap-2" >
                {updatedCategories.map((uc) => (
                  <div
                    key={uc.id}
                    className="badge badge-soft badge-neutral cursor-pointer"
                    onClick={() => removeUpdatedCategory(uc)}
                  >
                    <span>{uc.name}</span>
                    <span><IoClose size={12} className="text-neutral-ccontent" /></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {categoriesError && (
            <div className="text-error text-sm mt-2">
              Failed to load categories.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}