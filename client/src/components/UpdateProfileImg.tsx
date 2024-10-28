import { useEffect, useRef, useState } from "react";
import { useUserContext } from "@/hooks/useUserCtx";
import { updateProfile } from "@/Apis/userApis";
import toast from "react-hot-toast";
import { SpinnerGap } from "@phosphor-icons/react";
import { twMerge } from "tailwind-merge";
import { Upload } from "@phosphor-icons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PLACEHOLDER_USER_IMG } from "@/lib/utils";

export default function UpdateProfileImg() {
  const { user, setUser } = useUserContext();
  const queryClient = useQueryClient();
  const [img, setImg] = useState(user?.image.url || "");
  const mutKey = ["profile-img-update"];
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImg(user?.image.url || PLACEHOLDER_USER_IMG);
  }, [user?.image.url]);

  const { mutate } = useMutation({
    mutationFn: updateProfile,
    onSuccess(user) {
      toast.success("Your Profile Image Updated");
      setUser({ ...user, image: user.image });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError() {
      toast.error("Failed to update profile image");
    },
    mutationKey: mutKey,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an valid image file");
      return;
    } else if (file.size > 1024 * 1024 * 5) {
      toast.error("Image size must be less than 5MB");
      return;
    }
    const formData = new FormData();
    formData.append("image", file);
    mutate(formData);
    e.target.value = "";
  };

  const isPending = queryClient.isMutating({ mutationKey: mutKey }) > 0;

  return (
    <div className="group relative mx-auto w-max">
      <input
        disabled={isPending}
        id="image-input"
        hidden={true}
        type="file"
        className="peer"
        accept="image/*"
        ref={inputRef}
        onChange={handleChange}
      />

      <button
        disabled={isPending}
        type="button"
        onClick={() => inputRef.current?.click()}
        title="Change Image"
      >
        <img
          src={img}
          alt="Your profile-image"
          width={150}
          height={150}
          className={twMerge(
            `peer h-[150px] w-[150px] cursor-pointer rounded-full border object-cover transition-all duration-300 dark:border-neutral-700`,
            isPending ? "animate-pulse opacity-80" : "group-hover:opacity-80",
          )}
        />

        {!isPending && (
          <div className="absolute inset-0 hidden cursor-pointer items-center justify-center rounded-full transition-all duration-300 group-hover:flex group-focus:flex group-active:scale-90">
            <span className="absolute rounded-full bg-black/50 p-6" />
            <Upload size={22} weight="bold" color="white" className="z-50" />
          </div>
        )}
      </button>

      {isPending && (
        <div className="absolute inset-0 grid place-items-center">
          <SpinnerGap className="animate-spin" size={50} color="white" />
        </div>
      )}
    </div>
  );
}
