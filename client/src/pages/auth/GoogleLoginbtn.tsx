import { useUserContext } from "@/hooks/useUserCtx";
import { apiRq } from "@/lib/makeRq";
import { User } from "@/types/indext";
import { GoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

export default function GoogleLoginBtn() {
  const { setUser } = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();

  const { mutate, isPending } = useMutation({
    mutationFn: async (idToken: string) => {
      const res = await apiRq.post<{ user: User }>(`api/user/google-login`, {
        idToken,
      });

      return res.data.user;
    },
    onSuccess: (user) => {
      const from = location.state?.from?.pathname || "/";
      setUser(user);
      navigate(from, { replace: true });
    },
    onError: () => {
      toast.error("Failed to login with google, please try again");
    },
  });

  return (
    <div className="mt-4 flex justify-center">
      {isPending && <p className="animate-pulse text-lg">Logining you in...</p>}
      <div style={{ display: isPending ? "none" : "block" }} className="">
        <GoogleLogin
          onSuccess={async (v) => {
            mutate(v.credential!);
          }}
          onError={() => {
            toast.error("Failed to login with google, please try again");
          }}
          shape="pill"
          text="continue_with"
          useOneTap
        />
      </div>
    </div>
  );
}
