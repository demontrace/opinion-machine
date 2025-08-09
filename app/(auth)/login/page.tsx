'use client';

import { login } from "@/app/api/actions/auth";
import { useActionState } from "react";

export default function Login() {
  const [state, formAction, pending] = useActionState(login, {});

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" name="username" required />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" required />
      </div>
      <button type="submit" disabled={pending}>Login</button>
      {state.message !== undefined && (
        <div>
          {state.message}
        </div>
      )}
    </form>
  );
}
