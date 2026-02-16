// components/Toast.tsx
"use client";

type ToastProps = {
  show: boolean;
  type: "success" | "warning" | "error";
  message: string;
};

export default function Toast({ show, type, message }: ToastProps) {
  const styles = {
    success: {
      bg: "bg-[#F1F5F2]",
      text: "text-[#2C2C2C]",
      iconBg: "bg-[#E1F1DC]",
      iconColor: "text-[#507D38]",
      iconPath:
        "M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z",
    },
    warning: {
      bg: "bg-[#FFF4DC]",
      text: "text-[#8A5A00]",
      iconBg: "bg-[#FFE8B0]",
      iconColor: "text-[#FFA500]",
      iconPath:
        "M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z",
    },
    error: {
      bg: "bg-[#FEE2E2]",
      text: "text-[#B91C1C]",
      iconBg: "bg-[#FCA5A5]",
      iconColor: "text-[#B91C1C]",
      iconPath:
        "M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 13a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-1-8a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0V6a1 1 0 0 1 1-1Z",
    },
  };

  const s = styles[type];

  return (
    <div
      role="alert"
      className={`fixed top-5 left-1/2 z-50 transform transition-all duration-300 ease-out ${
        show
          ? "-translate-x-1/2 translate-y-0 opacity-100"
          : "-translate-x-1/2 -translate-y-10 opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`flex items-center w-full max-w-sm p-4 mb-4 ${s.text} ${s.bg} border rounded-lg shadow-lg text-base`}
      >
        <div
          className={`inline-flex items-center justify-center w-8 h-8 ${s.iconColor} ${s.iconBg} rounded-lg`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d={s.iconPath} />
          </svg>
        </div>
        <div className="ms-3 font-medium">{message}</div>
      </div>
    </div>
  );
}
