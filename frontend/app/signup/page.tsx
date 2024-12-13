'use client'

import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";
import {Input} from "@nextui-org/input";
import {Button} from "@nextui-org/button";
import {GithubIcon, GoogleIcon} from "@/components/icons";
import React from "react";
import { PressEvent } from "@react-types/shared";

export default function SignupPage() {
  let [email, setEmail] = React.useState("")
  let [firstname, setFirstName] = React.useState("")
  let [lastname, setLastName] = React.useState("")
  let [password, setPassword] = React.useState("")
  let [confirmpassword, setConfirmPassword] = React.useState("")

  const isError = React.useMemo(() => {
    if (password === "" || confirmpassword === "")
      return false

    return password !== confirmpassword
  }, [password, confirmpassword])

  const signUp = async (e: PressEvent) => {
    try {
      console.log(email, password);
      let res = await fetch("/api/v1/signup", {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          "email": email,
          "firstname": firstname,
          "lastname": lastname,
          "password": password
        })
      })

      if (res.ok) {
        console.log("Account created sucessfully!");
        let log = document.getElementsByClassName("errorlog")[0];
        log.className = "text-sm text-center errorlog text-lime-400";
        log.innerHTML = "Account created successfully!";
      } else {
        console.log("Account created failed!");
        let data = await res.json();
        console.log(data);
        let log = document.getElementsByClassName("errorlog")[0];
        log.className = "text-sm text-center errorlog text-rose-400";
        if (data["errorcode"] === 101) {
          log.innerHTML = "Email already exists!";
        } else {
          log.innerHTML = "Invalid Email address provided!";
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
              <h3 className="text-2xl font-bold">Sign Up</h3>
              <p className="text-foreground/50 text-sm">Sign up with your external account</p>

              <div className="flex gap-2 flex-col pt-4">
              <Button color="default" startContent={<GoogleIcon size={30} />} variant="ghost" > Continue with Google </Button>
              <Button color="default" startContent={<GithubIcon size={30} />} variant="ghost"> Continue with Github </Button>
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
                  description="We'll never share your email with anyone else."
                  className="max-w"
                  size = "sm"
                  variant= "bordered"
                  onValueChange={setEmail}
                />
                <div className="flex gap-4">
                  <Input
                    type="name"
                    label="First Name"
                    className="max-w"
                    size = "sm"
                    variant= "bordered"
                    onValueChange={setFirstName}
                  />
                  <Input
                    type="name"
                    label="Last Name"
                    className="max-w"
                    size = "sm"
                    variant= "bordered"
                    onValueChange={setLastName}
                  />
                </div>
                <Input
                  label="Password"
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
                  onPress={signUp}
                  isDisabled = {(isError || (email === "" || password === "" || confirmpassword === ""))}
                >
                  Sign Up
                </Button>
                <div className = "text-sm text-center errorlog"></div>
              </form>

              <div className="pt-3 flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm">
                  <span className="mr-1 hidden sm:inline-block">Already have an account?</span>
                  <a className="text-primary underline-offset-4 hover:underline" href="/signin">Sign In</a>
                </div>
              </div>

            </div>
          </CardBody>
        </Card>
    </div>
  );
}