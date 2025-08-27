import { Category } from "@/types/category";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

type Props = {
  category: Category;
  innerRef?: (el: HTMLAnchorElement | null) => void;
};

export function CategoryLink({ category, innerRef }: Props) {
  return (
    <Link
      href={`/posts?category_id=${category.id}`}
      ref={innerRef}
      className="text-sm text-[var(--darkColor)] hover:text-[var(--mainColor)] whitespace-nowrap"
    >
      <div className="flex items-center gap-2">
        <Image
          src={category.image}
          alt={category.title}
          width={20}
          height={20}
        />
        <span className="block">{category.title}</span>
      </div>
    </Link>
  );
}
