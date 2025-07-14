import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Fragment } from "react";

type BreadcrumbLinkType = {
  title: string;
  link: string;
};

export default function PageBanner({
  links,
  page,
}: {
  links: BreadcrumbLinkType[];
  page: string;
}) {
  return (
    <div className="bg-[#f5f5f5] py-7 relative isolate">
      <div className="container px-4">
        <Breadcrumb>
          <BreadcrumbList>
            {links.map((item, index) => (
              <Fragment key={index}>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={item.link} className="capitalize text-[var(--mainColor)]">
                      {item.title}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator className="text-[var(--mainColor)]" />
              </Fragment>
            ))}

            <BreadcrumbItem>
              <BreadcrumbPage className="text-[var(--grayColor)]">
                {page}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}
