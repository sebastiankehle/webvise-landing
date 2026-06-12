import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { toast } from "sonner";
import z from "zod";

import Loader from "@/components/loader";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { H1 } from "@/components/ui/typography";
import { authClient } from "@/lib/auth-client";

export default function SignInForm() {
	const router = useRouter();
	const { isPending } = authClient.useSession();

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			await authClient.signIn.email(
				{
					email: value.email,
					password: value.password,
				},
				{
					onSuccess: (ctx) => {
						posthog.identify(ctx.data.user.id, { email: ctx.data.user.email });
						posthog.capture("user_signed_in");
						router.push("/dashboard" as never);
						toast.success("Sign in successful");
					},
					onError: (error) => {
						posthog.capture("user_sign_in_error", {
							reason: error.error.message || error.error.statusText,
						});
						toast.error(error.error.message || error.error.statusText);
					},
				}
			);
		},
		validators: {
			onSubmit: z.object({
				email: z.email("Invalid email address"),
				password: z.string().min(8, "Password must be at least 8 characters"),
			}),
		},
	});

	if (isPending) {
		return <Loader />;
	}

	return (
		<div className="mx-auto mt-10 w-full max-w-md p-6">
			<H1 className="mb-6 text-center text-3xl md:text-3xl">Welcome Back</H1>

			<form
				className="space-y-4"
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				<form.Field name="email">
					{(field) => (
						<FormItem>
							<FormLabel htmlFor={field.name}>Email</FormLabel>
							<Input
								id={field.name}
								name={field.name}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								type="email"
								value={field.state.value}
							/>
							<FormMessage errors={field.state.meta.errors} />
						</FormItem>
					)}
				</form.Field>

				<form.Field name="password">
					{(field) => (
						<FormItem>
							<FormLabel htmlFor={field.name}>Password</FormLabel>
							<Input
								id={field.name}
								name={field.name}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								type="password"
								value={field.state.value}
							/>
							<FormMessage errors={field.state.meta.errors} />
						</FormItem>
					)}
				</form.Field>

				<form.Subscribe
					selector={(state) => [state.canSubmit, state.isSubmitting]}
				>
					{([canSubmit, isSubmitting]) => (
						<SubmitButton
							className="self-start"
							disabled={!canSubmit}
							isSubmitting={isSubmitting}
						>
							Sign In
						</SubmitButton>
					)}
				</form.Subscribe>
			</form>
		</div>
	);
}
