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

export default function ResetPage() {
  let [email, setEmail] = React.useState("")
  let [emailDesc, setEmailDesc] = React.useState("")
  let [password, setPassword] = React.useState("")
  let [confirmpassword, setConfirmPassword] = React.useState("")

  let [recoveryCode, setRecoveryCode] = React.useState("")
  let [passwordDesc, setPasswordDesc] = React.useState("")
  const router = useRouter();

  const isError = React.useMemo(() => {
    if (password === "" || confirmpassword === "")
      return false

    return password !== confirmpassword
  }, [password, confirmpassword])

  const sendCode = async (e: PressEvent) => {
    try {
      setEmailDesc("");
      setPasswordDesc("");
      let res = await fetch("/api/v1/sendcode", {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          "email": email,
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
              <h3 className="text-2xl font-bold">Reset password</h3>
              <p className="text-foreground/50 text-sm">Lost your password? Just enter your email below.</p>
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
                  label="RecoveryCode"
                  type="RecoveryCode"
                  className="max-w"
                  size = "sm"
                  variant= "bordered"
                  onValueChange={setRecoveryCode}
                />

                <Input
                  label="New Password"
                  type="password"
                  className="max-w"
                  size = "sm"
                  variant= "bordered"
                  onValueChange={setPassword}
                />
                
                <Input
                  label="Confirm your Password"
                  type="password"
                  className="max-w"
                  size = "sm"
                  variant= "bordered"
                  onValueChange={setConfirmPassword}
                  isInvalid = {isError}
                  />
                <Button
                  color="primary"
                  onPress={sendCode}
                >
                  Send Recovery Code
                </Button>
              </form>

              <div className="pt-6 flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm">
                  <span className="mr-1 hidden sm:inline-block">Don't have an account?</span>
                  <a className="text-primary underline-offset-4 hover:underline" href="/signup">Sign up</a>
                </div>
              </div>

            </div>
          </CardBody>
        </Card>
    </div>
  );
}