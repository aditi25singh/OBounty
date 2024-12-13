'use client'

import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";
import {Input} from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import {Button} from "@nextui-org/button";
import {GithubIcon, GoogleIcon} from "@/components/icons";
import React, { useEffect } from "react";
import { PressEvent } from "@react-types/shared";
import Cookies from 'universal-cookie';
import { useRouter, useSearchParams } from "next/navigation";

export default function SigninPage() {
  let [email, setEmail] = React.useState("")
  let [emailDesc, setEmailDesc] = React.useState("")
  let [password, setPassword] = React.useState("")
  let [passwordDesc, setPasswordDesc] = React.useState("")
  const router = useRouter();

  const GOOGLE_OAUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
  const GOOGLE_CLIENT_ID = "224762246518-qrs4qiqo99ne4vd6sge0oscbbaal2c88.apps.googleusercontent.com"
  const GOOGLE_CALLBACK_URL = "http://localhost:5000/google/callback"

  const GOOGLE_OAUTH_SCOPES = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ];

  let scopes = GOOGLE_OAUTH_SCOPES.join(" ");
  const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${GOOGLE_OAUTH_URL}?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_CALLBACK_URL}&access_type=offline&response_type=code&state=signin&scope=${scopes}`;

  const GITHUB_OAUTH_URL = "https://github.com/login/oauth/authorize"
  const GITHUB_CLIENT_ID = "Ov23liQJvV07KLexytYC"
  const GITHUB_CALLBACK_URL = "http://localhost:5000/github/callback"

  const GITHUB_OAUTH_SCOPES = [
    "user:email",
    "read:user"
  ]

  scopes = GITHUB_OAUTH_SCOPES.join(" ");
  const GITHUB_OAUTH_CONSENT_SCREEN_URL = `${GITHUB_OAUTH_URL}?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_CALLBACK_URL}&state=signin&scope=${scopes}&prompt=select_account`;

  const params = useSearchParams();

  const signInOAuth = async() => {
    let auth = params.get("token");

    console.log("In within signInOAuth() : token: ", auth);

    if (auth === null)
        return;

    const cookies = new Cookies();
        cookies.set("token", auth, {
          path : '/',
          maxAge : 60 * 60,
        });
        router.push("/explore");
        router.refresh();
  }

  useEffect(() => {
    signInOAuth();
  }, [])

  const signIn = async (e: PressEvent) => {
    try {
      setEmailDesc("");
      setPasswordDesc("");
      let res = await fetch("/api/v1/signin", {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          "email": email,
          "password": password
        })
      })

      console.log(res);

      if (res.ok) {
        let message = await res.json();
        const cookies = new Cookies();
        cookies.set("token", message["token"], {
          path : '/',
          maxAge : 60 * 60,
        });
        router.push("/explore");
        router.refresh();
      } else {
        let error = await res.json();
        if (error["errorcode"] === 100) {
          setEmailDesc("User account does not exist.");
        } else if (error["errorcode"] === 101) {
          setPasswordDesc("Invalid email/password provided.");
        }
      }
      
    } catch (err) {

    }
  }

  return (
    <div className="lg:w-2/5">
      <Card>
          <CardBody>
            <div className="flex flex-col p-6 space-y-1">
              <h3 className="text-2xl font-bold">Sign In</h3>
              <p className="text-foreground/50 text-sm">Choose your preferred sign in method</p>

              <div className="flex gap-2 flex-col pt-4">
                <Button 
                  color="default" 
                  startContent={<GoogleIcon size={30} />} 
                  variant="ghost"
                  href = {GOOGLE_OAUTH_CONSENT_SCREEN_URL}
                  as = {Link}
                > 
                  Continue with Google 
                </Button>
                <Button 
                  color="default" 
                  startContent={<GithubIcon size={30} />} 
                  variant="ghost"
                  href = {GITHUB_OAUTH_CONSENT_SCREEN_URL}
                  as = {Link}
                > 
                    Continue with Github 
                </Button>
              </div>

              <div className="flex items-center gap-2 py-6">
                <hr className="bg-divider border-none w-full h-divider flex-1" role="separator"></hr>
                <p className="shrink-0 text-tiny font-semibold text-default-400">OR CONTINUE WITH</p>
                <hr className="bg-divider border-none w-full h-divider flex-1" role="separator"></hr>
              </div>

              <form className="flex flex-col space-y-1 lg:w-4/4 gap-2">
                <Input
                  type="email"
                  label="Email"
                  className="max-w"
                  size = "sm"
                  variant= "bordered"
                  onValueChange={setEmail}
                  isInvalid = {emailDesc !== ""}
                  errorMessage={emailDesc}
                />
                <Input
                  label="Password"
                  type="password"
                  className="max-w"
                  size = "sm"
                  variant= "bordered"
                  onValueChange={setPassword}
                  isInvalid = {passwordDesc !== ""}
                  errorMessage={passwordDesc}
                  />
                
                <Button
                  color="primary"
                  onPress={signIn}
                >
                  Sign In
                </Button>
              </form>

              <div className="pt-6 flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm">
                  <span className="mr-1 hidden sm:inline-block">Don't have an account?</span>
                  <a className="text-primary underline-offset-4 hover:underline" href="/signup">Sign up</a>
                </div>
                  <a className="text-primary text-sm underline-offset-4 hover:underline" href="/reset-password">Reset password</a>
              </div>

            </div>
          </CardBody>
        </Card>
    </div>
  );
}