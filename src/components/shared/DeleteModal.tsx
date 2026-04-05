"use client";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

export default function DeleteModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading = false,
}: Props) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* BACKDROP */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* MODAL */}
            <div className="relative bg-white dark:bg-[#0A0A0A] rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-black/50 border border-transparent dark:border-white/5 w-full max-w-md p-6 animate-in fade-in zoom-in transition-all duration-300">

                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
                    Confirm Action
                </h2>

                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm font-medium leading-relaxed">
                    This action cannot be undone. All associated data and files will be permanently removed.
                </p>

                <div className="flex justify-end gap-3">

                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 font-bold text-sm transition-all"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-5 py-2.5 rounded-xl text-white font-bold text-sm shadow-sm transition-all active:scale-95 ${isLoading
                                ? "bg-gray-400 dark:bg-gray-800 cursor-not-allowed"
                                : "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500"
                            }`}
                    >
                        {isLoading ? "Processing..." : "Confirm Delete"}
                    </button>

                </div>
            </div>
        </div>
    );
}