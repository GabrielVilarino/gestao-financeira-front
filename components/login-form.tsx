"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  username: z.string().min(3, "Usuário deve ter no mínimo 3 caracteres!"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres!"),
});

type LoginData = z.infer<typeof loginSchema>;

const MOCK_USER = {
  username: "admin",
  password: "123456",
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function clearForm() {
    setUsername("");
    setPassword("");
    setError("");
    setIsLoading(false);
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data: LoginData = { username, password };
      loginSchema.parse(data);

      if (username === MOCK_USER.username && password === MOCK_USER.password) {
        clearForm();
        router.push("/home");
      } else {
        setError("Usuário ou senha inválidos");
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0].message);
      } else {
        setError("Erro ao realizar login");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Entre com a sua conta</CardTitle>
          <CardDescription>
            Insira seu usuário abaixo para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">Usuário</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Senha</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline cursor-pointer"
                  >
                    Esqueceu sua senha?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field>
              {error && (
                <div className="text-sm text-destructive">{error}</div>
              )}
              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Entrando..." : "Login"}
                  {isLoading && <Loader className="ml-2 animate-spin" />}
                </Button>
                <FieldDescription className="text-center">
                  Não tem uma conta?{" "}
                  <a href="#" className="hover:underline cursor-pointer">
                    Solicite Cadastro Aqui
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
