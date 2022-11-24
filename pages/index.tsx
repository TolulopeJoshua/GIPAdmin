import Footer from "../components/footer";
import { useRouter } from "next/router";
import { useSelector } from 'react-redux';
import { docsState } from "../types";

export default function index() {

  const router = useRouter();
  const {docs: {loading, error, docs}} = useSelector((state: {docs: docsState}) => state);

  return (
    <div className="flex flex-col h-full w-full overflow-y-scroll overflow-x-hidden">
      <div className="w-screen p-16 md:p-24 grid md:grid-cols-2 gap-16 md:gap-24">
        {/* <a href={'/books'}> */}
        <div className="border-2 border-slate-500 rounded-lg w-full h-60 hover:bg-slate-700 hover:cursor-default flex align-middle justify-center">
          <div className="min-w-[50%]">
            <h2 className="text-3xl">Books</h2>
            <p className="text-right italic">-{docs.books.length} items-</p>
          </div> 
        </div>
        {/* </a> */}
        {/* <a href={'/biographies'}> */}
        <div className="border-2 border-slate-500 rounded-lg w-full h-60 hover:bg-slate-700 hover:cursor-default flex align-middle justify-center">
          <div className="min-w-[50%]">
            <h2 className="text-3xl">Biographies</h2>
            <p className="text-right italic">-{docs.biographies.length} items-</p>
          </div>
        </div>
        {/* </a> */}
        {/* <a href={'/articles'}> */}
        <div className="border-2 border-slate-500 rounded-lg w-full h-60 hover:bg-slate-700 hover:cursor-default flex align-middle justify-center">
          <div className="min-w-[50%]">
            <h2 className="text-3xl">Articles</h2>
            <p className="text-right italic">-{docs.articles.length} items-</p>
          </div>
        </div>
        {/* </a> */}
        <div className="border-2 border-slate-500 rounded-lg w-full h-60 hover:bg-slate-700 hover:cursor-default flex align-middle justify-center">
          <div className="min-w-[50%]">
            <h2 className="text-3xl">Users</h2>
            <p onClick={() => router.push('/users?isApproved=true')} className="text-right italic">-xxxx registered-</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}


