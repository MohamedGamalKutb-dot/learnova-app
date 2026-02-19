import { Link } from "react-router-dom";
import { Button } from "@heroui/react";
import { Home2, ArrowLeft } from "iconsax-react";

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="text-center animate-slide-up">
                {/* 404 Number */}
                <div className="relative mb-8">
                    <h1 className="text-[150px] sm:text-[200px] font-black gradient-text leading-none select-none opacity-80">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 bg-indigo-500/20 rounded-full blur-[60px]" />
                    </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                    Page Not Found
                </h2>
                <p className="text-gray-400 text-lg mb-10 max-w-md mx-auto">
                    Oops! The page you&apos;re looking for doesn&apos;t exist or has been
                    moved.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                    <Button
                        as={Link}
                        to="/"
                        size="lg"
                        className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold px-8 shadow-lg shadow-indigo-500/30"
                        startContent={<Home2 size={18} />}
                    >
                        Go Home
                    </Button>
                    <Button
                        as={Link}
                        to={-1}
                        variant="bordered"
                        size="lg"
                        className="border-white/20 text-white hover:bg-white/5 px-8"
                        startContent={<ArrowLeft size={18} />}
                    >
                        Go Back
                    </Button>
                </div>
            </div>
        </div>
    );
}
