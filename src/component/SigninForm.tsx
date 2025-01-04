// We're using a client component to show a loading state
"use client";

import { TextInput, PasswordInput } from "@mantine/core";
import { SubmitButton } from "./SubmitButton";

export function SigninForm() {

  return (<>
    <TextInput
        name="username"
        radius="lg"
        description="Username registered on vault"
        label="Username"
        placeholder="Username"
    />
    <PasswordInput
        name="password"
        radius="lg"
        label="Password"
        description="the word that only you can remember"
        placeholder="Password"/>
    <SubmitButton value="Submit"></SubmitButton>

</>
  );
}