import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import { PropsWithChildren } from "react";

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-12 flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative z-10">
                    <Link href="/">
                        <ApplicationLogo className="h-16 w-16 fill-current text-white" />
                    </Link>
                    <h1 className="text-white text-4xl font-bold mt-8">
                        Community Reporter
                    </h1>
                    <p className="text-white text-lg mt-4 opacity-90">
                        Join our community and start reporting issues that
                        matter
                    </p>
                </div>
                <div className="relative z-10">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                        <p className="text-white text-sm italic">
                            "Making our community better, one report at a time."
                        </p>
                        <p className="text-white text-xs mt-2 opacity-75">
                            - Community Team
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
