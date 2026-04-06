"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGroupContext } from "@/lib/context/group-context";
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
  email: z.string().min(3, "Usuário deve ter no mínimo 3 caracteres!"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres!"),
});

type LoginData = z.infer<typeof loginSchema>;

type AuthUserResponse = {
  id_usuario: number;
  nome: string;
  email: string;
  is_admin: boolean;
  id_grupo: number | null;
};

type GrupoResponse = {
  id: number;
  nome: string;
  data_criacao: string;
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { updateGroup, clearGroup } = useGroupContext();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function clearForm() {
    setEmail("");
    setSenha("");
    setError("");
    setIsLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data: LoginData = { email, senha };
      loginSchema.parse(data);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao realizar login");
      }

      const userData: AuthUserResponse = await response.json();

      // Se o usuário tem um grupo, buscar os dados do grupo
      if (userData.id_grupo) {
        try {
          const grupoResponse = await fetch(`/api/grupos/${userData.id_grupo}`);
          
          if (grupoResponse.ok) {
            const grupoData: GrupoResponse = await grupoResponse.json();
            updateGroup({
              id: grupoData.id,
              nome: grupoData.nome,
              isAdmin: userData.is_admin, // ← Usa is_admin do login
            });
          } else {
            // Se falhar ao buscar o grupo, limpar dados do grupo
            clearGroup();
          }
        } catch (err) {
          console.error("Erro ao buscar dados do grupo:", err);
          clearGroup();
        }
      } else {
        // Usuário não tem grupo, garantir que o Context está limpo
        clearGroup();
      }

      clearForm();
      router.push("/home");
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0].message);
      }else if (err instanceof Error) {
        setError(err.message);
      }

    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    
  }, []);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Entre com a sua conta</CardTitle>
          <CardDescription>
            Insira seu email abaixo para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
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
