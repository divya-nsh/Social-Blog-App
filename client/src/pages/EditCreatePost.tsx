import { FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import { NotFoundPage } from "./NotFound";
import TagsInput from "@/components/TagsInput";
import { useQuery } from "@tanstack/react-query";
import { getPost } from "@/Apis/posts-apis";
import { EditCreatePostT, IPost } from "@/types/indext";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useSavePostMut } from "@/hooks/mutationHooks";
import { useScrollToTop } from "@/hooks/useScroll";
import FetchFail from "@/components/FetchFail";
import Button from "@/components/ButtonV2";

export default function EditCreatePost() {
  const { postId } = useParams();
  return <EditCreatePostInner key={postId || "create"} />;
}

function EditCreatePostInner() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<EditCreatePostT>({
    content: "",
    title: "",
    tags: [],
  });

  const saveMut = useSavePostMut({
    onSuccess: (data) => {
      toast.success("Post succefully saved");
      navigate(`/post/${data._id}`);
    },
    onError: (err) => toast.error(err.message),
  });

  const postQ = useQuery<IPost | null, AxiosError>({
    queryFn: () => (postId ? getPost(postId) : null),
    queryKey: ["posts", postId],
    enabled: !!postId,
  });

  useEffect(() => {
    const post = postQ.data;
    if (!post?.isViewerAuthor) return;
    setFormData({
      editPostId: post._id,
      title: post.title,
      content: post.content,
      tags: post.tags,
      coverImgUrl: post.coverImgUrl,
    });
  }, [navigate, postQ.data]);

  useScrollToTop();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024 * 5) {
      return toast.error("File size must be less than 5MB");
    } else if (!file.type.startsWith("image/")) {
      return toast.error("File must be an image");
    }
    setFormData((p) => ({
      ...p,
      coverImg: file,
      coverImgUrl: URL.createObjectURL(file),
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const titleL = formData.title?.length || 0;
    if ((formData.content?.length || 0) < 50) {
      toast.error("Content must contain at least 50 characters.");
    }
    if (titleL < 10 || titleL > 150) {
      toast.error("Title must contain between 10 and 150 characters.");
    } else {
      saveMut.mutate(formData);
    }
  };

  if (postId && postQ.isPending) {
    return <h1 className="mt-4 animate-pulse text-center">Loading.....</h1>;
  }

  if (postQ.error) {
    if (
      postQ.error?.response?.status === 404 ||
      (postQ.data && !postQ.data.isViewerAuthor)
    )
      return <NotFoundPage />;
    return <FetchFail />;
  }

  return (
    <main className="mx-auto mb-10 mt-2 max-w-4xl rounded-xl border bg-white px-5 py-1 pt-5 dark:border-none dark:bg-neutral-800">
      <form
        className="mb-6"
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
      >
        {/*Cover Image Input */}
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <input
            disabled={saveMut.isPending}
            title="Add a cover Image"
            ref={fileInputRef}
            id="imageFile"
            type="file"
            accept="image/*"
            hidden
            onChange={handleFile}
          />
          {formData.coverImgUrl && (
            <img
              alt="Cover Image"
              src={formData.coverImgUrl}
              style={{
                aspectRatio: "16/9",
              }}
              className="w-[200px] rounded-md object-cover transition-all duration-300"
            />
          )}

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variants="outlined"
              className="border-slate-300 py-1.5 text-sm"
            >
              {formData.coverImgUrl ? "Change " : "Add cover image"}
            </Button>
            {formData.coverImgUrl && (
              <Button
                variants="danger"
                className="py-1.5 text-sm"
                onClick={() => {
                  if (fileInputRef.current) fileInputRef.current.value = "";
                  setFormData((p) => ({
                    ...p,
                    coverImg: null,
                    coverImgUrl: "",
                  }));
                }}
              >
                Remove
              </Button>
            )}
          </div>
        </div>

        <input
          minLength={10}
          title="Post Title"
          maxLength={150}
          required
          value={formData.title}
          disabled={saveMut.isPending}
          type="text"
          placeholder="Title"
          className="w-full rounded-md border bg-transparent px-3 py-2 text-2xl font-semibold text-neutral-900 outline-none transition duration-100 focus:border-neutral-400 dark:text-neutral-200 dark:focus:border-neutral-300 lg:text-3xl"
          onChange={(e) => {
            if (e.target.value.length > 200) return;
            setFormData((p) => ({ ...p, title: e.target.value }));
          }}
        />

        <ReactQuill
          value={formData.content || ""}
          readOnly={saveMut.isPending}
          className="mb-2 mt-2"
          theme="snow"
          onChange={(v) => {
            setFormData((p) => ({ ...p, content: v }));
          }}
          modules={{
            toolbar: toolbarOptions,
            clipboard: {
              matchVisual: false,
            },
          }}
        />

        <TagsInput
          onChange={(v) => {
            setFormData((p) => ({ ...p, tags: v }));
          }}
          defaultValue={postQ.data?.tags}
        />

        <Button type="submit" className="mt-4 px-6 py-2.5">
          {saveMut.isPending ? (
            "Saving..."
          ) : postId ? (
            <>Update</>
          ) : (
            <>Publish</>
          )}
        </Button>
      </form>

      {/* Top loader */}
      {saveMut.isPending && (
        <div
          className={`fixed left-0 top-12 z-50 h-1 rounded-r-lg bg-green-400 transition-all`}
          style={{
            width: saveMut.uploadProgress + "%",
            transitionDuration: saveMut.uploadProgress >= 100 ? "0.3s" : "2s",
          }}
        />
      )}
    </main>
  );
}

const toolbarOptions = [
  ["bold", "italic", "underline", "strike", { indent: "-1" }, { indent: "+1" }],
  // toggled buttons
  [{ header: 1 }], // custom button values
  // [{ size: ["small", false, "large", "huge"] }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ header: [1, 2, 3, false] }],
  // [{ font: [false] }],
  [{ align: [] }],
  ["link", "code-block", "blockquote"],
  ["clean"], // remove formatting button
];
