import React, { Fragment } from "react";
import Link from "next/link";

import redirect from "lib/redirect";
import checkLoggedIn from "lib/checkLoggedIn";

import LoginBox from "components/LoginBox";

function Login() {
  return (
    <Fragment>
      <LoginBox />
      <hr />
      New?{" "}
      <Link href="/register">
        <a>Register</a>
      </Link>
    </Fragment>
  );
}

Login.getInitialProps = async ctx => {
  const { loggedInUser } = await checkLoggedIn(ctx.apolloClient);

  if (loggedInUser.me) {
    redirect(ctx, "/");
  }

  return {};
};

export default Login;
