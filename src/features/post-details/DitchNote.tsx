export default function DitchNote() {
  return (
    <div className="p-6 border border-[var(--lightBorderColor)] rounded-[16px] bg-[var(--whiteColor)]">
      <h4 className="font-bold text-[18px] mb-4 pb-4 border-b border-b-[var(--lightBorderColor)]">
        Introducing Ditchit - The Ultimate Local Marketplace!
      </h4>

      <ul>
        <li className="flex flex-wrap p-4 rounded-[16px] gap-2">
          <p className="font-bold text-[14px]">
            Buy, Sell, Ditchit - The Win-Win Marketplace.
          </p>
        </li>
        <li className="flex flex-wrap p-4 rounded-[16px] gap-2 bg-[#f5f5f5]">
          <p className="font-bold text-[14px]">
            Ditchit offers a thrilling experience: list in 30 seconds, explore
            new arrivals daily, and connect with buyers and sellers in a secure
            community. Build your reputation, find hidden gems, and join
            millions of users shopping&nbsp;locally!
          </p>
        </li>
      </ul>
    </div>
  );
}
