"use server"
import{ signIn} from "@/lib/auth"

export async function signInWithGoogle(){
    await signIn("google", {redirectTo: "/dashboard"})
}

export async function signInWithGithub() {
  await signIn("github", { redirectTo: "/dashboard" })
}

export async function signInWithCredentials(formData: FormData) {
  await signIn("credentials", {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    redirectTo: "/dashboard",
  })
}