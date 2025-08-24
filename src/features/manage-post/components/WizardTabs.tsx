import { POST_TABS } from "@/utils/constants";

export default function WizardTabs({
  activeStepIndex,
}: {
  activeStepIndex: number;
}) {
  return (
    <div className="flex gap-4 isolate relative bg-[#fafafa] rounded-[12px] justify-between md:flex-row flex-col">
      <div className="absolute bg-gray-300 z-0 h-full w-px top-0 left-[36px] lg:top-1/2 lg:left-0 lg:w-full lg:h-px lg:bg-gray-200" />

      {POST_TABS.map((tab, index) => {
        const isActive = index <= activeStepIndex;
        return (
          <div
            className="flex items-center gap-2 p-4 md:px-6 px-4 rounded-[12px] z-10 bg-gray-50"
            key={index}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isActive
                  ? "text-white !bg-[var(--mainColor)]"
                  : "bg-white text-black"
              }`}
            >
              {index + 1}
            </div>
            <h6
              className={`text-sm font-semibold ${
                isActive ? "!text-[var(--mainColor)]" : "text-black"
              }`}
            >
              {tab}
            </h6>
          </div>
        );
      })}
    </div>
  );
}
