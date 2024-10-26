import { useUserContext } from "@/hooks/useUserCtx";
import { useHandleChange } from "@/hooks/useHandleChange";
import { FormEvent, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateProfile, uploadProfileImg } from "@/Apis/userApis";
import toast from "react-hot-toast";
import { ApiError, IEditUser } from "../types/indext";
import { SpinnerGap } from "@phosphor-icons/react";
import { TextArea } from "@/components/TextArea";
import { FormInput } from "@/components/Input";
import { Link } from "react-router-dom";

export default function EditProfileBeta() {
  const { user, setUser } = useUserContext();
  const [progress, setProgress] = useState(0);
  if (!user) throw new Error("UnAuthorized");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, handleChange] = useHandleChange<Required<IEditUser>>({
    bio: user.bio,
    socialLinks: user.socialLinks || {},
    fullName: user.fullName,
    username: user.username,
    email: user.email,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateProfile,
    onMutate() {
      setProgress(0);
    },
    onSuccess: (data) => {
      toast.success("Your Profile is updated");
      setUser(data);
    },
    onError: (err) => {
      const e = err as ApiError;
      toast.error(e.response?.data.error || "");
    },
  });

  const changeImageMut = useMutation({
    mutationFn(file: File) {
      return uploadProfileImg({ file, onUploadProgress: setProgress });
    },
    onSuccess(data) {
      setUser(data);
      fileInputRef.current!.value = "";
      toast.success("Profile Image Updated");
    },
    onError() {
      toast.error("Failed to Update profile Image");
      fileInputRef.current!.value = "";
    },
  });

  const handeSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  if (!user) return;

  return (
    <div className="m-auto mb-8 max-w-3xl pb-4 pt-4 dark:bg-neutral-800 md:px-5">
      <h2 className="borde\r-b px-2 py-1 text-xl font-bold text-neutral-700">
        Account Settings
      </h2>

      <div className="mt-4 rounded-xl border bg-white p-6">
        <div className="flex items-center gap-4 rounded-xl border bg-slate-100 px-3 py-2">
          <input
            hidden
            type="file"
            ref={fileInputRef}
            disabled={changeImageMut.isPending}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && !changeImageMut.isPending) {
                if (file.size > 5 * 1024 * 1024) {
                  toast.error("File is too large");
                } else if (!file.type.startsWith("image/")) {
                  toast.error("Please upload an valid image file");
                } else {
                  changeImageMut.mutate(file);
                }
              }
            }}
          />
          <div className="relative flex-shrink-0">
            <img
              alt="Your profile pic"
              src={user.image.url}
              className={`h-[60px] w-[60px] shrink-0 cursor-pointer rounded-full object-cover transition-all duration-200 active:scale-90 ${changeImageMut.isPending && "brightness-75"}`}
              onClick={() => fileInputRef.current?.click()}
            />
            {changeImageMut.isPending && (
              <div className="absolute inset-0 grid place-items-center">
                <SpinnerGap size={30} className="animate-spin text-white" />
              </div>
            )}
          </div>

          {changeImageMut.isPending ? (
            <div className="flex w-full items-center gap-2 text-green-600">
              {progress < 100 ? (
                <>
                  <span hidden={progress >= 100} className="text-sm">
                    {progress}%
                  </span>
                  <span className="text-sm">Uploading...</span>
                </>
              ) : (
                <span className="text-sm">Upadating...</span>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm text-blue-500 transition-all duration-200 hover:opacity-80 active:scale-90"
                >
                  Change
                </button>
                <button
                  onClick={() => {
                    alert("Feature is under development, will be added soon");
                  }}
                  className="text-sm text-red-500 transition-all duration-200 hover:opacity-80 active:scale-90"
                >
                  Remove
                </button>
              </div>
              <p className="text-[0.8rem] text-neutral-500">
                JPG or PNG upto 5mb
              </p>
            </div>
          )}
        </div>
      </div>
      <form onSubmit={handeSubmit} className="">
        <fieldset className="mt-4 grid gap-5 border bg-white p-6 md:rounded-xl">
          <div className="text-lg font-medium text-neutral-800">Basic</div>
          <FormInput
            label="Full Name"
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
            onChange={handleChange}
            required
            maxLength={30}
          />
          <FormInput
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            maxLength={64}
          />
          <TextArea
            maxLength={200}
            value={formData.bio}
            onChange={handleChange}
            name="bio"
            label="Bio"
            placeholder="Tell as little bit about you"
            className="resize-none"
            rows={3}
            enableCount
          />
        </fieldset>
        <fieldset className="mt-6 rounded-xl border bg-white p-6">
          <div className="text-lg font-medium text-neutral-700">
            Social Links
          </div>
          <small className="text-sm text-neutral-400">
            Add links to your website, blog, or social media profiles.
          </small>
          <div className="mt-4 grid gap-5">
            <FormInput
              label="Website Link"
              placeholder="Your personal site url"
              type="url"
              value={formData.socialLinks.website}
              onChange={handleChange}
            />
            <FormInput
              label="Instagram Link"
              placeholder="http://instagram.com/your_username"
              type="url"
              value={formData.socialLinks.instagram}
              onChange={handleChange}
              name="socialLinks.instagram"
            />
            <FormInput
              label="Twitter Link"
              placeholder="http://twitter.com/your_username"
              type="url"
              value={formData.socialLinks.twitter}
              onChange={handleChange}
              name="socialLinks.twitter"
            />
            <FormInput
              label="Youtube Link"
              placeholder="http://youtube.com/your_username"
              type="url"
              value={formData.socialLinks.youtube}
              onChange={handleChange}
              name="socialLinks.youtube"
            />
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={isPending}
          className="bottom-0 mt-6 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-center text-white shadow-inner transition-all duration-300 enabled:hover:opacity-90 enabled:active:scale-90"
        >
          {isPending ? (
            <SpinnerGap size={27} className="animate-spin" />
          ) : (
            <>Save</>
          )}
        </button>
      </form>

      <div className="mt-6 rounded-xl border bg-white p-6">
        <h3 className="mb-4 text-xl font-semibold text-neutral-800">
          Account Security
        </h3>
        <div className="flex flex-col items-start gap-2">
          <Link
            to={"/change-password"}
            className="rounded-md px-2 py-2 text-sm text-blue-500 hover:bg-slate-200"
          >
            Change Password
          </Link>
          {/* Delete Account modal pending */}
          <button className="rounded-md px-2 py-2 text-sm text-red-600 hover:bg-slate-200">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

{
  /* <div className="mt-4 rounded-xl bg-white p-6">
        <div className="flex items-center gap-4 rounded-xl bg-slate-100 px-2 py-2">
          <img alt="" src={user.image.url} className="h-16 w-16 rounded-full" />
          <button className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white">
            Change Image
          </button>
        </div>
      </div> */
}
