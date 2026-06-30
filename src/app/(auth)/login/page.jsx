"use client";
import { authClient } from "@/lib/auth-client";
import {
      Button,
      Description,
      FieldError,
      Fieldset,
      Form,
      Input,
      Label,
      Surface,
      ListBox,
      Select,
      TextField,
} from "@heroui/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import React from "react";

export default function SignInPage() {
      const onSubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const user = Object.fromEntries(formData.entries());

            await authClient.signIn.email({
                  ...user,
                  callbackURL: "/",
            });
      };

      return (
            <div className="min-h-screen bg-[#070D18]">
                  <div className="pointer-events-none fixed inset-0 overflow-hidden">
                        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-red-600/10 blur-3xl" />
                        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-rose-500/5 blur-3xl" />
                  </div>

                  <div className="relative flex items-center justify-center min-h-screen px-4 py-12">
                        <Surface className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8 shadow-[0_0_40px_rgba(220,38,38,0.06)]">
                              <Form onSubmit={onSubmit}>
                                    <Fieldset className="w-full">
                                          <Fieldset.Legend className="text-3xl font-bold tracking-tight text-white">
                                                Sign In
                                          </Fieldset.Legend>
                                          <Description className="text-slate-400 text-sm mb-6">
                                                Welcome back — sign in to your BloodBridge account.
                                          </Description>

                                          <Fieldset.Group className="space-y-5">
                                                <TextField isRequired name="email" type="email">
                                                      <Label className="block text-xs font-semibold text-slate-400 mb-2 ml-1 tracking-wide uppercase">
                                                            Email
                                                      </Label>
                                                      <Input
                                                            placeholder="you@example.com"
                                                            variant="secondary"
                                                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 focus:bg-red-500/[0.02] focus:ring-4 focus:ring-red-500/10 transition-all duration-300"
                                                      />
                                                      <FieldError className="text-xs text-red-400 mt-1 ml-1" />
                                                </TextField>

                                                <TextField isRequired name="password" type="password">
                                                      <Label className="block text-xs font-semibold text-slate-400 mb-2 ml-1 tracking-wide uppercase">
                                                            Password
                                                      </Label>
                                                      <Input
                                                            placeholder="••••••••"
                                                            variant="secondary"
                                                            className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50 focus:bg-red-500/[0.02] focus:ring-4 focus:ring-red-500/10 transition-all duration-300"
                                                      />
                                                      <FieldError className="text-xs text-red-400 mt-1 ml-1" />
                                                </TextField>
                                          </Fieldset.Group>

                                          <Button
                                                type="submit"
                                                className="w-full mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-semibold py-3.5 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] transform hover:-translate-y-0.5 transition-all duration-300"
                                          >
                                                Sign In
                                          </Button>
                                    </Fieldset>
                              </Form>

                              <p className="text-center text-sm text-slate-400 mt-8">
                                    Don&apos;t have an account?{" "}
                                    <Link
                                          href="/register"
                                          className="text-white font-semibold hover:text-red-400 transition-colors underline decoration-white/20 underline-offset-4 hover:decoration-red-400/50"
                                    >
                                          Create one here
                                    </Link>
                              </p>
                        </Surface>
                  </div>
            </div>
      );
}