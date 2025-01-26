import {
  FacebookLogo,
  InstagramLogo,
  TwitterLogo,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { useUserContext } from "@/hooks/useUserCtx";
import { useHandleChange } from "@/hooks/useHandleChange";
import { FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/Apis/userApis";
import toast from "react-hot-toast";
import UpdateProfileImg from "@/components/UpdateProfileImg";
import { ApiError, IEditUser } from "../types/indext";
import { LinkSimple } from "@phosphor-icons/react";
import { TextArea } from "@/components/TextArea";
import { FormInput, InputWithIcon } from "@/components/Input";
import Button from "@/components/ButtonV2";
import { useScrollToTop } from "@/hooks/useScroll";
import Logout from "@/components/Logout";

export default function AccountSettings() {
  const { user, setUser } = useUserContext();
  const queryClient = useQueryClient();
  if (!user) throw new Error("UnAuthorized");

  const [formData, handleChange] = useHandleChange<Required<IEditUser>>({
    bio: user.bio,
    socialLinks: user.socialLinks || {},
    fullName: user.fullName,
    username: user.username,
    email: user.email,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      toast.success("Your Profile is updated");
      queryClient.removeQueries({ queryKey: ["user"] });
      queryClient.removeQueries({ queryKey: ["posts"] });
      setUser(data);
    },
    onError: (err) => {
      const e = err as ApiError;
      toast.error(e.response?.data.error || "");
    },
  });

  const handeSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  useScrollToTop();

  return (
    <div className="m-auto max-w-2xl space-y-6 pb-6 pt-2">
      <section className="bg-white px-4 pb-6 pt-3 dark:bg-neutral-800 md:rounded-xl md:px-6">
        <Link
          to={"/profile/" + user.username}
          className="text-sm text-blue-500/90 hover:underline dark:text-neutral-400"
        >
          Go to Profile
        </Link>

        <UpdateProfileImg />

        <form onSubmit={handeSubmit} className="mt-3 grid gap-4">
          <FormInput
            label="Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            maxLength={30}
          />
          <FormInput
            label="Username"
            name="username"
            value={formData.username}
            pattern="^[a-zA-Z0-9_]+$"
            title="Username must be 3-16 characters, containing letters,numbers and underscore"
            onChange={(e) => {
              const value = e.target.value.toLowerCase();
              if (value && !/^[a-zA-Z0-9_]+$/.test(e.target.value)) return;
              e.target.value = value;
              handleChange(e);
            }}
            required
            maxLength={30}
          />
          <FormInput
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            maxLength={40}
            type="email"
          />
          <TextArea
            maxLength={200}
            onChange={handleChange}
            value={formData.bio}
            label="Bio"
            name="bio"
            placeholder="Tell as little bit about you"
            className="resize-none"
            rows={3}
            enableCount
          />

          <div className="mt-2 border-b text-xl font-medium text-neutral-800 dark:border-neutral-600 dark:text-neutral-300">
            Social Links:
          </div>

          <InputWithIcon
            label="instagram"
            title="Your Website Link"
            name="socialLinks.website"
            value={formData.socialLinks.website}
            placeholder="Website link (http://...)"
            onChange={handleChange}
            icon={<LinkSimple size={25} />}
            maxLength={100}
            type="url"
          />
          <InputWithIcon
            label="instagram"
            title="Your Instagram Link"
            name="socialLinks.instagram"
            value={formData.socialLinks.instagram}
            placeholder="Instagram link (http://...)"
            onChange={handleChange}
            icon={<InstagramLogo size={25} weight="fill" />}
            maxLength={100}
            type="url"
          />
          <InputWithIcon
            label="Facebook"
            title="Your facebook Link"
            name="socialLinks.facebook"
            value={formData.socialLinks.facebook}
            placeholder="Facebook link (http://...)"
            onChange={handleChange}
            icon={<FacebookLogo size={25} weight="fill" />}
            maxLength={100}
            type="url"
          />
          <InputWithIcon
            title="Your Twitter Link"
            label="twitter"
            name="socialLinks.twitter"
            value={formData.socialLinks.twitter}
            placeholder="Twitter link (http://...)"
            onChange={handleChange}
            icon={<TwitterLogo size={25} weight="fill" />}
            maxLength={100}
            type="url"
          />

          <Button loading={isPending} type="submit" className="mt-4">
            Update profile
          </Button>
        </form>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-neutral-800">
        <h3 className="mb-2 text-xl font-semibold text-neutral-800 dark:text-neutral-200">
          Account Security
        </h3>
        <div className="gap-1s flex flex-col items-start">
          <Link
            to="/change-password"
            type="button"
            className="-ml-2 rounded-md px-2 py-2 text-sm text-blue-500 transition-all duration-200 hover:bg-slate-200 hover:underline active:scale-90 dark:hover:bg-neutral-700"
          >
            Change Password
          </Link>
          <Logout>
            {(logout) => (
              <button
                onClick={logout}
                type="button"
                className="-ml-2 rounded-md px-2 py-2 text-sm text-blue-500 transition-all duration-200 hover:bg-slate-200 active:scale-90 dark:hover:bg-neutral-700"
              >
                Logout
              </button>
            )}
          </Logout>
        </div>
      </section>
    </div>
  );
}
