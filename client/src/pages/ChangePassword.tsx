import { FormEvent } from "react";
import { Link } from "react-router-dom";
import Button from "@/components/ButtonV2";
import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "@/Apis/userApis";
import toast from "react-hot-toast";
import { FormInput } from "@/components/Input";
import { useHandleChange } from "@/hooks/useHandleChange";
import Alert from "@/components/Alert";
const intialValue = { currPass: "", newPass: "", retypeNewPass: "" };

export default function ChangePassword() {
  const [formData, handleChange, setFormData] = useHandleChange(intialValue);

  const { mutate, isPending, error } = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      toast.success("Password successfully updated");
      setFormData(intialValue);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  return (
    <main>
      <form
        onSubmit={handleSubmit}
        className="relative mx-auto grid max-w-2xl animate-fadeIn gap-5 rounded-b-2xl bg-white px-9 pb-5 shadow-sm dark:bg-neutral-800"
      >
        <h1 className="mt-4 text-lg text-neutral-800 dark:text-neutral-100">
          Update Your password
        </h1>

        <Alert type="error" message={error?.message} className="-mt-2" />

        <FormInput
          label="Current Password"
          name="currPass"
          value={formData.currPass}
          onChange={handleChange}
          required
          maxLength={64}
          minLength={8}
          type="password"
        />

        <FormInput
          label="New Password"
          name="newPass"
          value={formData.newPass}
          onChange={handleChange}
          required
          maxLength={64}
          minLength={8}
          type="password"
        />

        <FormInput
          label="Confirm Password"
          name="retypeNewPass"
          value={formData.retypeNewPass}
          onChange={handleChange}
          required
          maxLength={64}
          minLength={8}
          pattern={formData.newPass}
          type="password"
          title="Must match with new Password"
        />

        <Button loading={isPending} type="submit">
          Change Password
        </Button>

        <Link to="/account-settings" className="mt-2 text-blue-700 underline">
          Go Back
        </Link>
      </form>
    </main>
  );
}
