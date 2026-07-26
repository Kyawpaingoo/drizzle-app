import { Context } from "hono";
import { SignUpUserDtoType } from "../dto/auth.dto";
import { auth } from "../lib/auth";

const setSessionCookie = (c: Context, headers: Headers) => {
  for (const cookie of headers.getSetCookie()) {
    c.header("Set-Cookie", cookie, { append: true });
  }
}

export const signUp = async (c: Context) => {
  const data: SignUpUserDtoType = await c.req.json();

  try {
    const { name, email, password } = data;

    const response = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      }
    })

    return c.json({
      message: "User signed up successfully",
      result: response,
    })

  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
}

export const signIn = async (c: Context) => {
  const data: SignUpUserDtoType = await c.req.json();
  try {
    const { email, password } = data;

    const { headers, response } = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: c.req.raw.headers,
      returnHeaders: true,
    })

    setSessionCookie(c, headers);

    return c.json({
      message: "User signed in successfully",
      result: response,
    })
  }
  catch(error: any) {
    return c.json({ error: error.message }, 500);
  }
}

export const signOut = async (c: Context) => {
  try {
    const { headers, response } = await auth.api.signOut({
      headers: c.req.raw.headers,
      returnHeaders: true,
    })

    setSessionCookie(c, headers);

    return c.json({
      message: "User signed out successfully",
      result: response,
    })
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
}
