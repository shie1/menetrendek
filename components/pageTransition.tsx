import { motion } from "framer-motion"
import { useCookies } from "react-cookie"

const PageTransition = ({ children }: { children: any }) => {
    const [cookies] = useCookies(["nerf-mode"])

    return (cookies["nerf-mode"] === "true" ? children : <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: .2 }}
    >{children}</motion.div>)
}

export default PageTransition