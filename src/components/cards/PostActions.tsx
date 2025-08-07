import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  EllipsisVertical,
  FilePenLine,
  Heart,
  Megaphone,
  Trash,
} from "lucide-react";
import { useState } from "react";
import { Post } from "@/types/post";
import BoostYourAd from "../modals/BoostYourAd";
import ConfirmModal from "../modals/ConfirmModal";
import useStoreFavorites from "@/hooks/useStoreFavorites";
import useDeletePost from "@/hooks/useDeletePost";
import Link from "next/link";

type propsTypes = {
  post: Post;
  showActions?: boolean;
};

export default function PostActions({ post, showActions }: propsTypes) {
  const [showBoost, setShowBoost] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { storeFavorites } = useStoreFavorites();
  const { deletePost, isPending } = useDeletePost();

  return (
    <>
      {!showActions && (
        <button
          onClick={() => storeFavorites(post?.id)}
          className={`absolute top-4 left-4 z-20 w-8 h-8 flex items-center justify-center rounded-full text-[var(--whiteColor)] bg-black/30 backdrop-blur-sm transition-all hover:bg-red-600 ${post.is_love ? "bg-red-600" : ""}`}
        >
          <Heart width={18} height={18} />
        </button>
      )}

      {showActions && (
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger className="h-9 w-9 rounded-full flex items-center justify-center bg-white border border-[var(--lightBorderColor)] ">
              <EllipsisVertical width={16} height={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[var(--whiteColor)] shadow-[0_2px_8px_rgba(0,0,0,0.1)] z-[99999] min-w-[100px] flex-col rounded border border-[var(--lightBorderColor)] max-h-[400px] overflow-y-auto">
              <DropdownMenuItem asChild>
                <button
                  className="flex items-center gap-2 w-full whitespace-nowrap text-[var(--darkColor)] hover:bg-[var(--lightBorderColor)] px-4 py-2 text-sm"
                  onClick={() => setShowBoost(true)}
                >
                  <Megaphone
                    width={16}
                    height={16}
                    className="text-[var(--mainColor)]"
                  />
                  Promote
                </button>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href={`/edit-post?post_id=${post.id}`} className="flex items-center gap-2 w-full whitespace-nowrap text-[var(--darkColor)] hover:bg-[var(--lightBorderColor)] px-4 py-2 text-sm">
                  <FilePenLine width={16} height={16} />
                  Edit
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <button
                  className="flex items-center gap-2 w-full whitespace-nowrap text-[var(--darkColor)] hover:bg-[var(--lightBorderColor)] px-4 py-2 text-sm"
                  onClick={() => setShowConfirm(true)}
                >
                  <Trash width={16} height={16} className="text-[#FF0000]" />
                  Delete
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <span className="bg-white rounded-[40px] px-3 py-1 text-[var(--darkColor)] block border border-[var(--lightBorderColor)]">
            Available
          </span>
        </div>
      )}

      <BoostYourAd show={showBoost} handleClose={() => setShowBoost(false)} />
      <ConfirmModal
        show={showConfirm}
        modalTitle="Delete Post"
        text="Are you sure you want to delete this post?"
        handleClose={() => setShowConfirm(false)}
        isPending={isPending}
        event={() => deletePost(post?.id)}
      />
    </>
  );
}
