import Image from "next/image";
import Link from "next/link";
import { Category } from "@/types/category";

type Props = {
  category: Category;
  innerRef?: (el: HTMLAnchorElement | null) => void;
};

export function CategoryLink({ category, innerRef }: Props) {
  return (
    <Link
      href={`/all-posts?category_id=${category.id}`}
      ref={innerRef}
      className="flex items-center gap-2 text-sm text-[var(--darkColor)] hover:text-[var(--mainColor)] whitespace-nowrap"
    >
      <Image src={category.image} alt={category.title} width={20} height={20} />
      {category.title}
    </Link>
  );
}
