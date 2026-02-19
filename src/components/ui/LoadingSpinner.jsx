import { Spinner } from "@heroui/react";

export default function LoadingSpinner({ size = "lg", label = "Loading..." }) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0a0a0f]">
            <div className="flex flex-col items-center gap-4 animate-fade-in">
                <Spinner size={size} color="secondary" />
                <p className="text-gray-400 text-sm font-medium tracking-wide">
                    {label}
                </p>
            </div>
        </div>
    );
}
