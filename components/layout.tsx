import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { Toaster } from "./ui/toaster";

export default function Layout(props: { title: string; children: ReactNode; }) {
  const {title, children} = props;
  return(
    <div>
      <div className="w-full">
        <div className="border-b">
          <div className="flex items-center px-4 max-w-screen-xl mx-auto">
            <Link href='/'>
              <Image src='/liberteam.jpeg' width={70} height={70} alt='logo-liberteam' />
            </Link>

            <div className="ml-auto flex items-center space-x-4">
              <span className="text-lg text-gray-600">Quiz APP 1.0</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t">
        {children}
      </div>
      {/* <div className="w-full bg-gray-400 p-4">
        <div className="max-w-screen-xl mx-auto">
          <span className="text-white">Copyright &copy; 2024 Liberteam Technology</span>
        </div>
      </div> */}
      <Toaster />
    </div>
  )
}