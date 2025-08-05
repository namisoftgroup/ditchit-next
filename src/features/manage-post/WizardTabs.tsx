import { POST_TABS } from "@/utils/constants";

export default function WizardTabs({
  activeStepIndex,
}: {
  activeStepIndex: number;
}) {
  return (
    <div className="flex gap-4 isolate relative bg-[#fafafa] rounded-[12px] justify-between">
      <div className="absolute top-1/2 left-0 w-full h-px bg-gray-200 z-0" />

      {POST_TABS.map((tab, index) => {
        const isActive = index <= activeStepIndex;
        return (
          <div
            className="flex items-center gap-2 p-4 px-6 rounded-[12px] z-10 bg-gray-50"
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
