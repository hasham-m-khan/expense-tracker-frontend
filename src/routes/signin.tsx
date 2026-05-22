import { createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { FcGoogle } from "react-icons/fc";
import { FaKey } from "react-icons/fa";
import { HiUser } from "react-icons/hi2";
import { MdAlternateEmail } from "react-icons/md";
import MicrosoftLogo from "../../public/ms-symbollockup_mssymbol_19.svg";

import { api } from "@/lib/api";
import { SigninSchema } from '@/entities/SigninSchema';


export const Route = createFileRoute('/signin')({
  component: SignIn,
})

export default function SignIn() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      const res = await api.v1.auth.login.$post({ json: value });

      if (!res.ok) {
        const data = await res.json();
        form.setErrorMap({ onSubmit: { form: data.message, fields: {}} });
        return;
      }

      const data = await res.json();
      queryClient.setQueryData(["user"], data.data);
      navigate({ to: '/dashboard' })
    },
  });

  return (
    <div className="w-1/4 mx-auto">

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
        className="w-full"
      >
        <div className="card bg-base-100 card-border border-base-300 card-sm shadow-sm overflow-hidden">
          <div className="border-base-300 border-b border-dashed">
            <div className="flex items-center gap-2 p-4">
              <div className="grow">
                <div className="flex items-center gap-2">
                  <HiUser size={20} />
                  <h2 className="font-medium text-xl">Sign In</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="card-body gap-4">
            <form.Subscribe
              children={(state) =>
                state.errorMap?.onSubmit ? (
                  <div className="rounded bg-error/20 p-2">
                    <ul>
                      <li className="text-red-500 flex items-center gap-2">
                        <span className="status status-error"></span>
                        {String(state.errorMap.onSubmit)}
                      </li>
                    </ul>
                  </div>
                ) : (
                  null
                )
              }
            />
            <p className="text-xs opacity-60">Sign in to your account</p>
            <form.Field
              name='email'
              validators={{
                onChange: ({ value }) => {
                  const result = SigninSchema.shape.email.safeParse(value);
                  return result.success ? undefined : result.error.issues[0].message;
                },
              }}
              children={(field) => (
                <div className="flex flex-col gap-1">
                  <label htmlFor={field.name}
                    className={`
                    input input-border flex w-full items-center gap-2
                    ${field.state.meta.isPristine
                        ? undefined
                        : field.state.meta.isValid
                          ? 'input-success'
                          : 'input-error'
                      }
                  `}>
                    <MdAlternateEmail size={16} className="opacity-70" />
                    <input type="email"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Email"
                      className="grow"
                    />
                  </label>
                  <div className={`text-error pt-2 pb-4 ${!field.state.meta.isValid ? "" : " hidden"}`}>
                    {field.state.meta.isValid &&
                      field.state.meta.errors.map((e, i) => (
                        <span key={i} className="text-error flex items-center gap-2 px-2 text-xs">
                          <span className="status status-error status-sm inline-block"></span>
                          {e}
                        </span>
                      ))
                    }
                  </div>
                </div>
              )}
            />
            <form.Field
              name='password'
              validators={{
                onChange: ({ value }) => {
                  const result = SigninSchema.shape.password.safeParse(value);
                  return result.success ? undefined : result.error.issues[0].message;
                },
              }}
              children={(field) => (
                <div className="flex flex-col gap-1">
                  <div className="flex flex-col gap-1">
                    <label htmlFor={field.name}
                      className={`
                      input input-border flex w-full items-center gap-2
                      ${field.state.meta.isPristine
                          ? undefined
                          : field.state.meta.isValid
                            ? 'input-success'
                            : 'input-error'
                        }
                  `}>
                      <FaKey size={16} className="opacity-70" />
                      <input type="password"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="grow"
                        placeholder="Password"
                      />
                    </label>
                  </div>
                  <div className="flex justify-between pt-2">
                    <div>
                      <div className={`text-error pb-4 ${!field.state.meta.isValid ? "" : " hidden"}`}>
                        {field.state.meta.isValid &&
                          field.state.meta.errors.map((e, i) => (
                            <span key={i} className="text-error flex items-center gap-2 px-2 text-xs">
                              <span className="status status-error status-sm inline-block"></span>
                              {e}
                            </span>
                          ))}
                      </div>
                    </div>
                    <div className="flex">
                      <a href="#" className="link-info px-1">Forgot password?</a>
                    </div>
                  </div>
                </div>
              )}
            />
            <div className="card-actions items-center justify-end gap-6">
              <button type="submit" className="btn btn-primary w-full">Sign in</button>
            </div>

            <div className="divider">OR</div>

            <div className="flex flex-col gap-2">
              <a href="#" className="btn bg-white text-black border-[#747775] w-full hover:bg-gray-200 hover:border-gray-300">
                <FcGoogle />
                Login with Google
              </a>
              <a href="#" className="btn bg-slate-900 text-white border-base-300 w-full hover:bg-gray-700 hover:border-gray-500">
                <img src={MicrosoftLogo} />
                Login with Microsoft
              </a>
            </div>

          </div>
        </div>
      </form>


    </div>
  )
}
