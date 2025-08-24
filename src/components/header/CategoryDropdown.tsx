import Image from "next/image";
import Link from "next/link";
import { Category } from "@/types/category";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type Props = {
  categories: Category[];
};

export function CategoryDropdown({ categories }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 text-sm text-[var(--darkColor)] hover:[text-var(--mainColor)] whitespace-nowrap">
        <Image src="/icons/more.svg" alt="More" width={20} height={20} />
        More
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-[var(--whiteColor)] shadow-[0_2px_8px_rgba(0,0,0,0.1)] min-w-[200px] z-20 flex-col rounded border border-[var(--lightBorderColor)] max-h-[400px] overflow-y-auto">
        {categories.map((cat) => (
          <DropdownMenuItem key={cat.id} asChild>
            <Link
              href={`/posts?category_id=${cat.id}`}
              className="flex items-center gap-2 whitespace-nowrap text-[var(--darkColor)] hover:bg-[var(--lightBorderColor)] px-4 py-2 text-sm"
            >
              <Image src={cat.image} alt={cat.title} width={20} height={20} />
              {cat.title}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
