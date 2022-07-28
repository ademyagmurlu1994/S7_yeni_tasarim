import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

export default function middleware(req) {
  const { cookies } = req;
  const jwt = cookies.SigortaJWT;
  const secret = process.env.NEXT_PUBLIC_SECRET;
  //console.log("Req: ", req.url);
  const url = req.url;

  const privateUrls = ["/dashboard", "/update-password"];
  const authUrls = ["/login", "/register", "/forget-password"];

  for (var authUrl of authUrls) {
    if (url.includes(authUrl)) {
      if (jwt) {
        try {
          verify(jwt, secret);
          return NextResponse.redirect("/");
        } catch (error) {
          console.log(error);
          return NextResponse.next();
        }
      }
    }
  }

  for (var privateUrl of privateUrls) {
    if (url.includes(privateUrl)) {
      if (jwt === undefined) {
        return NextResponse.redirect("/login");
      }

      try {
        verify(jwt, secret);

        return NextResponse.next();
      } catch (e) {
        return NextResponse.redirect("/login");
      }
    }
  }

  return NextResponse.next();
}
