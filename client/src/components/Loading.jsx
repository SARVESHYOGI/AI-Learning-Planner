import { motion } from "framer-motion";

function Loading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent">
            <div className="relative w-16 h-16">

                {/* Outer Ring */}
                <motion.div
                    className="absolute inset-0 rounded-full border border-slate-700"
                />

                {/* Orbiting Dot */}
                <motion.div
                    className="absolute top-1/2 left-1/2 w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.8)]"
                    style={{ transformOrigin: "-150% -150%" }}
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />

                {/* Center Dot */}
                <motion.div
                    className="absolute top-1/2 left-1/2 w-2 h-2 bg-slate-400 rounded-full -translate-x-1/2 -translate-y-1/2"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
            </div>
        </div>
    );
}

export default Loading;
