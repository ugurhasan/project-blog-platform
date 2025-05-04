// components/Menu.tsx
import Link from 'next/link';

export default function Menu() {
  return (
    <div className="fixed left-0 top-0 h-screen w-16 bg-gray-100 flex flex-col items-center pt-16 pb-4">
      <div className="flex flex-col items-center space-y-8 flex-1 mt-10">
        {/* Home */}
        <div className="group relative">
          <Link href="/" className="text-white transition-colors">
            <div className="flex flex-col items-center hover:bg-gray-200 p-2 rounded-xl duration-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#888888" viewBox="0 0 256 256"><path d="M222.14,105.85l-80-80a20,20,0,0,0-28.28,0l-80,80A19.86,19.86,0,0,0,28,120v96a12,12,0,0,0,12,12H216a12,12,0,0,0,12-12V120A19.86,19.86,0,0,0,222.14,105.85ZM204,204H52V121.65l76-76,76,76Z"></path></svg>
            </div>
          </Link>
          <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-sm py-1 px-3 rounded-md whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
            Home
          </div>
        </div>
        
        {/* Profile */}
        <div className="group relative">
          <Link href="/profile" className="text-white transition-colors">
            <div className="flex flex-col items-center hover:bg-gray-200 p-2 rounded-xl duration-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#888888" viewBox="0 0 256 256"><path d="M234.38,210a123.36,123.36,0,0,0-60.78-53.23,76,76,0,1,0-91.2,0A123.36,123.36,0,0,0,21.62,210a12,12,0,1,0,20.77,12c18.12-31.32,50.12-50,85.61-50s67.49,18.69,85.61,50a12,12,0,0,0,20.77-12ZM76,96a52,52,0,1,1,52,52A52.06,52.06,0,0,1,76,96Z"></path></svg>
            </div>
          </Link>
          <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-sm py-1 px-3 rounded-md whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
            Profile
          </div>
        </div>
    
        {/* Add Post Button */}
        <div className="mt-auto group relative">
            <Link href="/add-post" className="text-white transition-colors">
            <div className="flex flex-col items-center bg-blue-900 hover:bg-blue-800 duration-100 p-3 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#ffffff" viewBox="0 0 256 256"><path d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z"></path></svg>
            </div>
            </Link>
            <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-sm py-1 px-3 rounded-md whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
            Add Post
            </div>
        </div>
      </div>

    </div>
  );
}